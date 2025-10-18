// /config/tools.ts
import {
  Activity,
  Globe2,
  MapPin,
  ShieldCheck,
  Network,
  Server,
  Zap,
} from 'lucide-react';
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

// 🧩 Central tool registry
export const NETSCAN_TOOLS: ToolConfig[] = [
  // FREE TOOLS
  {
    id: 'ping',
    name: 'Pretty Ping',
    description:
      'Measure latency, jitter, and visualize network stability in real time.',
    icon: Activity,
    color: 'from-blue-600 to-cyan-600',
    tier: 'free',
    enabled: true,
    api: '/api/tools/netscan/ping',
  },
  {
    id: 'dns',
    name: 'DNS Lookup',
    description:
      'Query DNS records (A, AAAA, MX, TXT, NS) and test domain resolution.',
    icon: Globe2,
    color: 'from-indigo-600 to-blue-600',
    tier: 'free',
    enabled: true,
    api: '/api/tools/netscan/dns',
  },

  // PRO TOOLS
  {
    id: 'geoip',
    name: 'GeoIP Locator',
    description:
      'Pinpoint IP location with ISP, region, and timezone information.',
    icon: Network,
    color: 'from-purple-600 to-pink-600',
    tier: 'pro',
    enabled: true,
    api: '/api/tools/netscan/geoip',
  },
  {
    id: 'traceroute',
    name: 'Smart Traceroute',
    description:
      'Trace and visualize hops across global nodes with latency per hop.',
    icon: MapPin,
    color: 'from-cyan-600 to-teal-600',
    tier: 'pro',
    enabled: true,
    api: '/api/tools/netscan/traceroute',
  },
  {
    id: 'whois',
    name: 'WHOIS Lookup',
    description:
      'Retrieve domain registration, owner, and registrar information.',
    icon: ShieldCheck,
    color: 'from-green-600 to-emerald-600',
    tier: 'pro',
    enabled: true,
    api: '/api/tools/netscan/whois',
  },
  {
    id: 'portscan',
    name: 'Port Scanner',
    description:
      'Detect open ports, services, and vulnerabilities on target IPs.',
    icon: Server,
    color: 'from-orange-600 to-red-600',
    tier: 'pro',
    enabled: true,
    api: '/api/tools/netscan/portscan',
  },
];

// ✅ Access control helper
export function hasToolAccess(toolId: string, userTier: 'free' | 'pro') {
  const tool = NETSCAN_TOOLS.find((t) => t.id === toolId);
  if (!tool) return false;
  return tool.tier === 'free' || userTier === 'pro';
}

// ✅ Convenience helpers
export const getFreeTools = () =>
  NETSCAN_TOOLS.filter((t) => t.tier === 'free' && t.enabled);
export const getProTools = () =>
  NETSCAN_TOOLS.filter((t) => t.tier === 'pro' && t.enabled);
