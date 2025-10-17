// lib/payments/stripe.ts
import Stripe from "stripe";

// ✅ Let Stripe handle API version automatically
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

  apiVersion: "2024-06-20",
});

// ✅ Add missing function
export async function createStripeCheckout(email: string, priceId: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/netscan/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/netscan/cancel`,
    });

    return session.url; // Return Stripe-hosted checkout URL
  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error);
    throw new Error("Failed to create Stripe checkout session");
  }
}

// Keep your subscription plans here too
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
