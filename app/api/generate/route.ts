import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/anthropic";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FREE_MONTHLY_LIMIT = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bullets, template, tone } = body;

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

    // --- Usage check (anonymous: use IP-based tracking) ---
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count } = await supabaseAdmin
      .from("usage_records")
      .select("*", { count: "exact", head: true })
      .eq("user_identifier", ip)
      .gte("created_at", monthStart);

    const usageCount = count ?? 0;

    if (usageCount >= FREE_MONTHLY_LIMIT) {
      return NextResponse.json(
        {
          error: `今月の無料枠（${FREE_MONTHLY_LIMIT}件）を使い切りました。Proプランにアップグレードしてください。`,
          usage: { used: usageCount, limit: FREE_MONTHLY_LIMIT },
        },
        { status: 429 }
      );
    }

    // --- Generate report via Claude ---
    const result = await generateReport({ bullets, template, tone });

    // --- Log usage ---
    await supabaseAdmin.from("usage_records").insert({
      user_identifier: ip,
      template,
      tone,
      input_length: bullets.length,
      output_length: result.report.length,
      input_tokens: result.inputTokens,
      output_tokens: result.outputTokens,
      cost_usd: result.costUsd,
    });

    return NextResponse.json({
      report: result.report,
      usage: {
        used: usageCount + 1,
        limit: FREE_MONTHLY_LIMIT,
        remaining: FREE_MONTHLY_LIMIT - usageCount - 1,
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
