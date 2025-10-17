import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/payments/stripe';

export async function POST(request: NextRequest) {
  try {
    const { userId, priceId } = await request.json();

    if (!userId || !priceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const successUrl = `${origin}/tools/netscan?success=true`;
    const cancelUrl = `${origin}/tools/netscan?canceled=true`;

    const session = await createCheckoutSession(
      userId,
      priceId,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

