"use client";

import { useState, useEffect } from "react";
import { Loader2, Wifi, Copy, CheckCircle, AlertCircle } from "lucide-react";

interface PingResult {
  seq: number;
  time: number; // in ms
  success: boolean;
}

export default function PrettyPing() {
  const [host, setHost] = useState("");
  const [pinging, setPinging] = useState(false);
  const [results, setResults] = useState<PingResult[]>([]);
  const [copied, setCopied] = useState(false);

  const handlePing = async () => {
    if (!host.trim()) return;
    setPinging(true);
    setResults([]);

    // Simulate ping (mock demo until backend integration)
    const mockData: PingResult[] = [];
    for (let i = 1; i <= 5; i++) {
      await new Promise((r) => setTimeout(r, 800));
      const success = Math.random() > 0.1;
      mockData.push({
        seq: i,
        time: success ? 20 + Math.random() * 120 : 0,
        success,
      });
      setResults([...mockData]);
    }

    setPinging(false);
  };

  const avgTime =
    results.filter((r) => r.success).reduce((sum, r) => sum + r.time, 0) /
    (results.filter((r) => r.success).length || 1);
  const packetLoss =
    ((results.length - results.filter((r) => r.success).length) /
      (results.length || 1)) *
    100;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl shadow-lg p-8 mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Pretty Ping 🌐</h1>
        <p className="text-blue-100 text-sm">
          Measure network latency and visualize connection stability in real
          time.
        </p>
      </div>

      {/* Input */}
      <div className="max-w-md mx-auto bg-white border-2 border-gray-200 rounded-xl shadow-sm p-6">
        <input
          type="text"
          placeholder="Enter hostname or IP (e.g. google.com)"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          disabled={pinging}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          onClick={handlePing}
          disabled={pinging}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg py-3 hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {pinging ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Pinging...
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4" /> Start Ping
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="max-w-3xl mx-auto mt-10">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-lg text-white font-semibold mb-4 ${
              packetLoss === 0
                ? "bg-green-500"
                : packetLoss < 50
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            {packetLoss === 0
              ? "✅ Excellent connection"
              : packetLoss < 50
              ? "⚠️ Unstable connection"
              : "❌ Severe packet loss"}
          </div>

          {/* Ping Wave Animation */}
          <div className="relative h-40 flex items-end justify-between gap-2 bg-slate-100 border rounded-lg p-4 overflow-hidden">
            {results.map((r) => (
              <div
                key={r.seq}
                className={`w-8 rounded-t-md ${
                  r.success ? "bg-blue-500" : "bg-red-400"
                } transition-all duration-300`}
                style={{
                  height: r.success ? `${r.time * 0.8}px` : "20px",
                  opacity: r.success ? 1 : 0.6,
                }}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-50 p-4 rounded-lg text-center border">
              <p className="text-xs uppercase text-slate-500">Avg RTT</p>
              <p className="text-xl font-bold text-blue-700">
                {avgTime.toFixed(1)} ms
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center border">
              <p className="text-xs uppercase text-slate-500">Packet Loss</p>
              <p className="text-xl font-bold text-blue-700">
                {packetLoss.toFixed(0)}%
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center border">
              <p className="text-xs uppercase text-slate-500">Pings Sent</p>
              <p className="text-xl font-bold text-blue-700">
                {results.length}
              </p>
            </div>
          </div>

          {/* Copy JSON */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy JSON
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
