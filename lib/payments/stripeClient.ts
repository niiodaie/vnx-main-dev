import Stripe from "stripe";

// ✅ Use automatic API version (recommended)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// ✅ Create checkout session helper
export async function createStripeCheckout(email: string, priceId: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/netscan/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/netscan/cancel`,
    });

    return session.url;
  } catch (error) {
    console.error("❌ Stripe checkout error:", error);
    throw new Error("Failed to create Stripe checkout session");
  }
}

// ✅ Subscription plans
export const SUBSCRIPTION_PLANS = {
  PRO_MONTHLY: {
    name: "Pro Monthly",
    price: 9.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "",
    interval: "month" as const,
  },
  PRO_YEARLY: {
    name: "Pro Yearly",
    price: 99.0,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "",
    interval: "year" as const,
  },
};
