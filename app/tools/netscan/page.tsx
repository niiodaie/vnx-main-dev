'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon, Search, RadioTower, Globe2, ShieldCheck, Activity, Network, Scan } from 'lucide-react'

const tools = [
  {
    key: 'iplookup',
    name: 'IP Address Lookup',
    description: 'Get detailed geolocation, ISP, and network details for any IP address.',
    href: '/tools/netscan/iplookup',
    icon: Search,
    tier: 'free',
  },
  {
    key: 'portscan',
    name: 'Port Scanner',
    description: 'Scan open ports, identify running services, and assess network security.',
    href: '/tools/netscan/portscan',
    icon: Scan,
    tier: 'pro',
  },
  {
    key: 'domaintools',
    name: 'Domain Tools',
    description: 'Perform WHOIS lookups, DNS analysis, and domain registration checks.',
    href: '/tools/netscan/domaintools',
    icon: Globe2,
    tier: 'free',
  },
  {
    key: 'monitoring',
    name: 'Network Monitoring',
    description: 'Monitor uptime, latency, and packet loss in real time.',
    href: '/tools/netscan/monitoring',
    icon: Activity,
    tier: 'pro',
  },
  {
    key: 'security',
    name: 'Security Scans',
    description: 'Run vulnerability checks and surface potential network risks.',
    href: '/tools/netscan/security',
    icon: ShieldCheck,
    tier: 'pro',
  },
  {
    key: 'topology',
    name: 'Network Topology',
    description: 'Trace and visualize network paths and route hops globally.',
    href: '/tools/netscan/topology',
    icon: Network,
    tier: 'free',
  },
  {
    key: 'network-analyzer',
    name: 'Network Analyzer',
    description: 'Inspect live packet data and analyze traffic flow (Wireshark Light).',
    href: '/tools/netscan/network-analyzer',
    icon: RadioTower,
    tier: 'pro',
  },
]

export default function NetscanDashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm">
        <h1 className="text-4xl font-bold mb-3">VNX-Netscan</h1>
        <p className="max-w-2xl mx-auto text-blue-100 text-sm md:text-base">
          Unified network diagnostics hub — perform IP lookups, port scans, topology traces, and security checks.
        </p>
      </section>

      {/* Tool Cards */}
      <section className="container mx-auto px-6 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon as LucideIcon
          const tierLabel =
            tool.tier === 'pro' ? (
              <span className="ml-2 rounded-full bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5">Pro</span>
            ) : (
              <span className="ml-2 rounded-full bg-green-100 text-green-700 text-xs px-2 py-0.5">Free</span>
            )

          return (
            <Card
              key={tool.key}
              className="hover:shadow-lg transition-all border border-slate-200 rounded-xl"
            >
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-blue-600">
                      <Icon size={22} />
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-slate-800 flex items-center">
                      {tool.name}
                      {tierLabel}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-6">{tool.description}</p>
                </div>

                <Link href={tool.href} className="mt-auto">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Launch {tool.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* Footer */}
      <footer className="text-center text-slate-500 text-sm py-6">
        <p>
          Powered by <span className="font-semibold text-blue-600">Visnec Nexus</span> · Network Intelligence Suite
        </p>
      </footer>
    </main>
  )
}
