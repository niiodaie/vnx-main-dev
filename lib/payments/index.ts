import { createLemonCheckout } from "./lemon";
import { createStripeCheckout } from "./stripe";

/**
 * ✅ Hybrid checkout selector (Stripe or LemonSqueezy)
 */
export async function createCheckoutSession(email: string, priceId: string) {
  const useStripe = process.env.NEXT_PUBLIC_USE_STRIPE === "true";
  return useStripe
    ? await createStripeCheckout(email, priceId)
    : await createLemonCheckout(email, priceId);
}

// Re-export utilities
export * from "./stripe";
export * from "./stripeClient";
export * from "./lemon";
