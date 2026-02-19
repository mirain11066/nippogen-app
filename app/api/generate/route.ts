import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/anthropic";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FREE_MONTHLY_LIMIT = 5;
const PRO_MONTHLY_LIMIT = 100;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
        const { bullets, template, tone, language, accessToken } = body;

    // --- Validation ---
    if (!bullets || typeof bullets !== "string" || bullets.trim().length < 10) {
      return NextResponse.json(
        { error: "箇条書きを10文字以上入力してください。" },
        { status: 400 }
      );
    }

    if (bullets.length > 5000) {
      return NextResponse.json(
        { error: "入力が長すぎます（5000文字以内）。" },
        { status: 400 }
      );
    }

    const validTemplates = ["daily", "weekly", "client"];
    const validTones = ["formal", "standard", "casual"];

    if (!validTemplates.includes(template)) {
      return NextResponse.json(
        { error: "無効なテンプレートです。" },
        { status: 400 }
      );
    }

    if (!validTones.includes(tone)) {
      return NextResponse.json(
        { error: "無効なトーンです。" },
        { status: 400 }
      );
    }

    // --- User authentication ---
    let userId: string | null = null;
    let userEmail: string | null = null;
    let userPlan = "free";

    if (accessToken) {
      const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken);
      if (user) {
        userId = user.id;
        userEmail = user.email ?? null;

        const { data: profile } = await supabaseAdmin
          .from("user_profiles")
          .select("plan")
          .eq("email", user.email)
          .single();

        if (profile) userPlan = profile.plan;
      }
    }

    // --- Usage check ---
    const monthlyLimit = userPlan === "pro" ? PRO_MONTHLY_LIMIT : FREE_MONTHLY_LIMIT;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const identifier = userId || ip;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count } = await supabaseAdmin
      .from("usage_records")
      .select("*", { count: "exact", head: true })
      .eq("user_identifier", identifier)
      .gte("created_at", monthStart);

    const usageCount = count ?? 0;

    if (usageCount >= monthlyLimit) {
      return NextResponse.json(
        {
          error: `今月の利用枠（${monthlyLimit}件）を使い切りました。${userPlan === "free" ? "Proプランにアップグレードしてください。" : ""}`,
          usage: { used: usageCount, limit: monthlyLimit },
        },
        { status: 429 }
      );
    }

    // --- Generate report via Claude ---
       const result = await generateReport({ bullets, template, tone, language });

    // --- Log usage ---
    await supabaseAdmin.from("usage_records").insert({
      user_identifier: identifier,
      template,
      tone,
      input_length: bullets.length,
      output_length: result.report.length,
      input_tokens: result.inputTokens,
      output_tokens: result.outputTokens,
      cost_usd: result.costUsd,
    });

    // --- Save to report_history (Pro users only) ---
    if (userId && userPlan === "pro") {
            await supabaseAdmin.from("report_history").insert({
        user_id: userId,
        bullets_input: bullets,
        report_output: result.report,
        template: template,
        tone: tone,
        tokens_input: result.inputTokens,
        tokens_output: result.outputTokens,
        cost_usd: result.costUsd,
      });
    }

    return NextResponse.json({
      report: result.report,
      usage: {
        used: usageCount + 1,
        limit: monthlyLimit,
        remaining: monthlyLimit - usageCount - 1,
      },
      meta: {
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        costUsd: result.costUsd,
      },
    });
  } catch (error) {
    console.error("[API /api/generate] Error:", error);

    const message =
      error instanceof Error ? error.message : "予期しないエラーが発生しました。";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
