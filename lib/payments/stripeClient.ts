 "use client";
import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

/**
 * ✅ Loads and caches Stripe.js client-side.
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (typeof window === "undefined") {
    console.warn("⚠️ getStripe() called on server — returning null.");
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "";
    if (!publicKey) {
      console.error("❌ Missing NEXT_PUBLIC_STRIPE_PUBLIC_KEY in environment.");
    }
    stripePromise = loadStripe(publicKey);
  }

  return stripePromise;
};
