import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/payments/stripe';
import { getCurrentUser } from '@/lib/auth/supabase';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const successUrl = `${origin}/tools/netscan?upgraded=true`;
    const cancelUrl = `${origin}/tools/netscan/pricing?canceled=true`;

    const session = await createCheckoutSession(
      user.id,
      priceId,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
