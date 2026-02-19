import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// === 1. Circuit Breaker ===
// API連続エラーが5回を超えたら自動停止
let consecutiveErrors = 0;
const ERROR_THRESHOLD = 5;
let circuitOpen = false;

export function recordSuccess() {
  consecutiveErrors = 0;
  circuitOpen = false;
}

export function recordError() {
  consecutiveErrors++;
  if (consecutiveErrors >= ERROR_THRESHOLD) {
    circuitOpen = true;
    console.error(`🔴 Circuit Breaker OPEN: ${consecutiveErrors} consecutive errors`);
  }
}

export function isCircuitOpen(): boolean {
  return circuitOpen;
}

// === 2. Cost Guard ===
// 月間API コストが上限を超えたら停止
const MONTHLY_COST_LIMIT_YEN = 5000; // ¥5,000/月
const COST_PER_REPORT = 0.5; // 1回あたり約¥0.5

export async function isCostLimitReached(): Promise<boolean> {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { count } = await supabase
    .from("usage_records")
    .select("*", { count: "exact", head: true })
    .gte("created_at", firstOfMonth.toISOString());

  const estimatedCost = (count ?? 0) * COST_PER_REPORT;
  
  if (estimatedCost >= MONTHLY_COST_LIMIT_YEN) {
    console.error(`🔴 Cost Guard: ¥${estimatedCost} >= ¥${MONTHLY_COST_LIMIT_YEN}`);
    return true;
  }
  return false;
}

// === 3. Kill Switch ===
// Supabase の設定テーブルで即座にサービスを停止可能
export async function isKillSwitchActive(): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "kill_switch")
      .single();

    return data?.value === "true";
  } catch {
    return false;
  }
}

// === 統合チェック ===
export async function safetyCheck(): Promise<{ safe: boolean; reason?: string }> {
  if (isCircuitOpen()) {
    return { safe: false, reason: "Circuit Breaker が作動中です。しばらくお待ちください。" };
  }

  if (await isKillSwitchActive()) {
    return { safe: false, reason: "現在メンテナンス中です。" };
  }

  if (await isCostLimitReached()) {
    return { safe: false, reason: "本月のサービス利用上限に達しました。" };
  }

  return { safe: true };
}
