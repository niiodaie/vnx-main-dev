'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ShieldCheck,
  Network,
  Globe2,
  Activity,
  Search,
  Scan,
  Radio,
} from 'lucide-react'

const TOOL_CARDS = [
  {
    key: 'iplookup',
    title: 'IP Address Lookup',
    description:
      'Get detailed geolocation, ISP information, and network details for any IP address.',
    icon: Search,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    key: 'portscan',
    title: 'Port Scanner',
    description:
      'Scan for open ports, identify running services, and assess network security.',
    icon: Scan,
    color: 'bg-green-100 text-green-600',
  },
  {
    key: 'domaintools',
    title: 'Domain Tools',
    description:
      'WHOIS lookups, DNS analysis, and domain registration & hosting insights.',
    icon: Globe2,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    key: 'monitoring',
    title: 'Network Monitoring',
    description:
      'Real-time performance tracking and network connection analytics.',
    icon: Activity,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    key: 'security',
    title: 'Security Scans',
    description:
      'Vulnerability assessment and security analysis of network infrastructure.',
    icon: ShieldCheck,
    color: 'bg-rose-100 text-rose-600',
  },
  {
    key: 'topology',
    title: 'Network Topology',
    description:
      'Visualize network connections and trace routes between destinations.',
    icon: Network,
    color: 'bg-cyan-100 text-cyan-600',
  },
  {
    key: 'analyzer',
    title: 'Packet Analyzer',
    description:
      'Lightweight packet inspector for debugging traffic — “Wireshark Light.”',
    icon: Radio,
    color: 'bg-teal-100 text-teal-600',
  },
]

export default function NetscanDashboard() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  function handleLaunch(key: string) {
    setSelectedTool(key)
    // You can navigate to a dedicated subpage later, e.g. router.push(`/tools/netscan/${key}`)
    alert(`Launching ${key}... (feature coming soon)`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      {/* HERO */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <h1 className="text-4xl font-bold mb-2">VNX-Netscan</h1>
        <p className="text-blue-50 max-w-xl mx-auto">
          Unified network diagnostics and security suite — from IP lookups to
          live topology mapping.
        </p>
      </section>

      {/* GRID OF TOOLS */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOL_CARDS.map((tool) => {
            const Icon = tool.icon
            return (
              <Card
                key={tool.key}
                className="transition-all hover:shadow-lg hover:border-blue-300 cursor-pointer"
              >
                <CardContent className="p-6 flex flex-col h-full justify-between">
                  <div>
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-xl ${tool.color} mb-4`}
                    >
                      <Icon size={20} />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {tool.description}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      onClick={() => handleLaunch(tool.key)}
                    >
                      Launch {tool.title}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </main>
  )
}
