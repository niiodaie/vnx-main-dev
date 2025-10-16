"use client";

import { useState } from "react";
import { Wifi, Loader2, Globe2, Zap, AlertCircle } from "lucide-react";

export default function PrettyPing() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePing = async () => {
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/tools/netscan/ping?host=${encodeURIComponent(target)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ping failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto text-center py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">🌐 Pretty Ping</h1>
      <p className="text-slate-500 mb-8">
        Check how fast you can reach any website — visual, simple, and fun.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Enter host or IP (e.g., google.com)"
          className="border-2 border-slate-300 rounded-lg px-4 py-3 w-full sm:w-2/3 focus:border-blue-500 outline-none"
        />
        <button
          onClick={handlePing}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
          {loading ? "Pinging..." : "Ping"}
        </button>
      </div>

      {error && (
        <div className="text-red-500 flex justify-center items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200 inline-block text-left">
          <div className="flex items-center gap-3 mb-3">
            <Wifi className="text-blue-500 w-5 h-5" />
            <h2 className="text-xl font-semibold">{result.host}</h2>
          </div>
          <p className="text-slate-600">
            Average latency: <span className="font-bold text-blue-600">{result.avg} ms</span>
          </p>
          <p className="text-slate-600">Jitter: {result.jitter} ms • Packet loss: {result.loss}%</p>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full ${
                result.avg < 50
                  ? "bg-green-500"
                  : result.avg < 150
                  ? "bg-yellow-400"
                  : "bg-red-500"
              }`}
              style={{ width: `${Math.min(result.avg / 2, 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </section>
  );
}
