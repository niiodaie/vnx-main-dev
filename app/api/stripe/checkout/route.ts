// app/api/stripe/checkout/route.ts
import { stripe } from '@/lib/payments/stripe';

export async function POST(req: Request) {
  const { userId, priceId } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/netscan/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/netscan/cancel`,
      client_reference_id: userId,
    });

    return new Response(JSON.stringify({ sessionId: session.id }), { status: 200 });
  } catch (err) {
    console.error('Checkout error:', err);
    return new Response(JSON.stringify({ error: 'Failed to create session' }), { status: 500 });
  }
}
