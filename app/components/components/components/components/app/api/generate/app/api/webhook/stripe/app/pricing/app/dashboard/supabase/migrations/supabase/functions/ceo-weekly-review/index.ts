// CEO Weekly Review — Supabase Edge Function
// Schedule: Every Monday 00:00 JST
// This file is deployed via: supabase functions deploy ceo-weekly-review

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

Deno.serve(async (req: Request) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, serviceKey);

  // Kill switch check
  const { data: killSwitch } = await supabase
    .from("agency_config")
    .select("value")
    .eq("key", "agency_kill_switch")
    .single();

  if (killSwitch?.value === "true") {
    return new Response(
      JSON.stringify({ status: "aborted", reason: "kill_switch_active" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  // Fetch last 7 days metrics
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: metrics } = await supabase
    .from("daily_metrics")
    .select("*")
    .gte("metric_date", sevenDaysAgo.toISOString().slice(0, 10))
    .order("metric_date", { ascending: true });

  return new Response(
    JSON.stringify({
      status: "complete",
      metrics_fetched: metrics?.length ?? 0,
      note: "Full CEO review logic runs here — see main implementation",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
