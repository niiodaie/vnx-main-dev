'use client';

import { useState } from 'react';
import { Wifi, Globe2, ArrowUp, ArrowDown, Share2, Copy, Loader2 } from 'lucide-react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export default function PrettyPingPage() {
  const [host, setHost] = useState('visnec.com');
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [aiSummary, setAiSummary] = useState('');
  const [region, setRegion] = useState('us-east');

  async function runPing() {
    setLoading(true);
    setLatency(null);
    setAiSummary('');

    try {
      // Cloudflare latency simulation
      const start = performance.now();
      await fetch('https://1.1.1.1/cdn-cgi/trace', { cache: 'no-store' });
      const end = performance.now();
      const currentLatency = Math.round(end - start);

      // Store in history
      setHistory((prev) => [...prev.slice(-9), currentLatency]);
      setLatency(currentLatency);

      // Simple AI-style heuristic summary
      const summary =
        currentLatency < 60
          ? '⚡ Excellent connection — perfect for gaming and streaming.'
          : currentLatency < 120
          ? '✅ Stable connection with mild delay — ideal for browsing or video calls.'
          : currentLatency < 200
          ? '⚠️ Moderate latency detected — expect small lag in real-time apps.'
          : '❌ High latency — connection unstable or distant from test node.';
      setAiSummary(summary);
    } catch (e) {
      console.error(e);
      setAiSummary('❌ Ping failed — please check your network or try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      {/* HERO */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-center text-white shadow-xl">
        <Wifi className="w-16 h-16 mx-auto mb-6" />
        <h1 className="text-5xl font-extrabold mb-4">Pretty Ping</h1>
        <p className="text-lg max-w-2xl mx-auto text-white/90">
          Measure network latency & visualize connection stability in real time — powered by VNX Tools.
        </p>
      </section>

      {/* TEST PANEL */}
      <section className="py-12 px-6 flex-1">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Run a Latency Test</h2>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-6">
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="Enter domain or IP"
              className="flex-1 w-full sm:w-auto px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={runPing}
              disabled={loading}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2 transition-all disabled:opacity-50"
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

          {/* RESULTS */}
          {latency && (
            <div className="text-center mt-10 space-y-6 animate-fadeIn">
              <div className="flex flex-wrap justify-center gap-6">
                <StatCard title="Average RTT" value={`${latency} ms`} gradient="from-blue-500 to-cyan-500" />
                <StatCard
                  title="Connection Grade"
                  value={latency < 60 ? 'A+' : latency < 120 ? 'B' : latency < 200 ? 'C' : 'D'}
                  gradient="from-green-500 to-teal-500"
                />
                <StatCard
                  title="Region"
                  value={region.toUpperCase()}
                  gradient="from-purple-500 to-pink-500"
                />
              </div>

              {/* HISTORY BAR */}
              <div className="mt-8 bg-slate-100 rounded-xl p-4">
                <p className="font-medium text-slate-700 mb-2">Recent Results (ms)</p>
                <div className="flex items-end gap-2 h-32">
                  {history.map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-md transition-all duration-500 ${
                        h < 80
                          ? 'bg-green-500'
                          : h < 150
                          ? 'bg-yellow-400'
                          : 'bg-red-500'
                      }`}
                      style={{ height: `${Math.min(h, 200)}px` }}
                      title={`${h} ms`}
                    />
                  ))}
                </div>
              </div>

              {/* AI SUMMARY */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl text-slate-700">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-blue-600" />
                  Connection Insight
                </h3>
                <p className="text-base">{aiSummary}</p>
              </div>

              {/* SHARE / EXPORT */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <ActionButton icon={<Copy className="w-4 h-4" />} label="Copy JSON" onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify({ host, latency, region }));
                }} />
                <ActionButton icon={<Share2 className="w-4 h-4" />} label="Share Result" onClick={() => alert('Share feature coming soon – VNX Pro')} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* GEO MAP PLACEHOLDER */}
      <section className="py-12 bg-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">🌍 Global Latency Map (coming soon)</h3>
          <p className="text-slate-600 mb-8">
            Compare latency to servers in North America, Europe, Africa and Asia. Real VNX Geo-Ping API integration coming next.
          </p>
          <div className="rounded-2xl border-2 border-dashed border-slate-300 h-64 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-500">
            Interactive Map Placeholder
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ---------- Components ----------
function StatCard({ title, value, gradient }: { title: string; value: string; gradient: string }) {
  return (
    <div
      className={`min-w-[130px] px-6 py-4 rounded-xl text-white font-semibold bg-gradient-to-r ${gradient} shadow-md`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-2xl mt-1">{value}</p>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md flex items-center gap-2 text-slate-700 font-medium transition"
    >
      {icon}
      {label}
    </button>
  );
}
