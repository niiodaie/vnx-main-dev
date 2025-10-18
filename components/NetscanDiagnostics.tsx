'use client';

import { useState, useEffect } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

const endpoints = [
  { id: 'ping', name: 'Pretty Ping', path: '/api/tools/netscan/ping?host=google.com' },
  { id: 'dns', name: 'DNS Lookup', path: '/api/tools/netscan/dns?domain=google.com' },
  { id: 'geoip', name: 'GeoIP Locator', path: '/api/tools/netscan/geoip?ip=8.8.8.8' },
  { id: 'traceroute', name: 'Smart Traceroute', path: '/api/tools/netscan/traceroute?host=google.com' },
  { id: 'portscan', name: 'Port Scanner', path: '/api/tools/netscan/portscan?ip=8.8.8.8' },
];

export default function NetscanDiagnostics() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const checkApis = async () => {
    setLoading(true);
    const newResults: any[] = [];

    for (const ep of endpoints) {
      const start = performance.now();
      try {
        const res = await fetch(ep.path, { cache: 'no-store' });
        const elapsed = Math.round(performance.now() - start);
        const data = await res.json();
        newResults.push({
          id: ep.id,
          name: ep.name,
          status: res.ok ? 'ok' : 'fail',
          latency: `${elapsed} ms`,
          message: data?.message || 'OK',
        });
      } catch (err: any) {
        const elapsed = Math.round(performance.now() - start);
        newResults.push({
          id: ep.id,
          name: ep.name,
          status: 'error',
          latency: `${elapsed} ms`,
          message: err.message,
        });
      }
    }

    setResults(newResults);
    setLoading(false);
  };

  useEffect(() => {
    checkApis();
  }, []);

  return (
    <section className="mt-16 max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">System Diagnostics</h2>
        <button
          onClick={checkApis}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((tool) => (
          <div
            key={tool.id}
            className={`p-4 rounded-xl border shadow-sm ${
              tool.status === 'ok'
                ? 'border-green-200 bg-green-50'
                : tool.status === 'fail'
                ? 'border-red-200 bg-red-50'
                : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <h3 className="font-semibold text-lg mb-1">{tool.name}</h3>
            <p
              className={`text-sm font-medium ${
                tool.status === 'ok'
                  ? 'text-green-700'
                  : tool.status === 'fail'
                  ? 'text-red-700'
                  : 'text-yellow-700'
              }`}
            >
              {tool.status === 'ok' ? '🟢 Healthy' : tool.status === 'fail' ? '🔴 Down' : '🟡 Error'}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Latency: <strong>{tool.latency}</strong>
            </p>
            <p className="text-xs text-slate-500 truncate mt-1">{tool.message}</p>
          </div>
        ))}

        {results.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-6">
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                Checking APIs...
              </div>
            ) : (
              <p>No diagnostics available. Try refreshing.</p>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center mt-6">
        Last updated: {new Date().toLocaleTimeString()}
      </p>
    </section>
  );
}
