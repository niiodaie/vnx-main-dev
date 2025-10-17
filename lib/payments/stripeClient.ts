// lib/payments/stripeClient.ts
import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

/**
 * getStripe()
 * Loads and caches Stripe.js on the client side.
 * Ensures we never reload Stripe multiple times.
 */
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "");
  }
  return stripePromise;
};
