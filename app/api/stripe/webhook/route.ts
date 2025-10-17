import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import { supabase } from '@/lib/auth/supabase';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id || session.metadata?.userId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error('No userId in checkout session');
    return;
  }

  // Get subscription details
  const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId) as any;
  const priceId = subscriptionData.items.data[0].price.id;
  
  // Determine interval
  const interval = subscriptionData.items.data[0].price.recurring?.interval || 'month';

  // Calculate expiry date
  const expiresAt = new Date(subscriptionData.current_period_end * 1000);

  // Update or create subscription record
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

  // Log payment
  await supabase.from('payment_logs').insert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    amount: session.amount_total ? session.amount_total / 100 : 0,
    currency: session.currency || 'usd',
    status: 'succeeded',
    event_type: 'checkout.session.completed',
    created_at: new Date().toISOString(),
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  
  if (!userId) {
    // Try to find user by customer ID
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

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await supabase
    .from('user_subscriptions')
    .update({
      tier: 'free',
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = (invoice as any).subscription as string;

  // Find user
  const { data } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!data) return;

  // Log payment
  await supabase.from('payment_logs').insert({
    user_id: data.user_id,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    amount: invoice.amount_paid / 100,
    currency: invoice.currency,
    status: 'succeeded',
    event_type: 'invoice.payment_succeeded',
    created_at: new Date().toISOString(),
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = (invoice as any).subscription as string;

  // Find user
  const { data } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!data) return;

  // Log failed payment
  await supabase.from('payment_logs').insert({
    user_id: data.user_id,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    amount: invoice.amount_due / 100,
    currency: invoice.currency,
    status: 'failed',
    event_type: 'invoice.payment_failed',
    created_at: new Date().toISOString(),
  });
}

