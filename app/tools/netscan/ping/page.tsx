'use client';

import { useState } from 'react';
import { Wifi, Loader2, ArrowUpRight, Copy } from 'lucide-react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export default function PingPage() {
  const [target, setTarget] = useState('google.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  async function runPing() {
    if (!target.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/ping?target=${target}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Ping failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />

      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-center">
        <h1 className="text-5xl font-bold mb-3">Pretty Ping</h1>
        <p className="text-lg text-blue-100">
          Measure network latency and visualize connection stability in real time.
        </p>
      </section>

      <section className="flex-1 px-6 py-12 max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Run a Latency Test</h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter a domain or IP (e.g. visnec.com)"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={runPing}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Testing...
                </>
              ) : (
                <>
                  <Wifi className="w-5 h-5" /> Start Ping
                </>
              )}
            </button>
          </div>

          {result && (
            <div className="mt-6 space-y-4">
              {result.error ? (
                <div className="text-red-600 font-semibold">{result.error}</div>
              ) : (
                <>
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <h4 className="text-sm text-slate-600">Average RTT</h4>
                      <div className="text-2xl font-bold text-blue-700">
                        {result.latency} ms
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <h4 className="text-sm text-slate-600">Connection Grade</h4>
                      <div className="text-2xl font-bold text-green-700">
                        {result.latency < 50 ? 'A+' : result.latency < 120 ? 'B' : 'C'}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                      <h4 className="text-sm text-slate-600">Region</h4>
                      <div className="text-2xl font-bold text-purple-700">US-EAST</div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg text-slate-700">
                    <strong>Connection Insight:</strong>{' '}
                    {result.latency < 60
                      ? 'Excellent connection — ideal for streaming and gaming.'
                      : result.latency < 150
                      ? 'Good connection — suitable for most online tasks.'
                      : 'Slow connection — possible high latency or network congestion.'}
                  </div>

                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy JSON'}
                    </button>
                    <a
                      href={`https://vnx.visnec.ai/tools/netscan/share?target=${target}`}
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-semibold"
                    >
                      <ArrowUpRight className="w-4 h-4" /> Share Result
                    </a>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="text-sm text-slate-500 mt-8 text-center">
          Powered by VNX-Ping API • Edge Optimized
        </div>
      </section>

      <Footer />
    </div>
  );
}
