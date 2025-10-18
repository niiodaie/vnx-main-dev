'use client';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = false;

import { useState } from 'react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import {
  Route,
  Network,
  Loader2,
  MapPin,
  Copy,
  Share2,
} from 'lucide-react';

export default function TraceroutePage() {
  const [target, setTarget] = useState('google.com');
  const [loading, setLoading] = useState(false);
  const [hops, setHops] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState('');

  async function runTrace() {
    setLoading(true);
    setHops([]);
    setAiSummary('');

    try {
      // Simulated hops for demo / can be replaced with API
      const mockHops = Array.from({ length: 8 }, (_, i) => ({
        hop: i + 1,
        ip: `192.168.${i}.${Math.floor(Math.random() * 255)}`,
        host: `router-${i}.example.net`,
        rtt: Math.floor(Math.random() * 40 + 10),
        location: ['US-East', 'Chicago', 'London', 'Paris', 'Frankfurt', 'Lagos', 'Singapore', 'Tokyo'][i],
      }));

      await new Promise((res) => setTimeout(res, 2000));
      setHops(mockHops);

      const avgLatency = mockHops.reduce((a, b) => a + b.rtt, 0) / mockHops.length;
      const summary =
        avgLatency < 60
          ? '⚡ Excellent routing path — low latency and minimal hops.'
          : avgLatency < 120
          ? '✅ Stable routing with moderate latency.'
          : avgLatency < 200
          ? '⚠️ Path shows moderate delay — check intermediate ISPs.'
          : '❌ High latency detected — possible congestion or inefficient route.';

      setAiSummary(summary);
    } catch (e) {
      console.error('Traceroute failed', e);
      setAiSummary('❌ Traceroute could not complete — please retry or check connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      {/* HERO */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-center text-white shadow-xl">
        <Network className="w-16 h-16 mx-auto mb-6" />
        <h1 className="text-5xl font-extrabold mb-4">Traceroute</h1>
        <p className="text-lg max-w-2xl mx-auto text-white/90">
          Visualize network path and latency between you and any host.
        </p>
      </section>

      {/* MAIN */}
      <section className="py-12 px-6 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Run Traceroute</h2>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-6">
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter hostname or IP (e.g. visnec.com)"
              className="flex-1 w-full sm:w-auto px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={runTrace}
              disabled={loading}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Tracing...
                </>
              ) : (
                <>
                  <Route className="w-5 h-5" /> Start Trace
                </>
              )}
            </button>
          </div>

          {/* RESULTS */}
          {hops.length > 0 && (
            <div className="mt-8 space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Network Path to {target}
              </h3>

              <div className="grid gap-3">
                {hops.map((hop) => (
                  <div
                    key={hop.hop}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-800">
                          Hop {hop.hop}: {hop.ip}
                        </p>
                        <p className="text-sm text-slate-600">
                          {hop.host} — {hop.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        hop.rtt < 60
                          ? 'bg-green-100 text-green-700'
                          : hop.rtt < 120
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {hop.rtt} ms
                    </span>
                  </div>
                ))}
              </div>

              {/* AI SUMMARY */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl text-slate-700">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Network className="w-5 h-5 text-blue-600" />
                  Routing Insight
                </h3>
                <p className="text-base">{aiSummary}</p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <ActionButton
                  icon={<Copy className="w-4 h-4" />}
                  label="Copy JSON"
                  onClick={() =>
                    navigator.clipboard.writeText(JSON.stringify(hops, null, 2))
                  }
                />
                <ActionButton
                  icon={<Share2 className="w-4 h-4" />}
                  label="Share Result"
                  onClick={() =>
                    alert('Sharing will be enabled in VNX Pro.')
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* EXPLANATION SECTION */}
        <div className="max-w-4xl mx-auto mt-10 bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-6 text-left">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Understanding Traceroute Results
          </h3>
          <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
            <li>
              <span className="font-semibold text-blue-700">Hop:</span> Each step between routers as your data travels to the destination.
            </li>
            <li>
              <span className="font-semibold text-green-700">RTT (ms):</span> Round-trip time per hop; shows latency added at each segment.
            </li>
            <li>
              <span className="font-semibold text-purple-700">Location:</span> Geographic or network region of the router (when available).
            </li>
            <li>
              <span className="font-semibold text-yellow-700">High RTT / Timeouts:</span> May indicate network congestion, distance, or firewall blocking ICMP.
            </li>
          </ul>

          <div className="mt-5">
            <a
              href="/blog/vnx/tools"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
            >
              📘 Read More about VNX Tools
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Subcomponent
function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
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
