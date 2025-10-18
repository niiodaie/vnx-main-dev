// /config/tools.ts
import { Activity, Globe2, MapPin, ShieldCheck, Network, Server } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  tier: 'free' | 'pro';
  enabled: boolean;
  api?: string;
}

export const NETSCAN_TOOLS: ToolConfig[] = [
  {
    id: 'ping',
    name: 'Pretty Ping',
    description: 'Measure latency and visualize connection stability in real time.',
    icon: Activity,
    color: 'from-blue-600 to-cyan-600',
    tier: 'free',
    enabled: true,
    api: '/api/tools/netscan/ping',
  },
  {
    id: 'dns',
    name: 'DNS Lookup',
    description: 'Query DNS records (A, AAAA, MX, TXT, NS) for a domain.',
    icon: Globe2,
    color: 'from-indigo-600 to-blue-600',
    tier: 'free',
    enabled: true,
    api: '/api/tools/netscan/dns',
  },
  {
    id: 'traceroute',
    name: 'Smart Traceroute',
    description: 'Trace and visualize network hops across global nodes.',
    icon: MapPin,
    color: 'from-cyan-600 to-teal-600',
    tier: 'pro',
    enabled: true,
    api: '/api/tools/netscan/traceroute',
  },
  {
    id: 'whois',
    name: 'WHOIS Lookup',
    description: 'Retrieve domain registration and ownership information.',
    icon: ShieldCheck,
    color: 'from-green-600 to-emerald-600',
    tier: 'pro',
    enabled: true,
    api: '/api/tools/netscan/whois',
  },
  {
    id: 'geoip',
    name: 'GeoIP Locator',
    description: 'Pinpoint IP location with ISP and region data.',
    icon: Network,
    color: 'from-purple-600 to-pink-600',
    tier: 'pro',
    enabled: true,
    api: '/api/tools/netscan/geoip',
  },
  {
    id: 'portscan',
    name: 'Port Scanner',
    description: 'Scan open ports and detect active services securely.',
    icon: Server,
    color: 'from-orange-600 to-red-600',
    tier: 'pro',
    enabled: true,
    api: '/api/tools/netscan/portscan',
  },
];

// ✅ ADD THIS HELPER — ensures API routes can validate access tier
export function hasToolAccess(toolId: string, userTier: 'free' | 'pro') {
  const tool = NETSCAN_TOOLS.find((t) => t.id === toolId);
  if (!tool) return false;
  if (tool.tier === 'free') return true;
  return userTier === 'pro';
}
