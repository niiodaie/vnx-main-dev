import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-09-30.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Create Supabase client only if env vars are available
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not configured');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('Supabase client not available');
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, supabase: any) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const userId = session.client_reference_id || session.metadata?.userId;

  if (!userId) {
    console.error('No userId found in checkout session');
    return;
  }

  const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId) as any;
  const priceId = subscriptionData.items.data[0].price.id;
  const interval = subscriptionData.items.data[0].price.recurring?.interval || 'month';
  const expiresAt = new Date(subscriptionData.current_period_end * 1000);

  const { error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_price_id: priceId,
      tier: 'pro',
      status: subscriptionData.status,
      interval,
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error updating subscription:', error);
  }

  await supabase.from('payment_logs').insert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    amount: (session.amount_total || 0) / 100,
    currency: session.currency || 'usd',
    status: 'succeeded',
    event_type: 'checkout.session.completed',
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  const userId = subscription.metadata?.userId;
  
  if (!userId) {
    const { data } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', subscription.customer)
      .single();
    
    if (!data) {
      console.error('No userId found for subscription update');
      return;
    }
  }

  const expiresAt = new Date((subscription as any).current_period_end * 1000);

  await supabase
    .from('user_subscriptions')
    .update({
      status: (subscription as any).status,
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  await supabase
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      tier: 'free',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  const customerId = invoice.customer as string;
  const subscriptionId = (invoice as any).subscription as string;

  const { data } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!data) {
    console.error('No user found for payment');
    return;
  }

  await supabase.from('payment_logs').insert({
    user_id: data.user_id,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    amount: (invoice.amount_paid || 0) / 100,
    currency: invoice.currency || 'usd',
    status: 'succeeded',
    event_type: 'invoice.payment_succeeded',
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  const customerId = invoice.customer as string;
  const subscriptionId = (invoice as any).subscription as string;

  const { data } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!data) {
    console.error('No user found for failed payment');
    return;
  }

  await supabase.from('payment_logs').insert({
    user_id: data.user_id,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    amount: (invoice.amount_due || 0) / 100,
    currency: invoice.currency || 'usd',
    status: 'failed',
    event_type: 'invoice.payment_failed',
  });

  await supabase
    .from('user_subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);
}
