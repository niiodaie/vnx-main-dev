 import Stripe from "stripe";

/**
 * ✅ Initialize Stripe securely using your secret key.
 * This file runs only on the server — do not import in client components.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-09-30.clover" as any,
});

/**
 * ✅ Create Stripe Checkout Session for subscriptions.
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
    console.error("❌ Stripe checkout creation failed:", error.message);
    return null;
  }
}
