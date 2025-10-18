 'use client';

import { useState } from 'react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Search, Copy, ChevronDown, Loader2 } from 'lucide-react';

export default function DNSLookupPage() {
  const [domain, setDomain] = useState('google.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  async function fetchDNS() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=ANY`, {
        cache: 'no-store',
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('DNS fetch failed:', err);
      setResult({ error: 'Unable to fetch DNS records.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />

      {/* HEADER */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-600 to-cyan-600 text-center text-white">
        <h1 className="text-5xl font-extrabold mb-4">DNS Lookup</h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">
          Query DNS records (A, AAAA, MX, TXT, NS, and CNAME) for any domain.
        </p>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-10 px-6 flex-1">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g. visnec.com)"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchDNS}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2 transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {loading ? 'Scanning...' : 'Scan'}
            </button>
          </div>

          {/* RESULTS */}
          {result && (
            <div className="mt-8 space-y-6 animate-fadeIn">
              {result.Answer ? (
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Results for {domain}</h3>
                  <div className="grid gap-4">
                    {result.Answer.map((rec: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                        <p className="text-slate-800">
                          <span className="font-semibold">Type:</span> {rec.type}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-700">Data:</span>{' '}
                          <code className="bg-white border rounded px-1">{rec.data}</code>
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          TTL: {rec.TTL}s | Name: {rec.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-slate-600 italic">
                  {result.error || 'No DNS records found for this domain.'}
                </div>
              )}

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 transition"
                >
                  <Copy className="w-4 h-4" /> Copy JSON
                </button>
              </div>

              <button
                className="mt-6 flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <ChevronDown className="w-4 h-4" />
                Advanced View
              </button>

              {showAdvanced && (
                <pre className="p-4 bg-slate-900 text-blue-100 rounded-lg overflow-x-auto text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* EXPLANATION */}
        <div className="max-w-3xl mx-auto mt-10 bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-6 text-left">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Understanding DNS Results</h3>
          <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
            <li><b>A / AAAA:</b> IP address records mapping your domain to servers.</li>
            <li><b>MX:</b> Mail exchange records for routing email.</li>
            <li><b>TXT:</b> Custom data for verification & security (SPF, DKIM).</li>
            <li><b>NS:</b> Nameservers hosting your domain’s zone files.</li>
          </ul>
          <div className="mt-5">
            <a
              href="/blog/vnx/tools"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
            >
              📘 Read More about VNX Tools →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
