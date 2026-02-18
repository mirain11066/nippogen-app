import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function updateUserSubscription(params: {
  stripeCustomerId: string;
  subscriptionId: string | null;
  status: string;
  plan: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
}): Promise<void> {
  const { error } = await supabaseAdmin
    .from("user_profiles")
    .update({
      subscription_id: params.subscriptionId,
      subscription_status: params.status,
      plan: params.plan,
      current_period_start: params.currentPeriodStart,
      current_period_end: params.currentPeriodEnd,
    })
    .eq("stripe_customer_id", params.stripeCustomerId);

  if (error) {
    throw new Error(`Failed to update user subscription: ${error.message}`);
  }
}
