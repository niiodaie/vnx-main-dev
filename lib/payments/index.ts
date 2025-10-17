// lib/payments/index.ts

import { createLemonCheckout } from "./lemon";
import { createStripeCheckout } from "./stripe";

/**
 * Hybrid checkout selector
 * Automatically switches between Stripe and LemonSqueezy based on ENV config
 */
export async function createCheckoutSession(email: string, priceId: string) {
  const useStripe = process.env.NEXT_PUBLIC_USE_STRIPE === "true";

  if (useStripe) {
    return await createStripeCheckout(email, priceId);
  } else {
    return await createLemonCheckout(email, priceId);
  }
}

export * from "./stripe";
export * from "./stripeClient";
