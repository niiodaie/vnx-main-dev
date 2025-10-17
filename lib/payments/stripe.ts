// lib/payments/stripe.ts
import Stripe from "stripe";

/**
 * ✅ Initialize Stripe securely using your secret key.
 * Do not include this file in client bundles.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // Let Stripe pick the right version automatically
  apiVersion: "2025-09-30.clover" as any,
});

/**
 * ✅ Creates a Stripe Checkout session for subscription payments.
 * @param email - The user's email address.
 * @param priceId - The Stripe price ID (from your dashboard).
 * @returns A checkout URL string or null.
 */
export async function createStripeCheckout(email: string, priceId: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ Missing STRIPE_SECRET_KEY in environment.");
    return null;
  }

  try {
    const session = await stripe.checkout.sessions.create({
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
    console.error("Stripe checkout creation failed:", error.message);
    return null;
  }
}
