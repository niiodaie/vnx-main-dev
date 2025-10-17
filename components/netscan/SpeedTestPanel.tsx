 "use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Gauge,
  Wifi,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface Metric {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: "blue" | "cyan" | "violet";
}

export default function SpeedTestPanel() {
  const [testing, setTesting] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [status, setStatus] = useState<string>("Ready to Test");
  const [error, setError] = useState<string | null>(null);

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    cyan: "bg-cyan-100 text-cyan-600",
    violet: "bg-violet-100 text-violet-600",
  };

  // Ping test (latency)
  const testLatency = async (): Promise<number> => {
    const testUrl = "https://cloudflare.com/cdn-cgi/trace";
    const trials = 5;
    const times: number[] = [];

    for (let i = 0; i < trials; i++) {
      const start = performance.now();
      try {
        await fetch(`${testUrl}?t=${Date.now()}`, { cache: "no-cache" });
        const end = performance.now();
        times.push(end - start);
      } catch {
        times.push(999);
      }
    }

    const avg = times.reduce((a, b) => a + b, 0) / trials;
    return Math.round(avg);
  };

  // Download test
  const testDownloadSpeed = async (): Promise<number> => {
    const testUrl = "https://speed.cloudflare.com/__down?bytes=10000000"; // 10MB
    const start = performance.now();

    try {
      const response = await fetch(testUrl, { cache: "no-cache" });
      const blob = await response.blob();
      const end = performance.now();

      const duration = (end - start) / 1000;
      const bits = blob.size * 8;
      return Math.round((bits / duration / 1_000_000) * 100) / 100;
    } catch {
      return 0;
    }
  };

  // Upload test
  const testUploadSpeed = async (): Promise<number> => {
    const data = new Blob([new ArrayBuffer(1_000_000)]); // 1MB
    const start = performance.now();

    try {
      await fetch("https://httpbin.org/post", {
        method: "POST",
        body: data,
      });
      const end = performance.now();
      const duration = (end - start) / 1000;
      const bits = data.size * 8;
      return Math.round((bits / duration / 1_000_000) * 100) / 100;
    } catch {
      return 0;
    }
  };

  const runSpeedTest = async () => {
    setTesting(true);
    setError(null);
    setStatus("Running network diagnostics...");
    setMetrics([]);

    try {
      const newMetrics: Metric[] = [
        {
          label: "Download",
          value: 0,
          unit: "Mbps",
          color: "blue",
          icon: <ArrowDown className="w-4 h-4" />,
        },
        {
          label: "Upload",
          value: 0,
          unit: "Mbps",
          color: "cyan",
          icon: <ArrowUp className="w-4 h-4" />,
        },
        {
          label: "Latency",
          value: 0,
          unit: "ms",
          color: "violet",
          icon: <Gauge className="w-4 h-4" />,
        },
      ];
      setMetrics(newMetrics);

      setStatus("Measuring Latency...");
      const latency = await testLatency();
      newMetrics[2].value = latency;
      setMetrics([...newMetrics]);

      setStatus("Testing Download Speed...");
      const downloadSpeed = await testDownloadSpeed();
      newMetrics[0].value = downloadSpeed;
      setMetrics([...newMetrics]);

      setStatus("Testing Upload Speed...");
      const uploadSpeed = await testUploadSpeed();
      newMetrics[1].value = uploadSpeed;
      setMetrics([...newMetrics]);

      setStatus("✅ Test Complete");
    } catch (err) {
      setError("Speed test failed. Please try again.");
      setStatus("Error encountered");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 pt-28 pb-20 px-6">
  <div className="max-w-4xl mx-auto text-center">
    {/* Header */}
    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 mb-4 tracking-tight">
      VNX Speed Test
    </h1>
    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
      Real-time network diagnostics powered by <span className="font-semibold text-blue-600">VNX-Netscan</span> — 
      measure <span className="text-blue-500">download</span>, <span className="text-cyan-500">upload</span>, and <span className="text-violet-500">latency</span>.
    </p>
    <div className="inline-flex items-center text-sm text-blue-600 font-medium mb-10 bg-blue-50 px-4 py-2 rounded-full">
      <Wifi className="w-4 h-4 mr-2" /> Running via Cloudflare Network
    </div>

    {/* Start Button */}
    <div className="mt-4">
      <button
        onClick={runSpeedTest}
        disabled={testing}
        className="px-10 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 transition-all duration-300 flex items-center justify-center mx-auto gap-3"
      >
        {testing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Testing...
          </>
        ) : (
          <>
            <Gauge className="w-5 h-5" /> Start Test
          </>
        )}
      </button>
    </div>

    {/* Status Bar */}
    <div
      className={`mt-10 mx-auto max-w-md text-white font-semibold py-3 rounded-xl shadow-sm transition-all ${
        status.includes("Complete")
          ? "bg-green-500"
          : status.includes("Running") || status.includes("Testing")
          ? "bg-blue-500 animate-pulse"
          : "bg-slate-400"
      }`}
    >
      {status}
    </div>

    {/* Results Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
      {metrics.map((m, i) => {
        const colors = colorMap[m.color];
        const [bg, text] = colors.split(" ");
        return (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className={`p-4 rounded-full ${bg} ${text} mb-3`}>{m.icon}</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-1">{m.label}</h3>
            <p className={`text-4xl font-bold ${text}`}>{m.value.toFixed(1)} {m.unit}</p>
          </div>
        );
      })}
    </div>

    {/* Footer */}
    {!testing && status.includes("Complete") && (
      <div className="mt-12 text-slate-500 text-sm flex justify-center items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span>Network test completed successfully.</span>
      </div>
    )}

    {error && (
      <div className="mt-10 bg-red-100 text-red-600 px-4 py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm">
        <AlertTriangle className="w-5 h-5" /> {error}
      </div>
    )}
  </div>
</div>
  );
}

/* Add this CSS to globals.css (for smooth metric animations) */
