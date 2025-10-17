export type ToolTier = 'free' | 'pro';

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  tier: ToolTier;
  icon: string;
  color: string;
  enabled: boolean;
}

export const NETSCAN_TOOLS: ToolConfig[] = [
  // Free Tier Tools
  {
    id: 'ping',
    name: 'Ping',
    description: 'Test network latency and connectivity',
    tier: 'free',
    icon: '🏓',
    color: 'from-blue-500 to-cyan-500',
    enabled: true,
  },
  {
    id: 'dns',
    name: 'DNS Lookup',
    description: 'Query DNS records (A, MX, TXT, NS)',
    tier: 'free',
    icon: '🔍',
    color: 'from-purple-500 to-pink-500',
    enabled: true,
  },
  {
    id: 'whois',
    name: 'WHOIS',
    description: 'Domain registration information',
    tier: 'free',
    icon: '📋',
    color: 'from-green-500 to-emerald-500',
    enabled: true,
  },
  {
    id: 'ip-lookup',
    name: 'IP Lookup',
    description: 'Detect IP, ISP, and ASN information',
    tier: 'free',
    icon: '🌐',
    color: 'from-orange-500 to-red-500',
    enabled: true,
  },
  {
    id: 'geoip',
    name: 'GeoIP',
    description: 'IP geolocation with map visualization',
    tier: 'free',
    icon: '📍',
    color: 'from-teal-500 to-cyan-500',
    enabled: true,
  },

  // Pro Tier Tools
  {
    id: 'traceroute',
    name: 'Traceroute',
    description: 'Multi-hop network path analysis',
    tier: 'pro',
    icon: '🛣️',
    color: 'from-indigo-500 to-purple-500',
    enabled: true,
  },
  {
    id: 'speed',
    name: 'Speed Test',
    description: 'Bandwidth and latency testing',
    tier: 'pro',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500',
    enabled: true,
  },
  {
    id: 'port-scanner',
    name: 'Port Scanner',
    description: 'TCP port scanning and service detection',
    tier: 'pro',
    icon: '🔐',
    color: 'from-red-500 to-pink-500',
    enabled: true,
  },
  {
    id: 'ssl-check',
    name: 'SSL/TLS Check',
    description: 'Certificate validation and expiry check',
    tier: 'pro',
    icon: '🔒',
    color: 'from-green-500 to-teal-500',
    enabled: true,
  },
  {
    id: 'wireshark-light',
    name: 'Wireshark Light',
    description: 'Basic packet capture and analysis',
    tier: 'pro',
    icon: '📡',
    color: 'from-blue-500 to-indigo-500',
    enabled: true,
  },
];

// Get tools by tier
export function getToolsByTier(tier: ToolTier): ToolConfig[] {
  if (tier === 'pro') {
    return NETSCAN_TOOLS.filter((tool) => tool.enabled);
  }
  return NETSCAN_TOOLS.filter((tool) => tool.tier === 'free' && tool.enabled);
}

// Check if user has access to tool
export function hasToolAccess(toolId: string, userTier: ToolTier): boolean {
  const tool = NETSCAN_TOOLS.find((t) => t.id === toolId);
  if (!tool || !tool.enabled) return false;
  
  if (userTier === 'pro') return true;
  return tool.tier === 'free';
}

// Get tool config
export function getToolConfig(toolId: string): ToolConfig | undefined {
  return NETSCAN_TOOLS.find((t) => t.id === toolId);
}

