import { createLemonCheckout } from "./lemon";
import { createStripeCheckout } from "./stripe";

export async function createCheckoutSession(email: string) {
  const useStripe = process.env.NEXT_PUBLIC_USE_STRIPE === "true";

  return useStripe
    ? await createStripeCheckout(email)
    : await createLemonCheckout(email);
}
