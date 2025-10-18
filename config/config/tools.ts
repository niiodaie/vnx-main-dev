// ============================================================================
// VNX-NETSCAN TOOL CONFIGURATION (no src folder version)
// ============================================================================

import { LucideIcon, Globe2, Wifi, Shield, Radar, Search, Link2, Server, Activity, Cpu } from "lucide-react";

export interface NetscanTool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tier: "free" | "pro";
  color: string;
  enabled: boolean;
  path?: string;
}

export const NETSCAN_TOOLS: NetscanTool[] = [
  // ----------------------------- FREE TOOLS ---------------------------------
  {
    id: "geoip",
    name: "GeoIP Lookup",
    description: "Discover geographic location, timezone, and ISP details for any IP address.",
    icon: Globe2,
    tier: "free",
    color: "from-blue-500 to-cyan-500",
    enabled: true,
    path: "/tools/netscan/geoip",
  },
  {
    id: "whois",
    name: "WHOIS Lookup",
    description: "Retrieve domain registration info including registrar, dates, and name servers.",
    icon: Search,
    tier: "free",
    color: "from-indigo-500 to-purple-500",
    enabled: true,
    path: "/tools/netscan/whois",
  },
  {
    id: "ping",
    name: "Ping Test",
    description: "Measure network latency and response time from your device to a target host.",
    icon: Activity,
    tier: "free",
    color: "from-green-500 to-emerald-500",
    enabled: true,
    path: "/tools/netscan/ping",
  },
  {
    id: "traceroute",
    name: "Traceroute",
    description: "Trace the full route packets take to reach a remote host or server.",
    icon: Radar,
    tier: "free",
    color: "from-orange-500 to-yellow-500",
    enabled: true,
    path: "/tools/netscan/traceroute",
  },
  {
    id: "speedtest",
    name: "Speed Test",
    description: "Measure your internet speed — download, upload, and latency in real time.",
    icon: Wifi,
    tier: "free",
    color: "from-cyan-500 to-sky-500",
    enabled: true,
    path: "/tools/speedtest",
  },

  // ----------------------------- PRO TOOLS ----------------------------------
  {
    id: "portscan",
    name: "Port Scanner",
    description: "Scan open TCP/UDP ports and detect running services on a remote host.",
    icon: Server,
    tier: "pro",
    color: "from-amber-500 to-yellow-500",
    enabled: true,
    path: "/tools/netscan/portscan",
  },
  {
    id: "sslcheck",
    name: "SSL Certificate Check",
    description: "Inspect SSL/TLS certificate validity, issuer, and expiration details.",
    icon: Link2,
    tier: "pro",
    color: "from-teal-500 to-green-500",
    enabled: true,
    path: "/tools/netscan/sslcheck",
  },
  {
    id: "scamshield",
    name: "ScamShield",
    description: "AI-powered scam detection and phishing domain protection system.",
    icon: Shield,
    tier: "pro",
    color: "from-red-500 to-rose-500",
    enabled: true,
    path: "/tools/scamshield",
  },
  {
    id: "nettrace",
    name: "Network Trace Analyzer",
    description: "Monitor and visualize hops, packet loss, and performance degradation.",
    icon: Radar,
    tier: "pro",
    color: "from-yellow-500 to-orange-500",
    enabled: true,
    path: "/tools/netscan/nettrace",
  },
  {
    id: "sysmon",
    name: "System Monitor",
    description: "Analyze CPU, memory, and network I/O performance in real time.",
    icon: Cpu,
    tier: "pro",
    color: "from-fuchsia-500 to-pink-500",
    enabled: true,
    path: "/tools/netscan/sysmon",
  },
];

