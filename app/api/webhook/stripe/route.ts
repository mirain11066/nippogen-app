import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (customerEmail) {
          // Update or create user profile with pro plan
          const { error } = await supabaseAdmin
            .from("user_profiles")
            .upsert(
              {
                email: customerEmail,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                plan: "pro",
                updated_at: new Date().toISOString(),
              },
              { onConflict: "email" }
            );

          if (error) console.error("Failed to update user profile:", error);
        }

        // Log webhook event
        await supabaseAdmin.from("webhook_events").insert({
          event_type: event.type,
          stripe_event_id: event.id,
          data: {
            customer_email: customerEmail,
            customer_id: customerId,
            subscription_id: subscriptionId,
            amount_total: session.amount_total,
          },
        });

        console.log(`✅ Checkout completed: ${customerEmail}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Downgrade to free plan
        const { error } = await supabaseAdmin
          .from("user_profiles")
          .update({
            plan: "free",
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (error) console.error("Failed to downgrade user:", error);

        await supabaseAdmin.from("webhook_events").insert({
          event_type: event.type,
          stripe_event_id: event.id,
          data: { customer_id: customerId },
        });

        console.log(`⚠️ Subscription deleted: ${customerId}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const customerEmail = invoice.customer_email;

        await supabaseAdmin.from("payment_failures").insert({
          stripe_customer_id: customerId,
          email: customerEmail,
          amount: invoice.amount_due,
          currency: invoice.currency,
          failure_reason: "payment_failed",
        });

        await supabaseAdmin.from("webhook_events").insert({
          event_type: event.type,
          stripe_event_id: event.id,
          data: {
            customer_id: customerId,
            customer_email: customerEmail,
            amount_due: invoice.amount_due,
          },
        });

        console.log(`❌ Payment failed: ${customerEmail}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
