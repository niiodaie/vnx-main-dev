'use client';

import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';

let stripePromise: Promise<StripeJS | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '';
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};
