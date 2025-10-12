"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { 
  Shield,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Globe,
  MessageSquare,
  Link as LinkIcon,
  TrendingUp,
  Users,
  Lock
} from "lucide-react";

interface ScanResult {
  url: string;
  status: 'safe' | 'suspicious' | 'dangerous';
  score: number;
  threats: string[];
  recommendations: string[];
  timestamp: string;
}

export default function ScamShieldPage() {
  const [scanInput, setScanInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simple URL/domain pattern matching for demo
  const analyzeUrl = (input: string): ScanResult => {
    const lowerInput = input.toLowerCase();
    const score = Math.floor(Math.random() * 100);
    
    // Suspicious patterns
    const suspiciousPatterns = [
      'free-money', 'win-prize', 'urgent-action', 'verify-account',
      'suspended-account', 'claim-reward', 'bitcoin-giveaway',
      'paypal-secure', 'amazon-refund', 'irs-payment'
    ];
    
    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => 
      lowerInput.includes(pattern)
    );
    
    // Determine status
    let status: 'safe' | 'suspicious' | 'dangerous';
    let threats: string[] = [];
    let recommendations: string[] = [];
    
    if (hasSuspiciousPattern || score < 30) {
      status = 'dangerous';
      threats = [
        'Phishing attempt detected',
        'Suspicious domain pattern',
        'Potential financial scam',
        'Unverified SSL certificate'
      ];
      recommendations = [
        'Do NOT enter personal information',
        'Do NOT make any payments',
        'Report this URL to authorities',
        'Block this domain in your browser'
      ];
    } else if (score < 60) {
      status = 'suspicious';
      threats = [
        'Newly registered domain',
        'Limited online presence',
        'Unusual URL structure'
      ];
      recommendations = [
        'Proceed with caution',
        'Verify the website independently',
        'Use secure payment methods only',
        'Check for reviews and ratings'
      ];
    } else {
      status = 'safe';
      threats = [];
      recommendations = [
        'Website appears legitimate',
        'Continue with normal precautions',
        'Always verify URLs before clicking',
        'Use strong passwords'
      ];
    }
    
    return {
      url: input,
      status,
      score,
      threats,
      recommendations,
      timestamp: new Date().toISOString()
    };
  };

  const handleScan = async () => {
    if (!scanInput.trim()) {
      setError("Please enter a URL or text to scan");
      return;
    }

    setScanning(true);
    setError(null);
    setResult(null);

    // Simulate API call delay
    setTimeout(() => {
      const scanResult = analyzeUrl(scanInput);
      setResult(scanResult);
      setScanning(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'suspicious':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'dangerous':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'suspicious':
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      case 'dangerous':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Shield className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-red-600 to-orange-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              ScamShield
            </h1>
            <p className="text-xl text-white/90 mb-10">
              AI-powered scam detection and protection. Analyze URLs, messages, and content for potential threats in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Scanner Section */}
      <section className="py-12 -mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                Scan for Threats
              </h2>
              <div className="space-y-4">
                <div>
                  <textarea
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="Enter a URL, email, or suspicious message to scan...&#10;&#10;Try: free-money-now.com or verify-account-urgent.net"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[120px] resize-y"
                    disabled={scanning}
                  />
                </div>
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-full px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Scanning for threats...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Scan Now
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Scan Results */}
            {result && !scanning && (
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                      Scan Results
                    </h2>
                    <div className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)}
                      <span className="font-semibold capitalize">{result.status}</span>
                    </div>
                  </div>

                  {/* URL Display */}
                  <div className="mb-6 p-4 bg-slate-50 rounded-lg break-all">
                    <div className="flex items-start gap-2">
                      <LinkIcon className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{result.url}</span>
                    </div>
                  </div>

                  {/* Threat Score */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Threat Score</span>
                      <span className="text-sm font-bold text-slate-800">{result.score}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          result.status === 'safe' ? 'bg-green-600' :
                          result.status === 'suspicious' ? 'bg-orange-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {result.status === 'safe' && 'Low risk - appears legitimate'}
                      {result.status === 'suspicious' && 'Medium risk - proceed with caution'}
                      {result.status === 'dangerous' && 'High risk - potential threat detected'}
                    </p>
                  </div>

                  {/* Threats Detected */}
                  {result.threats.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Threats Detected
                      </h3>
                      <ul className="space-y-2">
                        {result.threats.map((threat, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="text-red-600 font-bold">•</span>
                            {threat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-blue-600 font-bold">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Scan Again Button */}
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => {
                        setResult(null);
                        setScanInput("");
                      }}
                      className="px-6 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
                    >
                      Scan Another URL
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Features Grid */}
            {!result && !scanning && (
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">AI Detection</h3>
                  <p className="text-sm text-slate-600">
                    Advanced algorithms identify phishing attempts and scams
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Community Reports</h3>
                  <p className="text-sm text-slate-600">
                    Crowdsourced threat intelligence from users worldwide
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Real-Time Protection</h3>
                  <p className="text-sm text-slate-600">
                    Instant analysis and threat detection as you browse
                  </p>
                </div>
              </div>
            )}

            {/* Demo Instructions */}
            {!result && !scanning && (
              <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-6 mt-8">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Try These Examples
                </h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Dangerous:</strong> free-money-now.com, verify-account-urgent.net</p>
                  <p><strong>Suspicious:</strong> new-shop-deals.xyz, limited-offer-today.site</p>
                  <p><strong>Safe:</strong> google.com, amazon.com, github.com</p>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> This is a demo version with simulated threat detection. 
                    In production, this would connect to real-time threat databases and AI models.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

