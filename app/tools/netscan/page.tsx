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
  TrendingUp
} from "lucide-react";

interface ScanResult {
  type: string;
  data: any;
  timestamp: string;
}

const diagnosticTools = [
  {
    id: 'ip-lookup',
    name: 'IP Address Lookup',
    description: 'Get detailed geolocation, ISP information, and network details for any IP address',
    icon: Search,
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    available: true
  },
  {
    id: 'port-scan',
    name: 'Port Scanner',
    description: 'Scan for open ports, identify running services, and assess network security',
    icon: Shield,
    color: 'bg-orange-50',
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-200',
    available: false
  },
  {
    id: 'domain-tools',
    name: 'Domain Tools',
    description: 'WHOIS lookups, DNS analysis, domain registration and hosting information',
    icon: Globe,
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    available: false
  },
  {
    id: 'network-monitoring',
    name: 'Network Monitoring',
    description: 'Real-time network performance monitoring and connection tracking',
    icon: BarChart3,
    color: 'bg-green-50',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200',
    available: false
  },
  {
    id: 'security-scans',
    name: 'Security Scans',
    description: 'Vulnerability assessment and security analysis of network infrastructure',
    icon: ShieldCheck,
    color: 'bg-red-50',
    iconColor: 'text-red-600',
    borderColor: 'border-red-200',
    available: false
  },
  {
    id: 'network-topology',
    name: 'Network Topology',
    description: 'Visualize network connections and trace routes between destinations',
    icon: Network,
    color: 'bg-teal-50',
    iconColor: 'text-teal-600',
    borderColor: 'border-teal-200',
    available: false
  }
];

const recommendedTools = [
  {
    name: 'VNX Speed Test',
    url: '/tools/speedtest',
    description: 'Built-in speed test for download, upload, and latency',
    icon: Zap,
    category: 'Speed Test',
    internal: true
  },
  {
    name: 'Down Detector',
    url: 'https://downdetector.com',
    description: 'Check if websites and services are down',
    icon: Activity,
    category: 'Status Check'
  },
  {
    name: 'MXToolbox',
    url: 'https://mxtoolbox.com',
    description: 'DNS, SMTP, and network diagnostic tools',
    icon: Globe,
    category: 'DNS & Email'
  },
  {
    name: 'Ping.pe',
    url: 'https://ping.pe',
    description: 'Global ping test from multiple locations',
    icon: MapPin,
    category: 'Connectivity'
  },
  {
    name: 'IPVoid',
    url: 'https://www.ipvoid.com',
    description: 'IP reputation and blacklist checking',
    icon: ShieldCheck,
    category: 'Security'
  }
];

export default function NetscanPage() {
  const [target, setTarget] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState<string | null>(null);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const performScan = async (scanType: string) => {
    if (!target.trim()) {
      setError("Please enter an IP address or domain");
      return;
    }

    setIsScanning(true);
    setCurrentScan(scanType);
    setError(null);

    try {
      let result: any = null;

      if (scanType === 'ip-lookup') {
        const response = await fetch(`https://ipapi.co/${target}/json/`);
        if (!response.ok) {
          throw new Error(`Lookup failed: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.reason || 'Invalid IP address or domain');
        }
        
        result = data;
      } else {
        throw new Error(`${scanType} requires server-side implementation. Coming soon!`);
      }

      const newResult: ScanResult = {
        type: scanType,
        data: result,
        timestamp: new Date().toISOString()
      };

      setResults(prev => [newResult, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setIsScanning(false);
      setCurrentScan(null);
    }
  };

  const detectMyIP = async () => {
    setIsScanning(true);
    setError(null);

    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('Failed to detect IP');
      }
      const data = await response.json();
      setTarget(data.ip);
    } catch (err) {
      setError('Failed to detect your IP address');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 to-cyan-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Activity className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              VNX-Netscan
            </h1>
            <p className="text-xl text-white/90 mb-10">
              Comprehensive network analysis and monitoring tools for IP lookup, port scanning, WHOIS queries, and network management. Professional-grade diagnostics made simple.
            </p>
          </div>
        </div>
      </section>

      {/* Input Section */}
      <section className="py-12 -mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Enter IP address or domain (e.g., 8.8.8.8 or google.com)"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isScanning}
                  />
                </div>
                <button
                  onClick={detectMyIP}
                  disabled={isScanning}
                  className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Detect My IP
                </button>
              </div>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Network Diagnostic Tools */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">
              Network Diagnostic Tools
            </h2>
            <p className="text-center text-slate-600 mb-10 max-w-3xl mx-auto">
              Comprehensive network analysis and monitoring tools for IP lookup, port scanning, WHOIS queries, and network management. Professional-grade diagnostics made simple.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {diagnosticTools.map((tool) => {
                const Icon = tool.icon;
                const isCurrentScan = currentScan === tool.id;
                
                return (
                  <div 
                    key={tool.id} 
                    className={`bg-white rounded-xl border-2 ${tool.borderColor} p-6 hover:shadow-lg transition-all`}
                  >
                    <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-4`}>
                      {isCurrentScan ? (
                        <Loader2 className={`w-6 h-6 ${tool.iconColor} animate-spin`} />
                      ) : (
                        <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {tool.description}
                    </p>
                    {tool.available ? (
                      <button
                        onClick={() => performScan(tool.id)}
                        disabled={isScanning || !target.trim()}
                        className={`w-full py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${tool.iconColor.replace('text-', 'bg-')} hover:opacity-90`}
                      >
                        {isCurrentScan ? 'Scanning...' : 'Run Scan'}
                      </button>
                    ) : (
                      <div className="w-full py-2 rounded-lg bg-slate-100 text-slate-500 font-medium text-center">
                        Coming Soon
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Get Started Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  if (target.trim()) {
                    performScan('ip-lookup');
                  } else {
                    setError('Please enter an IP address or domain to get started');
                  }
                }}
                disabled={isScanning || !target.trim()}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Tools Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-3xl font-bold text-slate-800">
                Recommended Network Diagnostic Tools
              </h2>
            </div>
            <p className="text-center text-slate-600 mb-10">
              Essential tools for everyday network diagnostics and troubleshooting
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedTools.map((tool, index) => {
                const Icon = tool.icon;
                const isInternal = (tool as any).internal;
                return (
                  <a
                    key={index}
                    href={tool.url}
                    target={isInternal ? '_self' : '_blank'}
                    rel={isInternal ? undefined : 'noopener noreferrer'}
                    className="bg-slate-50 rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${isInternal ? 'bg-purple-100' : 'bg-blue-100'} flex items-center justify-center ${isInternal ? 'group-hover:bg-purple-200' : 'group-hover:bg-blue-200'} transition-colors`}>
                        <Icon className={`w-5 h-5 ${isInternal ? 'text-purple-600' : 'text-blue-600'}`} />
                      </div>
                      <span className={`text-xs ${isInternal ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-700'} px-2 py-1 rounded-full font-medium`}>
                        {tool.category}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold text-slate-800 mb-2 ${isInternal ? 'group-hover:text-purple-600' : 'group-hover:text-blue-600'} transition-colors`}>
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {tool.description}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {results.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <Search className="w-6 h-6 mr-2 text-blue-600" />
                  Scan Results
                </h2>
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 capitalize">
                          {result.type.replace('-', ' ')}
                        </h3>
                        <span className="text-sm text-slate-500">
                          {new Date(result.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-slate-700">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

