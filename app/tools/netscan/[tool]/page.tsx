"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import {
  Search,
  Shield,
  Globe,
  BarChart3,
  Network,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const toolDetails: Record<
  string,
  { name: string; description: string; icon: any; color: string; api: string }
> = {
  "ip-lookup": {
    name: "IP Address Lookup",
    description: "Get detailed geolocation, ISP, and ASN details for any IP address.",
    icon: Search,
    color: "from-blue-600 to-cyan-600",
    api: "/api/tools/netscan/ip-lookup",
  },
  "port-scan": {
    name: "Port Scanner",
    description: "Scan for open ports and identify running services on a network host.",
    icon: Shield,
    color: "from-orange-500 to-yellow-500",
    api: "/api/tools/netscan/ports",
  },
  "domain-tools": {
    name: "Domain Tools",
    description: "Run WHOIS lookups and analyze DNS & domain registration data.",
    icon: Globe,
    color: "from-purple-500 to-pink-500",
    api: "/api/tools/netscan/whois",
  },
  traceroute: {
    name: "Traceroute",
    description: "Trace the path packets take through the internet to their destination.",
    icon: Network,
    color: "from-teal-500 to-green-500",
    api: "/api/tools/netscan/traceroute",
  },
  geoip: {
    name: "GeoIP Lookup",
    description: "Locate an IP's city, country, and ISP for mapping and analytics.",
    icon: BarChart3,
    color: "from-green-500 to-lime-500",
    api: "/api/tools/netscan/geoip",
  },
};

export default function ToolPage() {
  const { tool } = useParams();
  const details = toolDetails[tool as string];

  const [target, setTarget] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!details) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Tool Not Found</h1>
        <Link href="/tools/netscan" className="text-blue-600 hover:underline">
          ← Back to Netscan
        </Link>
      </div>
    );
  }

  const Icon = details.icon;

  const handleRun = async () => {
    if (!target.trim() && tool !== "geoip") {
      setError("Please enter a valid IP address or domain");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${details.api}${tool === "geoip" ? "" : `?target=${target}`}`
      );
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section
        className={`pt-28 pb-16 bg-gradient-to-r ${details.color} text-white text-center`}
      >
        <Icon className="w-14 h-14 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">{details.name}</h1>
        <p className="text-white/90 max-w-xl mx-auto">{details.description}</p>
      </section>

      {/* Input + Action */}
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg -mt-8">
        {tool !== "geoip" && (
          <input
            type="text"
            placeholder="Enter IP or domain (e.g., 8.8.8.8)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full border px-4 py-3 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        )}
        <button
          onClick={handleRun}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
          ) : (
            "Run"
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {data && (
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4 text-left overflow-x-auto">
            <pre className="text-sm text-slate-800">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/tools/netscan"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
