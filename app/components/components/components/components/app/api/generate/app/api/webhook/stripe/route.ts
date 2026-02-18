import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent, stripe } from "@/lib/stripe";
import { updateUserSubscription } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-server";
import type Stripe from "stripe";

export async function POST(request: NextRequest): Promise<NextResponse> {
  let event: Stripe.Event;

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    event = constructWebhookEvent(body, signature);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const customerId = session.customer as string;
          const subId = typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subId);

          await updateUserSubscription({
            stripeCustomerId: customerId,
            subscriptionId: subscription.id,
            status: "active",
            plan: "pro",
            currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await updateUserSubscription({
          stripeCustomerId: sub.customer as string,
          subscriptionId: null,
          status: "canceled",
          plan: "free",
          currentPeriodStart: null,
          currentPeriodEnd: null,
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        if (invoice.subscription) {
          const subId = typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription.id;
          await updateUserSubscription({
            stripeCustomerId: customerId,
            subscriptionId: subId,
            status: "past_due",
            plan: "pro",
            currentPeriodStart: null,
            currentPeriodEnd: null,
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    await supabaseAdmin.from("webhook_events").insert({
      stripe_event_id: event.id,
      event_type: event.type,
      processed_at: new Date().toISOString(),
      payload_summary: JSON.stringify(event.data.object).slice(0, 1000),
      status: "processed",
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Webhook processing error:`, message);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
