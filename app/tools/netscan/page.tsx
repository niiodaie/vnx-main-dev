"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import {
  Search,
  Shield,
  Globe,
  BarChart3,
  ShieldCheck,
  Network,
  Loader2,
  MapPin,
  Activity,
  Star,
  Zap,
} from "lucide-react";

interface ScanResult {
  type: string;
  data: any;
  timestamp: string;
}

// Diagnostic tools list
const diagnosticTools = [
  {
    id: "ip-lookup",
    name: "IP Address Lookup",
    description:
      "Get detailed geolocation, ISP information, and network details for any IP address",
    icon: Search,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
    available: true,
  },
  {
    id: "port-scan",
    name: "Port Scanner",
    description:
      "Scan for open ports, identify running services, and assess network security",
    icon: Shield,
    color: "bg-orange-50",
    iconColor: "text-orange-600",
    borderColor: "border-orange-200",
    available: true,
  },
  {
    id: "domain-tools",
    name: "Domain Tools",
    description:
      "WHOIS lookups, DNS analysis, domain registration and hosting information",
    icon: Globe,
    color: "bg-purple-50",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200",
    available: true,
  },
  {
    id: "traceroute",
    name: "Traceroute",
    description: "Trace the path your packets take across the network",
    icon: Network,
    color: "bg-teal-50",
    iconColor: "text-teal-600",
    borderColor: "border-teal-200",
    available: true,
  },
  {
    id: "geoip",
    name: "GeoIP Lookup",
    description:
      "Locate an IP’s origin city, country, and ISP for analysis and mapping",
    icon: BarChart3,
    color: "bg-green-50",
    iconColor: "text-green-600",
    borderColor: "border-green-200",
    available: true,
  },
];

export default function NetscanPage() {
  const [target, setTarget] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<string | null>(null);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 🔌 Call backend mock endpoints
  const performScan = async (scanType: string) => {
    if (!target.trim()) {
      setError("Please enter an IP address or domain");
      return;
    }

    setIsScanning(true);
    setCurrentScan(scanType);
    setError(null);

    try {
      const response = await fetch(`/api/tools/netscan/${scanType}?target=${target}`);
      if (!response.ok) throw new Error(`Scan failed: ${response.statusText}`);
      const data = await response.json();

      const newResult: ScanResult = {
        type: scanType,
        data,
        timestamp: new Date().toISOString(),
      };
      setResults((prev) => [newResult, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setIsScanning(false);
      setCurrentScan(null);
    }
  };

  const detectMyIP = async () => {
    setIsScanning(true);
    setError(null);
    try {
      const res = await fetch(`/api/tools/netscan/geoip`);
      const data = await res.json();
      setTarget(data.ip || "");
    } catch {
      setError("Failed to detect your IP address");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-center text-white">
        <Activity className="w-16 h-16 mx-auto mb-6" />
        <h1 className="text-5xl md:text-6xl font-bold mb-4">VNX-Netscan</h1>
        <p className="max-w-2xl mx-auto text-lg text-white/90">
          Comprehensive network analysis and monitoring tools for IP lookup,
          port scanning, WHOIS queries, and traceroutes — powered by the VNX
          backend.
        </p>
      </section>

      {/* Input */}
      <section className="py-10 -mt-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter IP address or domain (e.g., 8.8.8.8)"
              className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={isScanning}
            />
            <button
              onClick={detectMyIP}
              disabled={isScanning}
              className="bg-slate-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 disabled:opacity-50"
            >
              <MapPin className="w-5 h-5" /> Detect My IP
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Tool grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {diagnosticTools.map((tool) => {
            const Icon = tool.icon;
            const isCurrentScan = currentScan === tool.id;
            return (
              <div
                key={tool.id}
                className={`bg-white border-2 ${tool.borderColor} rounded-xl p-6 hover:shadow-md transition`}
              >
                <div
                  className={`w-12 h-12 ${tool.color} flex items-center justify-center rounded-lg mb-3`}
                >
                  {isCurrentScan ? (
                    <Loader2 className={`${tool.iconColor} w-6 h-6 animate-spin`} />
                  ) : (
                    <Icon className={`${tool.iconColor} w-6 h-6`} />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{tool.description}</p>
                <button
                  onClick={() => performScan(tool.id)}
                  disabled={isScanning}
                  className={`${tool.iconColor.replace(
                    "text-",
                    "bg-"
                  )} w-full text-white py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50`}
                >
                  {isCurrentScan ? "Scanning..." : "Run Scan"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Results */}
      {results.length > 0 && (
        <section className="py-10">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-slate-800">
              <Search className="w-5 h-5 text-blue-600 mr-2" /> Scan Results
            </h2>
            {results.map((r, i) => (
              <div key={i} className="mb-6 border border-slate-200 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold capitalize">{r.type}</span>
                  <span className="text-sm text-slate-500">
                    {new Date(r.timestamp).toLocaleString()}
                  </span>
                </div>
                <pre className="bg-slate-50 text-sm p-3 rounded overflow-x-auto">
                  {JSON.stringify(r.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
