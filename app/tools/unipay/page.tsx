'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UnipayPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Unipay</h1>
              <p className="text-lg text-slate-600 mt-2">Global Payroll & Workforce Payment Platform</p>
            </div>
            <div className="flex gap-3">
              <Link href="/tools/unipay/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/tools/unipay/docs">
                <Button>Documentation</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Simplify Global Payroll Management
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Unipay is a comprehensive payroll platform designed for businesses managing diverse workforces across multiple countries and currencies.
              </p>
              <div className="flex gap-3">
                <Link href="/tools/unipay/dashboard">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/tools/unipay/docs">
                  <Button size="lg" variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-8 text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">💰</div>
                  <div>
                    <h3 className="font-semibold">Multi-Currency</h3>
                    <p className="text-sm text-blue-100">Support for 50+ currencies</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">🌍</div>
                  <div>
                    <h3 className="font-semibold">Global Compliance</h3>
                    <p className="text-sm text-blue-100">Tax forms for multiple regions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">⚡</div>
                  <div>
                    <h3 className="font-semibold">Instant Payments</h3>
                    <p className="text-sm text-blue-100">Stripe, Wise, and bank transfers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🏢',
                title: 'Company Management',
                description: 'Register and manage multiple companies with different tax IDs and currencies'
              },
              {
                icon: '👥',
                title: 'Workforce Management',
                description: 'Onboard W-2 employees, 1099 contractors, and global workers'
              },
              {
                icon: '⏱️',
                title: 'Time Tracking',
                description: 'Log hours with approval workflows and automatic calculation'
              },
              {
                icon: '📄',
                title: 'Invoice Management',
                description: 'Contractors submit invoices with automatic tracking and approval'
              },
              {
                icon: '💳',
                title: 'Payment Processing',
                description: 'Process payments via Stripe, Wise, or traditional bank transfers'
              },
              {
                icon: '📊',
                title: 'Tax Compliance',
                description: 'Automatic W-2, 1099, and international tax form generation'
              },
            ].map((feature, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Overview</CardTitle>
                  <CardDescription>Complete payroll solution for global teams</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Unipay is built on a modern stack with:</p>
                  <ul className="list-disc list-inside space-y-2 text-slate-600">
                    <li>React 19 frontend with TypeScript</li>
                    <li>Node.js/Express backend with tRPC</li>
                    <li>MySQL database with Drizzle ORM</li>
                    <li>Multi-region tax calculation engine</li>
                    <li>Stripe and Wise payment integrations</li>
                    <li>PDF generation for documents</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Features</CardTitle>
                  <CardDescription>Everything you need for global payroll</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Payroll Engine</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>✓ Progressive tax calculations</li>
                        <li>✓ Multi-region support (US, CA, UK, EU)</li>
                        <li>✓ Dependent deductions</li>
                        <li>✓ Real-time exchange rates</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Compliance</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>✓ W-2 form generation</li>
                        <li>✓ 1099-NEC forms</li>
                        <li>✓ Global receipts</li>
                        <li>✓ Audit logs</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Plans</CardTitle>
                  <CardDescription>Flexible pricing for businesses of all sizes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Unipay offers flexible pricing based on your company size and workforce:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { name: 'Starter', price: '$99/mo', workers: 'Up to 10 workers' },
                      { name: 'Professional', price: '$299/mo', workers: 'Up to 100 workers' },
                      { name: 'Enterprise', price: 'Custom', workers: 'Unlimited workers' },
                    ].map((plan, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg p-4">
                        <h4 className="font-semibold text-slate-900">{plan.name}</h4>
                        <p className="text-2xl font-bold text-slate-900 my-2">{plan.price}</p>
                        <p className="text-sm text-slate-600">{plan.workers}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Support & Resources</CardTitle>
                  <CardDescription>Get help with Unipay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Documentation</h4>
                      <p className="text-sm text-slate-600">Comprehensive guides and API documentation</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Community</h4>
                      <p className="text-sm text-slate-600">Join our community forum for discussions</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Email Support</h4>
                      <p className="text-sm text-slate-600">support@unipay.com - Available 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Simplify Payroll?</h2>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Join hundreds of companies using Unipay to manage their global payroll efficiently and compliantly.
          </p>
          <Link href="/tools/unipay/dashboard">
            <Button size="lg" variant="secondary" className="text-blue-600 hover:text-blue-700">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
