import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/anthropic";
import { supabaseAdmin } from "@/lib/supabase-server";
import {
  FREE_TIER_MONTHLY_LIMIT,
  PRO_TIER_MONTHLY_LIMIT,
} from "@/lib/constants";
import type {
  ReportTemplate,
  ReportTone,
  GenerateReportResponse,
  ApiErrorResponse,
} from "@/lib/types";

const VALID_TEMPLATES: ReportTemplate[] = ["daily", "weekly", "client"];
const VALID_TONES: ReportTone[] = ["formal", "standard", "casual"];

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateReportResponse | ApiErrorResponse>> {
  try {
    const body = await request.json();
    const { bullets, template, tone } = body as {
      bullets: unknown;
      template: unknown;
      tone: unknown;
    };

    if (typeof bullets !== "string" || bullets.trim().length < 10) {
      return NextResponse.json(
        { error: "箇条書きは10文字以上で入力してください。", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    if (typeof template !== "string" || !VALID_TEMPLATES.includes(template as ReportTemplate)) {
      return NextResponse.json(
        { error: "無効なテンプレートです。", code: "INVALID_TEMPLATE" },
        { status: 400 }
      );
    }

    if (typeof tone !== "string" || !VALID_TONES.includes(tone as ReportTone)) {
      return NextResponse.json(
        { error: "無効なトーンです。", code: "INVALID_TONE" },
        { status: 400 }
      );
    }

    // 簡易認証（MVP段階ではcookieから取得）
    const cookieHeader = request.headers.get("cookie") ?? "";
    let userId = "anonymous";

    const match = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/);
    if (match) {
      try {
        const decoded = decodeURIComponent(match[1]);
        const parsed = JSON.parse(decoded);
        userId = parsed?.[0]?.user?.id ?? "anonymous";
      } catch {
        // cookie parse failure — continue as anonymous
      }
    }

    // 利用上限チェック
    const { data: profile } = await supabaseAdmin
      .from("user_profiles")
      .select("plan")
      .eq("id", userId)
      .single();

    const userPlan = profile?.plan ?? "free";
    const limit = userPlan === "pro" ? PRO_TIER_MONTHLY_LIMIT : FREE_TIER_MONTHLY_LIMIT;

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const { count: usageCount } = await supabaseAdmin
      .from("usage_records")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", firstOfMonth.toISOString());

    if ((usageCount ?? 0) >= limit) {
      return NextResponse.json(
        {
          error: userPlan === "free"
            ? "今月の無料枠（5件）を使い切りました。"
            : "今月の上限（100件）に達しました。",
          code: "USAGE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    // Claude API で日報生成
    const result = await generateReport({
      bullets: bullets.trim().slice(0, 5000),
      template: template as ReportTemplate,
      tone: tone as ReportTone,
    });

    // 利用記録を保存
    await supabaseAdmin.from("usage_records").insert({
      user_id: userId,
      tokens_input: result.inputTokens,
      tokens_output: result.outputTokens,
      template,
      tone,
      cost_usd: result.costUsd,
    });

    return NextResponse.json({
      report: result.report,
      tokens_used: result.inputTokens + result.outputTokens,
      template: template as ReportTemplate,
      tone: tone as ReportTone,
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      {
        error: "日報の生成に失敗しました。しばらくしてからお試しください。",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
