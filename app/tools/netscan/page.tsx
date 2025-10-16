'use client';

import {
  Globe,
  MapPin,
  Shield,
  Network,
  Activity,
  Wifi,
  Search,
  Zap,
} from 'lucide-react';
import ToolCard from '@/components/netscan/ToolCard';

const tools = [
  {
    id: 'ip-lookup',
    title: 'IP Lookup',
    description:
      'Get detailed information about any IP address including location, ISP, and network details.',
    icon: Globe,
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white',
  },
  {
    id: 'geoip',
    title: 'GeoIP',
    description:
      'Discover geographic location, timezone, and network information for any IP address.',
    icon: MapPin,
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-500 text-white',
  },
  {
    id: 'whois',
    title: 'WHOIS',
    description:
      'Query domain registration information including registrar, dates, and nameservers.',
    icon: Search,
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
  },
  {
    id: 'dns',
    title: 'DNS Lookup',
    description:
      'Query DNS records (A, AAAA, MX, TXT, NS) for any domain name.',
    icon: Network,
    gradient: 'bg-gradient-to-br from-orange-500 to-red-500 text-white',
  },
];

const proTools = [
  {
    id: 'port-scan',
    title: 'Port Scanner',
    description:
      'Scan for open ports and identify running services on target hosts.',
    icon: Shield,
    gradient: '',
    comingSoon: true,
  },
  {
    id: 'traceroute',
    title: 'Traceroute',
    description:
      'Trace the network path to a destination and measure latency at each hop.',
    icon: Activity,
    gradient: '',
    comingSoon: true,
  },
  {
    id: 'ssl-check',
    title: 'SSL/TLS Check',
    description:
      'Analyze SSL/TLS certificates and security configuration of websites.',
    icon: Wifi,
    gradient: '',
    comingSoon: true,
  },
  {
    id: 'speed-test',
    title: 'Network Speed',
    description:
      'Test your network speed including download, upload, and latency.',
    icon: Zap,
    gradient: '',
    comingSoon: true,
  },
];

export default function NetscanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              VNX-Netscan
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Professional Network Diagnostic Tools
            </p>
            <p className="text-lg text-blue-50 max-w-3xl mx-auto">
              Comprehensive network analysis and monitoring tools for IP lookup,
              geolocation, WHOIS queries, DNS records, and more. Professional-grade
              diagnostics made simple.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Available Tools */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Available Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>

        {/* Pro Tools Coming Soon */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Advanced Scanning
            </h2>
            <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded">
              PRO COMING SOON
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {proTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-blue-600 font-semibold mb-2">
                ⚡ Fast & Cached
              </div>
              <p className="text-gray-600 text-sm">
                Results are cached for 10 minutes to ensure lightning-fast
                responses.
              </p>
            </div>
            <div>
              <div className="text-blue-600 font-semibold mb-2">
                🗺️ Visual Maps
              </div>
              <p className="text-gray-600 text-sm">
                See geographic locations on interactive Mapbox maps.
              </p>
            </div>
            <div>
              <div className="text-blue-600 font-semibold mb-2">
                📊 Structured Data
              </div>
              <p className="text-gray-600 text-sm">
                Clean JSON output with copy and download functionality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

