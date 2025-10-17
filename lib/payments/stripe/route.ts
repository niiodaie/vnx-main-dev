export const runtime = "nodejs";
import { stripe } from "@/lib/payments/stripe";
import { updateSubscriptionStatus } from "@/lib/payments/subscriptionSync";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.created") {
    const subscription = event.data.object as any;
    const email = subscription.customer_email;
    const status = subscription.status;
    if (email) await updateSubscriptionStatus(email, status);
  }

  return new Response("Stripe Webhook OK", { status: 200 });
}
