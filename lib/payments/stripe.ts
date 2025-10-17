// lib/payments/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

// ✅ Add the missing export for SUBSCRIPTION_PLANS
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
