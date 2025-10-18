 'use client';

import { useState } from 'react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { MapPin, Loader2 } from 'lucide-react';
import SmartTracerouteMap from '@/components/netscan/SmartTracerouteMap';

export default function TraceroutePage() {
  const [host, setHost] = useState('8.8.8.8');
  const [loading, setLoading] = useState(false);
  const [hops, setHops] = useState<any[]>([]);

  const mockTraceroute = [
    { hop: 1, ip: '192.168.0.1', city: 'Local', country: 'LAN', lat: 37.7749, lon: -122.4194 },
    { hop: 2, ip: '10.23.45.1', city: 'Chicago', country: 'US', lat: 41.8781, lon: -87.6298 },
    { hop: 3, ip: '8.8.8.8', city: 'Mountain View', country: 'US', lat: 37.3861, lon: -122.0839 },
  ];

  async function runTraceroute() {
    setLoading(true);
    setTimeout(() => {
      setHops(mockTraceroute);
      setLoading(false);
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />

      <section className="pt-32 pb-16 bg-gradient-to-br from-cyan-600 to-blue-600 text-center text-white">
        <h1 className="text-5xl font-extrabold mb-4">Smart Traceroute</h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">
          Visualize network hops and latency paths to your destination.
        </p>
      </section>

      <section className="py-10 px-6 flex-1">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="Enter IP or domain (e.g. google.com)"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={runTraceroute}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2 transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
              {loading ? 'Tracing...' : 'Trace Route'}
            </button>
          </div>

          {hops.length > 0 && <SmartTracerouteMap hops={hops} />}
        </div>
      </section>

      <Footer />
    </div>
  );
}
