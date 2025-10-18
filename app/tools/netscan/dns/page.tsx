'use client';

import { useState } from 'react';
import { Search, Loader2, Copy, ChevronDown } from 'lucide-react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export default function DNSLookupPage() {
  const [domain, setDomain] = useState('google.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  async function runLookup() {
    if (!domain.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/dns?domain=${domain}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'DNS lookup failed.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />

      <section className="pt-32 pb-16 bg-gradient-to-br from-indigo-600 to-blue-600 text-white text-center">
        <h1 className="text-5xl font-bold mb-3">DNS Lookup</h1>
        <p className="text-lg text-blue-100">
          Query DNS records (A, MX, TXT, NS) for any domain using the VNX API.
        </p>
      </section>

      <section className="flex-1 px-6 py-12 max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Run a DNS Query</h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g. visnec.com)"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={runLookup}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {loading ? 'Scanning...' : 'Scan'}
            </button>
          </div>

          {result && (
            <div className="mt-6">
              {result.error ? (
                <div className="text-red-600 font-semibold">{result.error}</div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Results for {result.domain}
                  </h3>
                  <div className="grid gap-3">
                    {result.records?.length ? (
                      result.records.map((rec: any, i: number) => (
                        <div key={i} className="p-4 bg-slate-50 border rounded-lg">
                          <p className="text-sm text-slate-800">
                            <strong>Type:</strong> {rec.type} — <strong>Data:</strong> {rec.data}
                          </p>
                          <p className="text-xs text-slate-500">
                            TTL: {rec.TTL}s | Name: {rec.name}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-600 italic">No DNS records found.</div>
                    )}
                  </div>

                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(JSON.stringify(result, null, 2))
                      }
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
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
                    <pre className="mt-3 bg-slate-900 text-blue-100 text-xs p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
