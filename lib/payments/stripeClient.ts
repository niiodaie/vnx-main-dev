// lib/payments/stripeClient.ts
"use client"; // ✅ ensures this only runs on the client side in Next.js

import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

/**
 * ✅ getStripe()
 * Loads and caches Stripe.js safely on the client side.
 * Prevents multiple Stripe initializations and SSR import issues.
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (typeof window === "undefined") {
    // ✅ Prevents SSR build errors
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
