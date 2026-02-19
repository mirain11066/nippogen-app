import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function ceoWeeklyReview() {
  console.log("=== CEO 週次レビュー ===");
  console.log(`実行日時: ${new Date().toISOString()}\n`);

  // 1. ユーザー統計
  const { count: totalUsers } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true });

  const { count: proUsers } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true })
    .eq("plan", "pro");

  // 2. 今週の利用状況
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { count: weeklyReports } = await supabase
    .from("usage_records")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo.toISOString());

  // 3. Webhook イベント
  const { count: webhookEvents } = await supabase
    .from("webhook_events")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo.toISOString());

  // 4. 支払い失敗
  const { count: paymentFailures } = await supabase
    .from("payment_failures")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo.toISOString());

  // レポート出力
  console.log("📊 ユーザー統計:");
  console.log(`  総ユーザー数: ${totalUsers ?? 0}`);
  console.log(`  Pro ユーザー数: ${proUsers ?? 0}`);
  console.log(`  Free ユーザー数: ${(totalUsers ?? 0) - (proUsers ?? 0)}`);
  console.log(`  Pro 転換率: ${totalUsers ? (((proUsers ?? 0) / totalUsers) * 100).toFixed(1) : 0}%\n`);

  console.log("📈 今週の活動:");
  console.log(`  日報生成数: ${weeklyReports ?? 0}`);
  console.log(`  Webhook イベント: ${webhookEvents ?? 0}`);
  console.log(`  支払い失敗: ${paymentFailures ?? 0}\n`);

  // 月間収益予測
  const monthlyRevenue = (proUsers ?? 0) * 980;
  const monthlyCost = (weeklyReports ?? 0) * 4 * 0.5; // 月換算、1回0.5円
  console.log("💰 収益:");
  console.log(`  月間予測収益: ¥${monthlyRevenue.toLocaleString()}`);
  console.log(`  月間予測コスト: ¥${monthlyCost.toFixed(0)}`);
  console.log(`  月間予測利益: ¥${(monthlyRevenue - monthlyCost).toLocaleString()}\n`);

  console.log("=== レビュー完了 ===");
}

ceoWeeklyReview().catch(console.error);
