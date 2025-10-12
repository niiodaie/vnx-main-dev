"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { 
  Zap,
  Download,
  Upload,
  Activity,
  Wifi,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

interface SpeedTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  jitter: number;
  timestamp: string;
}

export default function SpeedTestPage() {
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState<'download' | 'upload' | 'latency' | null>(null);
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const testLatency = async (): Promise<{ latency: number; jitter: number }> => {
    const pings: number[] = [];
    const testUrl = 'https://www.google.com/favicon.ico';
    
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      try {
        await fetch(testUrl + '?t=' + Date.now(), { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        const end = performance.now();
        pings.push(end - start);
      } catch (err) {
        console.error('Ping failed:', err);
      }
      setProgress(((i + 1) / 5) * 100);
    }
    
    const avgLatency = pings.reduce((a, b) => a + b, 0) / pings.length;
    const jitter = Math.max(...pings) - Math.min(...pings);
    
    return { latency: Math.round(avgLatency), jitter: Math.round(jitter) };
  };

  const testDownloadSpeed = async (): Promise<number> => {
    // Use a test file (we'll use a public CDN resource)
    const testFileUrl = 'https://speed.cloudflare.com/__down?bytes=10000000'; // 10MB
    const startTime = performance.now();
    
    try {
      const response = await fetch(testFileUrl);
      const blob = await response.blob();
      const endTime = performance.now();
      
      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsLoaded = blob.size * 8;
      const speedMbps = (bitsLoaded / durationInSeconds / 1000000);
      
      return Math.round(speedMbps * 100) / 100;
    } catch (err) {
      console.error('Download test failed:', err);
      return 0;
    }
  };

  const testUploadSpeed = async (): Promise<number> => {
    // Simulate upload test (browser limitations make real upload tests complex)
    // This is a simplified version
    const testData = new Blob([new ArrayBuffer(1000000)]); // 1MB
    const startTime = performance.now();
    
    try {
      // Using a test endpoint (in production, you'd use your own server)
      await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: testData,
      });
      const endTime = performance.now();
      
      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsUploaded = testData.size * 8;
      const speedMbps = (bitsUploaded / durationInSeconds / 1000000);
      
      return Math.round(speedMbps * 100) / 100;
    } catch (err) {
      console.error('Upload test failed:', err);
      return 0;
    }
  };

  const runSpeedTest = async () => {
    setTesting(true);
    setError(null);
    setResult(null);
    setProgress(0);

    try {
      // Test Latency
      setCurrentTest('latency');
      const { latency, jitter } = await testLatency();
      
      // Test Download Speed
      setCurrentTest('download');
      setProgress(0);
      const downloadSpeed = await testDownloadSpeed();
      
      // Test Upload Speed
      setCurrentTest('upload');
      setProgress(0);
      const uploadSpeed = await testUploadSpeed();
      
      setResult({
        downloadSpeed,
        uploadSpeed,
        latency,
        jitter,
        timestamp: new Date().toISOString()
      });
      
      setCurrentTest(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speed test failed');
    } finally {
      setTesting(false);
      setProgress(0);
    }
  };

  const getSpeedRating = (speed: number, type: 'download' | 'upload'): { text: string; color: string; icon: any } => {
    const threshold = type === 'download' ? 25 : 10;
    const goodThreshold = type === 'download' ? 100 : 50;
    
    if (speed >= goodThreshold) {
      return { text: 'Excellent', color: 'text-green-600', icon: TrendingUp };
    } else if (speed >= threshold) {
      return { text: 'Good', color: 'text-blue-600', icon: Minus };
    } else {
      return { text: 'Slow', color: 'text-orange-600', icon: TrendingDown };
    }
  };

  const getLatencyRating = (latency: number): { text: string; color: string } => {
    if (latency < 50) {
      return { text: 'Excellent', color: 'text-green-600' };
    } else if (latency < 100) {
      return { text: 'Good', color: 'text-blue-600' };
    } else {
      return { text: 'High', color: 'text-orange-600' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Zap className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              VNX Speed Test
            </h1>
            <p className="text-xl text-white/90 mb-10">
              Test your internet connection speed with our built-in diagnostic tool. Measure download speed, upload speed, and network latency.
            </p>
          </div>
        </div>
      </section>

      {/* Speed Test Section */}
      <section className="py-12 -mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Test Button */}
            {!testing && !result && (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <Wifi className="w-24 h-24 mx-auto mb-6 text-purple-600" />
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Ready to Test Your Speed?
                </h2>
                <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                  Click the button below to start testing your internet connection. This will measure your download speed, upload speed, and network latency.
                </p>
                <button
                  onClick={runSpeedTest}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg transform hover:scale-105"
                >
                  <Zap className="w-6 h-6 inline-block mr-2" />
                  Start Speed Test
                </button>
              </div>
            )}

            {/* Testing in Progress */}
            {testing && (
              <div className="bg-white rounded-2xl shadow-xl p-12">
                <div className="text-center mb-8">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-600 animate-spin" />
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Testing Your Connection...
                  </h2>
                  <p className="text-slate-600">
                    {currentTest === 'latency' && 'Measuring network latency...'}
                    {currentTest === 'download' && 'Testing download speed...'}
                    {currentTest === 'upload' && 'Testing upload speed...'}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 mb-8">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Test Status */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center">
                      <Activity className="w-5 h-5 mr-3 text-slate-600" />
                      <span className="font-medium text-slate-700">Latency Test</span>
                    </div>
                    {currentTest === 'latency' ? (
                      <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                    ) : currentTest && ['download', 'upload'].includes(currentTest) ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center">
                      <Download className="w-5 h-5 mr-3 text-slate-600" />
                      <span className="font-medium text-slate-700">Download Speed</span>
                    </div>
                    {currentTest === 'download' ? (
                      <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                    ) : currentTest === 'upload' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center">
                      <Upload className="w-5 h-5 mr-3 text-slate-600" />
                      <span className="font-medium text-slate-700">Upload Speed</span>
                    </div>
                    {currentTest === 'upload' ? (
                      <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                    ) : (
                      <div className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {result && !testing && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                      Test Results
                    </h2>
                    <span className="text-sm text-slate-500">
                      {new Date(result.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {/* Speed Metrics */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Download Speed */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Download className="w-6 h-6 mr-2 text-blue-600" />
                          <h3 className="font-semibold text-slate-800">Download</h3>
                        </div>
                        {(() => {
                          const rating = getSpeedRating(result.downloadSpeed, 'download');
                          const Icon = rating.icon;
                          return (
                            <div className="flex items-center">
                              <Icon className={`w-5 h-5 mr-1 ${rating.color}`} />
                              <span className={`text-sm font-medium ${rating.color}`}>
                                {rating.text}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="text-4xl font-bold text-blue-600 mb-1">
                        {result.downloadSpeed}
                      </div>
                      <div className="text-sm text-slate-600">Mbps</div>
                    </div>

                    {/* Upload Speed */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Upload className="w-6 h-6 mr-2 text-purple-600" />
                          <h3 className="font-semibold text-slate-800">Upload</h3>
                        </div>
                        {(() => {
                          const rating = getSpeedRating(result.uploadSpeed, 'upload');
                          const Icon = rating.icon;
                          return (
                            <div className="flex items-center">
                              <Icon className={`w-5 h-5 mr-1 ${rating.color}`} />
                              <span className={`text-sm font-medium ${rating.color}`}>
                                {rating.text}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="text-4xl font-bold text-purple-600 mb-1">
                        {result.uploadSpeed}
                      </div>
                      <div className="text-sm text-slate-600">Mbps</div>
                    </div>
                  </div>

                  {/* Latency Metrics */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Latency */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Activity className="w-6 h-6 mr-2 text-green-600" />
                          <h3 className="font-semibold text-slate-800">Latency</h3>
                        </div>
                        <span className={`text-sm font-medium ${getLatencyRating(result.latency).color}`}>
                          {getLatencyRating(result.latency).text}
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-green-600 mb-1">
                        {result.latency}
                      </div>
                      <div className="text-sm text-slate-600">ms</div>
                    </div>

                    {/* Jitter */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
                      <div className="flex items-center mb-4">
                        <Activity className="w-6 h-6 mr-2 text-orange-600" />
                        <h3 className="font-semibold text-slate-800">Jitter</h3>
                      </div>
                      <div className="text-4xl font-bold text-orange-600 mb-1">
                        {result.jitter}
                      </div>
                      <div className="text-sm text-slate-600">ms</div>
                    </div>
                  </div>

                  {/* Test Again Button */}
                  <div className="mt-8 text-center">
                    <button
                      onClick={runSpeedTest}
                      className="px-6 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
                    >
                      Test Again
                    </button>
                  </div>
                </div>

                {/* Speed Guide */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">
                    Understanding Your Results
                  </h3>
                  <div className="space-y-4 text-sm text-slate-600">
                    <div>
                      <strong className="text-slate-800">Download Speed:</strong> How fast you can receive data. Good for streaming, browsing, and downloading files.
                      <ul className="ml-6 mt-2 space-y-1">
                        <li>• 0-25 Mbps: Basic browsing and email</li>
                        <li>• 25-100 Mbps: HD streaming and gaming</li>
                        <li>• 100+ Mbps: 4K streaming and large downloads</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-slate-800">Upload Speed:</strong> How fast you can send data. Important for video calls, uploading files, and live streaming.
                      <ul className="ml-6 mt-2 space-y-1">
                        <li>• 0-10 Mbps: Basic video calls</li>
                        <li>• 10-50 Mbps: HD video calls and file uploads</li>
                        <li>• 50+ Mbps: Live streaming and large file uploads</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-slate-800">Latency:</strong> The delay in your connection. Lower is better for gaming and real-time applications.
                      <ul className="ml-6 mt-2 space-y-1">
                        <li>• 0-50 ms: Excellent for gaming</li>
                        <li>• 50-100 ms: Good for most uses</li>
                        <li>• 100+ ms: May notice delays</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Test Failed
                  </h2>
                  <p className="text-slate-600 mb-6">{error}</p>
                  <button
                    onClick={runSpeedTest}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Try Again
                  </button>
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

