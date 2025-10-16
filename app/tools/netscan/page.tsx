"use client";

import Link from "next/link";

const toolGroups = [
  {
    title: "Core Lookups",
    description: "Essential IP and domain intelligence tools",
    tools: [
      { name: "IP Lookup", href: "/tools/netscan/ip-lookup", color: "from-blue-500 to-cyan-500", emoji: "🌐", status: "Live" },
      { name: "GeoIP", href: "/tools/netscan/geoip", color: "from-green-500 to-emerald-500", emoji: "🗺️", status: "Live" },
      { name: "WHOIS Lookup", href: "/tools/netscan/whois", color: "from-purple-500 to-pink-500", emoji: "🔍", status: "Live" },
      { name: "DNS Lookup", href: "/tools/netscan/dns", color: "from-orange-500 to-red-500", emoji: "🧩", status: "Live" },
    ],
  },
  {
    title: "Diagnostics & Monitoring",
    description: "Measure connectivity, latency, and network paths",
    tools: [
      { name: "Pretty Ping", href: "/tools/netscan/ping", color: "from-sky-500 to-indigo-500", emoji: "📡", status: "Beta" },
      { name: "Smart Traceroute", href: "/tools/netscan/traceroute", color: "from-teal-500 to-cyan-600", emoji: "🌐", status: "Live" },
      { name: "Speed Test", href: "/tools/netscan/speed", color: "from-yellow-400 to-orange-500", emoji: "⚡", status: "Soon" },
    ],
  },
  {
    title: "IT Utilities (Pro)",
    description: "Advanced network and wireless analysis tools",
    tools: [
      { name: "Port Scanner", href: "#", color: "from-slate-500 to-slate-700", emoji: "🛠️", status: "Pro" },
      { name: "SSL/TLS Checker", href: "#", color: "from-blue-700 to-indigo-700", emoji: "🔐", status: "Pro" },
      { name: "Wireless Scanner", href: "#", color: "from-pink-500 to-rose-600", emoji: "📶", status: "Pro" },
      { name: "MAC Lookup", href: "#", color: "from-cyan-500 to-teal-600", emoji: "💻", status: "Pro" },
    ],
  },
];

export default function NetscanPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center py-16 shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">VNX-Netscan</h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Professional Network Diagnostic Suite — analyze IPs, trace routes, and monitor connectivity in real-time.
        </p>
      </section>

      {/* TOOL GROUPS */}
      <div className="max-w-7xl mx-auto px-6 mt-12 space-y-16">
        {toolGroups.map((group) => (
          <div key={group.title}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {group.title}
              </h2>
              <p className="text-slate-500">{group.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {group.tools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className={`group relative bg-gradient-to-br ${tool.color} text-white rounded-xl p-6 flex flex-col justify-between shadow-md hover:shadow-xl transition-transform hover:-translate-y-1`}
                >
                  <div>
                    <div className="text-4xl mb-3">{tool.emoji}</div>
                    <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                    <p className="text-sm opacity-90">
                      {tool.status === "Pro" ? "Available in Pro version" : "Click to explore"}
                    </p>
                  </div>

                  <div
                    className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${
                      tool.status === "Live"
                        ? "bg-green-100 text-green-700"
                        : tool.status === "Beta"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tool.status}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
