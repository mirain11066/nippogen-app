import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Missing env vars", url: !!url, key: !!key });
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from("webhook_events")
    .insert({
      stripe_event_id: "evt_vercel_test_" + Date.now(),
      event_type: "vercel_test",
      payload_summary: "Testing from Vercel",
      status: "test",
    })
    .select();

  return NextResponse.json({ success: !error, data, error });
}
