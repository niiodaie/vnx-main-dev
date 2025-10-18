'use client';

import Link from 'next/link';
import { Crown, Lock, Zap } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
// import { useAuth } from '@/lib/auth/AuthContext';
import { NETSCAN_TOOLS } from '@/config/tools';

export default function NetscanPage() {
  // Temporary placeholders until Supabase Auth is activated
  const isPro = false;
  const loading = false;

  const freeTools = NETSCAN_TOOLS.filter((tool) => tool.tier === 'free' && tool.enabled);
  const proTools = NETSCAN_TOOLS.filter((tool) => tool.tier === 'pro' && tool.enabled);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      {/* HERO */}
      <section className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center py-20 shadow-md overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern-network.svg')] bg-cover bg-center"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">VNX-Netscan</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed mb-6">
            Professional Network Diagnostic Suite — analyze IPs, trace routes, and monitor connectivity in real time.
          </p>
          {!loading && !isPro && (
            <Link
              href="/tools/netscan/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              <Crown className="w-5 h-5" />
              Upgrade to Pro
            </Link>
          )}
        </div>
      </section>

      {/* TOOL GROUPS */}
      <div className="max-w-7xl mx-auto px-6 mt-16 space-y-20">
        {/* Free Tools */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Free Tools</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              5 requests/min
            </span>
          </div>
          <p className="text-gray-600 mb-8">
            Essential network diagnostic tools available for free with rate limiting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} isPro={false} hasAccess={true} />
            ))}
          </div>
        </section>

        {/* Pro Tools */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900">Pro Tools</h2>
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold rounded-full">
              Unlimited
            </span>
          </div>
          <p className="text-gray-600 mb-8">
            Advanced network analysis tools with unlimited requests.
            {!isPro && (
              <Link
                href="/tools/netscan/pricing"
                className="ml-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Upgrade to unlock →
              </Link>
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} isPro={true} hasAccess={isPro} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        {!loading && !isPro && (
          <section className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center text-white shadow-xl">
            <Crown className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to unlock all tools?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Upgrade to <b>VNX-Netscan Pro</b> and get unlimited access to all professional diagnostic tools.
            </p>
            <Link
              href="/tools/netscan/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              <Crown className="w-5 h-5" />
              View Pricing
            </Link>
          </section>
        )}
      </div>

      {/* Footer CTA */}
      <section className="mt-24 text-center">
        <p className="text-slate-600 mb-4">Built for professionals who care about precision.</p>
        <Link
          href="/tools/netscan/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition"
        >
          <Crown className="w-5 h-5" />
          Upgrade to VNX-Netscan Pro
        </Link>
      </section>
    </main>
  );
}

/* =====================
   TOOL CARD COMPONENT
===================== */
interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    color: string;
  };
  isPro: boolean;
  hasAccess: boolean;
}

function ToolCard({ tool, isPro, hasAccess }: ToolCardProps) {
  const href = hasAccess ? `/tools/netscan/${tool.id}` : '/tools/netscan/pricing';
  const Icon = tool.icon;

  return (
    <Link href={href}>
      <div
        className={`relative group bg-white rounded-xl shadow-md border-2 border-slate-200 p-6 transition-all hover:shadow-xl hover:scale-105 ${
          !hasAccess ? 'opacity-75' : ''
        }`}
      >
        {/* Pro Badge */}
        {isPro && !hasAccess && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
            <Lock className="w-3 h-3" />
            PRO
          </div>
        )}

        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-4`}
        >
          <Icon className="w-8 h-8" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
        <p className="text-gray-600 text-sm">{tool.description}</p>

        {/* Locked Notice */}
        {!hasAccess && (
          <div className="mt-4 flex items-center gap-2 text-blue-600 font-semibold text-sm">
            <Crown className="w-4 h-4" />
            Upgrade to unlock
          </div>
        )}
      </div>
    </Link>
  );
}
