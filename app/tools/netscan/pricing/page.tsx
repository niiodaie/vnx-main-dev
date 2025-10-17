'use client';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0; // disable prerender caching

import { useState } from 'react';
import Link from 'next/link';
import { Check, Zap, Crown, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getStripe } from '@/lib/payments/stripeClient';
import { SUBSCRIPTION_PLANS } from '@/lib/payments/stripe';

export default function PricingPage() {
  const { user, isPro } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [interval, setInterval] = useState<'month' | 'year'>('month');

  const handleCheckout = async (priceId: string, planName: string) => {
    if (!user) {
      alert('Please sign in to upgrade to Pro');
      return;
    }

    setLoading(planName);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          priceId,
        }),
      });

      const { sessionId } = await response.json();

      const stripe = await getStripe();
      if (stripe) {
        // @ts-ignore
        const { error } = await stripe.redirectToCheckout({ sessionId }); if (error) console.error(error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const monthlyPlan = SUBSCRIPTION_PLANS.PRO_MONTHLY;
  const yearlyPlan = SUBSCRIPTION_PLANS.PRO_YEARLY;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Upgrade to VNX-Netscan Pro</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Unlock all professional network diagnostic tools and get unlimited access
          </p>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-lg font-medium ${interval === 'month' ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setInterval(interval === 'month' ? 'year' : 'month')}
            className="relative inline-flex h-8 w-14 items-center rounded-full bg-blue-600"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                interval === 'year' ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-lg font-medium ${interval === 'year' ? 'text-gray-900' : 'text-gray-500'}`}>
            Yearly
            <span className="ml-2 text-sm text-green-600 font-semibold">Save $20</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-8">
            <div className="text-center mb-8">
              <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $0
                <span className="text-lg font-normal text-gray-600">/forever</span>
              </div>
              <p className="text-gray-600">Perfect for occasional use</p>
            </div>

            <ul className="space-y-4 mb-8">
              <Feature text="5 basic network tools" />
              <Feature text="5 requests per minute" />
              <Feature text="Ping, DNS, WHOIS, IP, GeoIP" />
              <Feature text="Ad-supported" />
              <Feature text="Community support" />
            </ul>

            <Link
              href="/tools/netscan"
              className="block w-full text-center px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Current Plan
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-2xl border-2 border-blue-500 p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
              POPULAR
            </div>

            <div className="text-center mb-8">
              <Crown className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-2">
                ${interval === 'month' ? monthlyPlan.price : yearlyPlan.price}
                <span className="text-lg font-normal text-blue-100">
                  /{interval === 'month' ? 'month' : 'year'}
                </span>
              </div>
              <p className="text-blue-100">For professionals and power users</p>
            </div>

            <ul className="space-y-4 mb-8">
              {(interval === 'month' ? monthlyPlan.features : yearlyPlan.features).map((feature, index) => (
                <Feature key={index} text={feature} white />
              ))}
            </ul>

            {isPro ? (
              <div className="w-full text-center px-6 py-3 bg-white/20 rounded-lg font-semibold">
                Current Plan ✓
              </div>
            ) : (
              <button
                onClick={() =>
                  handleCheckout(
                    interval === 'month' ? monthlyPlan.priceId : yearlyPlan.priceId,
                    interval === 'month' ? 'Pro Monthly' : 'Pro Yearly'
                  )
                }
                disabled={loading !== null}
                className="w-full px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Upgrade to Pro'
                )}
              </button>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes! You can cancel your subscription at any time from your account settings. You'll continue to have Pro access until the end of your billing period."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment processor."
            />
            <FAQItem
              question="Do you offer refunds?"
              answer="We offer a 14-day money-back guarantee. If you're not satisfied with VNX-Netscan Pro, contact us within 14 days for a full refund."
            />
            <FAQItem
              question="What's included in the Pro plan?"
              answer="Pro includes all 10 network diagnostic tools (including Port Scanner, SSL Check, and Wireshark Light), unlimited requests, no ads, export history, and priority support."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ text, white = false }: { text: string; white?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${white ? 'text-white' : 'text-green-600'}`} />
      <span className={white ? 'text-white' : 'text-gray-700'}>{text}</span>
    </li>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}

