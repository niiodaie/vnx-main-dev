// lib/payments/stripe.ts
import Stripe from "stripe";

/**
 * Initialize Stripe securely on the server
 * Only initialize if the secret key is available (runtime, not build time)
 */
function getStripeInstance() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(secretKey, {
    apiVersion: "2025-09-30.clover" as any,
  });
}

// Lazy initialization - only creates Stripe instance when actually used
let stripeInstance: Stripe | null = null;
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    if (!stripeInstance) {
      stripeInstance = getStripeInstance();
    }
    return (stripeInstance as any)[prop];
  }
});

/**
 * ✅ Create Stripe Checkout Session for subscriptions
 */
export async function createStripeCheckout(email: string, priceId: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ Missing STRIPE_SECRET_KEY in environment.");
    return null;
  }

  try {
    const stripeClient = getStripeInstance();
    const session = await stripeClient.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/netscan/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/netscan/pricing`,
    });

    return session.url;
  } catch (error: any) {
    console.error("❌ Stripe checkout creation failed:", error.message);
    return null;
  }
}

/**
 * ✅ Subscription Plans used in pricing page
 */
export const SUBSCRIPTION_PLANS = {
  PRO_MONTHLY: {
    name: "Pro Monthly",
    price: 9.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "",
    interval: "month" as const,
    features: [
      "All network diagnostic tools",
      "Port Scanner & SSL Check",
      "Wireshark Light",
      "No ads",
      "Export history",
      "Priority support",
      "Unlimited requests",
    ],
  },
  PRO_YEARLY: {
    name: "Pro Yearly",
    price: 99.0,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "",
    interval: "year" as const,
    features: [
      "All network diagnostic tools",
      "Port Scanner & SSL Check",
      "Wireshark Light",
      "No ads",
      "Export history",
      "Priority support",
      "Unlimited requests",
      "Save $20/year",
    ],
  },
};

