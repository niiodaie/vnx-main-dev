"use client";

import { useState } from "react";
import { MapPin, Loader2, Route, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function SmartTraceroute() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTrace = async () => {
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    setResult([]);
    try {
      const res = await fetch(`/api/tools/netscan/traceroute?host=${encodeURIComponent(target)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Trace failed");
      setResult(data.hops);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto text-center py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">🗺️ Smart Traceroute</h1>
      <p className="text-slate-500 mb-8">
        Visualize your packet’s journey across the world — each hop in real time.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Enter host (e.g., openai.com)"
          className="border-2 border-slate-300 rounded-lg px-4 py-3 w-full sm:w-2/3 focus:border-blue-500 outline-none"
        />
        <button
          onClick={handleTrace}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Route className="w-5 h-5" />}
          {loading ? "Tracing..." : "Trace"}
        </button>
      </div>

      {error && (
        <div className="text-red-500 flex justify-center items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {result.length > 0 && (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200 text-left">
          <div className="relative mb-6">
            <Image
              src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${result
                .map((hop) => `pin-s+285A98(${hop.lon},${hop.lat})`)
                .join(",")}/auto/800x300?access_token=${
                process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
              }`}
              alt="Traceroute Map"
              width={800}
              height={300}
              className="rounded-lg w-full"
            />
          </div>

          <ol className="space-y-3">
            {result.map((hop, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between border-l-4 border-blue-500 pl-4 py-2 bg-slate-50 rounded-r-lg"
              >
                <span className="font-medium text-slate-700">
                  Hop {hop.hop}: {hop.ip} ({hop.city}, {hop.country})
                </span>
                <span
                  className={`text-sm font-semibold ${
                    hop.rtt < 50 ? "text-green-600" : hop.rtt < 150 ? "text-yellow-500" : "text-red-500"
                  }`}
                >
                  {hop.rtt} ms
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
