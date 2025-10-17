import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function createStripeCheckout(userEmail: string) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      { price: "price_1QABCDEF123456", quantity: 1 },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/netscan/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/netscan/cancel`,
    customer_email: userEmail,
  });

  return session.url;
}
