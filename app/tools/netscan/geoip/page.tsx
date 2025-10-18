'use client';
import GeoMap from '@/components/GeoMap';
import { useState } from 'react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Search, MapPin, Globe2, Network, Clock, Copy, Loader2 } from 'lucide-react';

export default function GeoIPPage() {
  const [ip, setIp] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function lookupIP() {
    if (!ip) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/tools/netscan/geoip?ip=${ip}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Failed to fetch GeoIP data.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />

      {/* HERO */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-purple-600 to-pink-600 text-center text-white">
        <h1 className="text-5xl font-extrabold mb-4">GeoIP Locator</h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">
          Pinpoint IP address location with ISP, timezone, and regional details in real time.
        </p>
      </section>

      {/* MAIN */}
      <section className="py-10 px-6 flex-1">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Enter IP address (e.g. 8.8.8.8)"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={lookupIP}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {loading ? 'Locating...' : 'Locate'}
            </button>
          </div>

          {/* RESULT */}
          {result && !result.error && (
            <div className="space-y-6 mt-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-slate-800">Results for {result.data?.ip}</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <InfoCard
                  icon={<MapPin className="text-purple-600" />}
                  label="Location"
                  value={`${result.data.location.city || ''}, ${result.data.location.region || ''}, ${result.data.location.country || ''}`}
                />
                <InfoCard
                  icon={<Network className="text-blue-600" />}
                  label="ISP / ASN"
                  value={`${result.data.network.isp || 'Unknown'} (${result.data.network.asn || ''})`}
                />
                <InfoCard
                  icon={<Globe2 className="text-green-600" />}
                  label="Coordinates"
                  value={`${result.data.location.coordinates.latitude}, ${result.data.location.coordinates.longitude}`}
                />
                <InfoCard
                  icon={<Clock className="text-orange-600" />}
                  label="Timezone"
                  value={`${result.data.timezone.name || ''} (UTC${result.data.timezone.utc_offset || ''})`}
                />

                {/* Interactive Map */}
{result.data?.location?.coordinates && (
  <div className="mt-8">
    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
      🌍 Location Map
    </h3>
    <GeoMap
      latitude={result.data.location.coordinates.latitude}
      longitude={result.data.location.coordinates.longitude}
      city={result.data.location.city}
      country={result.data.location.country}
      isp={result.data.network.isp}
    />
  </div>
)}


                
              </div>

              <div className="mt-6 p-4 bg-gradient-to-br from-slate-50 to-purple-50 border border-purple-100 rounded-lg">
                <p className="text-sm text-slate-700">
                  🌍 <strong>Connection Insight:</strong>{' '}
                  This IP is located in {result.data.location.country || 'Unknown'}. Useful for regional latency,
                  CDN routing, and cybersecurity profiling.
                </p>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
                  }
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 transition"
                >
                  <Copy className="w-4 h-4" /> Copy JSON
                </button>
              </div>
            </div>
          )}

          {result?.error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              ⚠️ {result.error}
            </div>
          )}
        </div>

        {/* EXPLANATION */}
        <div className="max-w-3xl mx-auto mt-10 bg-gradient-to-br from-slate-50 to-purple-50 border border-slate-200 rounded-xl p-6 text-left">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Understanding GeoIP Results
          </h3>
          <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
            <li>
              <strong className="text-purple-700">IP:</strong> Internet address being located.
            </li>
            <li>
              <strong className="text-purple-700">Location:</strong> Estimated region and city.
            </li>
            <li>
              <strong className="text-purple-700">ISP / ASN:</strong> Your Internet provider and Autonomous System Number.
            </li>
            <li>
              <strong className="text-purple-700">Timezone:</strong> Local timezone and UTC offset.
            </li>
          </ul>

          <div className="mt-5">
            <a
              href="/blog/vnx/tools"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold transition"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold">
        {icon} {label}
      </div>
      <p className="text-slate-800">{value}</p>
    </div>
  );
}
