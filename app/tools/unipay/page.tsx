'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function UnipayPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-slate-900">💰 Unipay</h1>
          <p className="text-lg text-slate-600 mt-2">Global Payroll & Workforce Payment Platform</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['overview', 'dashboard', 'docs', 'pricing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Hero */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Simplify Global Payroll</h2>
                <p className="text-lg text-slate-600 mb-6">
                  Manage diverse workforces across multiple countries and currencies. Process payments, manage taxes, and ensure compliance—all in one place.
                </p>
                <div className="flex gap-3">
                  <Button>Get Started</Button>
                  <Button variant="outline">Learn More</Button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-8 text-white">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-xl">🌍</div>
                    <div>
                      <h3 className="font-semibold">Global Support</h3>
                      <p className="text-sm text-blue-100">50+ currencies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-xl">⚡</div>
                    <div>
                      <h3 className="font-semibold">Instant Payments</h3>
                      <p className="text-sm text-blue-100">Stripe, Wise, banks</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-xl">📊</div>
                    <div>
                      <h3 className="font-semibold">Tax Compliance</h3>
                      <p className="text-sm text-blue-100">W-2, 1099, global</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Key Features</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: '🏢', title: 'Company Management', desc: 'Multiple companies with different tax IDs' },
                  { icon: '👥', title: 'Workforce Management', desc: 'W-2 employees, 1099 contractors, global workers' },
                  { icon: '⏱️', title: 'Time Tracking', desc: 'Log hours with approval workflows' },
                  { icon: '📄', title: 'Invoice Management', desc: 'Contractor invoices with auto-tracking' },
                  { icon: '💳', title: 'Payment Processing', desc: 'Stripe, Wise, bank transfers' },
                  { icon: '📊', title: 'Tax Compliance', desc: 'W-2, 1099, international forms' },
                ].map((f, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="text-4xl mb-3">{f.icon}</div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                      <p className="text-sm text-slate-600">{f.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Select Company</label>
              <select className="w-64 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Acme Corporation</option>
                <option>Tech Startup Inc</option>
                <option>Global Services Ltd</option>
              </select>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Total Employees', value: '0', icon: '👥' },
                { label: 'Pending Approvals', value: '0', icon: '⏳' },
                { label: 'Total Payouts', value: '$0.00', icon: '💰' },
                { label: 'This Month', value: '$0.00', icon: '📊' },
              ].map((s, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">{s.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                      </div>
                      <span className="text-4xl">{s.icon}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">➕ Add Worker</Button>
                    <Button className="w-full justify-start" variant="outline">📝 Process Payroll</Button>
                    <Button className="w-full justify-start" variant="outline">💳 Make Payment</Button>
                    <Button className="w-full justify-start" variant="outline">📄 Generate Reports</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Getting Started</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-2"><span className="font-bold text-blue-600">1.</span><span className="text-slate-600">Configure company settings</span></div>
                    <div className="flex gap-2"><span className="font-bold text-blue-600">2.</span><span className="text-slate-600">Add workers and contractors</span></div>
                    <div className="flex gap-2"><span className="font-bold text-blue-600">3.</span><span className="text-slate-600">Set up payment methods</span></div>
                    <div className="flex gap-2"><span className="font-bold text-blue-600">4.</span><span className="text-slate-600">Process your first payroll</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Docs Tab */}
        {activeTab === 'docs' && (
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Getting Started</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">1. Create Account</h4>
                    <p className="text-sm text-slate-600">Sign up with company info, tax ID, and currency.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">2. Payment Methods</h4>
                    <p className="text-sm text-slate-600">Connect Stripe, Wise, or bank account.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">3. Add Workers</h4>
                    <p className="text-sm text-slate-600">Onboard employees and contractors.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">4. Process Payroll</h4>
                    <p className="text-sm text-slate-600">Log hours and process payments.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">API Reference</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Companies</h4>
                    <div className="bg-slate-100 p-3 rounded font-mono text-xs space-y-1">
                      <p>POST /api/trpc/company.create</p>
                      <p>GET /api/trpc/company.list</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Workers</h4>
                    <div className="bg-slate-100 p-3 rounded font-mono text-xs space-y-1">
                      <p>POST /api/trpc/worker.create</p>
                      <p>GET /api/trpc/worker.listByCompany</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">FAQ</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Payment methods?</h4>
                    <p className="text-sm text-slate-600">Stripe Connect, Wise, bank transfers.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Countries supported?</h4>
                    <p className="text-sm text-slate-600">US, Canada, UK, EU, and many others.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Multiple companies?</h4>
                    <p className="text-sm text-slate-600">Yes, manage multiple with separate cycles.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Starter', price: '$99', workers: '10 workers', features: ['Basic payroll', 'Single currency', 'Email support'] },
              { name: 'Professional', price: '$299', workers: '100 workers', features: ['Advanced payroll', 'Multi-currency', 'Priority support', 'API access'], highlight: true },
              { name: 'Enterprise', price: 'Custom', workers: 'Unlimited', features: ['Custom integrations', 'Dedicated support', 'SLA guarantee'] },
            ].map((p, i) => (
              <Card key={i} className={p.highlight ? 'border-blue-500 border-2' : ''}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{p.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-slate-900">{p.price}</span>
                    <span className="text-slate-600 ml-2">/month</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{p.workers}</p>
                  <ul className="space-y-2 mb-4">
                    {p.features.map((f, j) => (
                      <li key={j} className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="text-green-600">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={p.highlight ? 'default' : 'outline'}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Simplify Payroll?</h2>
          <p className="text-lg text-blue-100 mb-6">Join hundreds of companies using Unipay for global payroll.</p>
          <Button size="lg" variant="secondary">Start Free Trial</Button>
        </div>
      </div>
    </div>
  );
}

