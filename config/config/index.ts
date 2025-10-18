// ============================================================================
// VNX TOOL EXPORT HUB
// Combines all VNX tool configurations for unified access under the Tools Pillar
// ============================================================================

import { NETSCAN_TOOLS } from "./tools";

// ✅ Export individual tool groups
export { NETSCAN_TOOLS };

// ✅ Add featured single tools for other categories
export const SPEED_TEST_TOOL = {
  id: "speedtest",
  name: "Internet Speed Test",
  tier: "free",
  description: "Measure your internet speed and latency in real time.",
  path: "/tools/speedtest",
  color: "from-cyan-500 to-blue-500",
};

export const SCAM_SHIELD_TOOL = {
  id: "scamshield",
  name: "ScamShield Detector",
  tier: "pro",
  description: "Detect fraudulent links and phishing threats instantly.",
  path: "/tools/scamshield",
  color: "from-red-500 to-pink-500",
};

// ✅ NEW: Search Trend Analyzer (Mock Demo)
export const SEARCH_TREND_ANALYZER = {
  id: "search-trends",
  name: "Search Trend Analyzer",
  tier: "pro",
  description:
    "Analyze keyword popularity and real-time search insights across countries and categories.",
  path: "/tools/search-trends",
  color: "from-violet-500 to-fuchsia-600",
  enabled: true,
  mockData: [
    { keyword: "VPN", trend: "+34%", region: "US" },
    { keyword: "AI tools", trend: "+72%", region: "Ghana" },
    { keyword: "fiber internet", trend: "+45%", region: "Kenya" },
    { keyword: "crypto", trend: "-18%", region: "Nigeria" },
  ],
};

// ✅ Combine all tools for global access (VNX unified structure)
export const VNX_ALL_TOOLS = [
  ...NETSCAN_TOOLS,
  SPEED_TEST_TOOL,
  SCAM_SHIELD_TOOL,
  SEARCH_TREND_ANALYZER,
];
