"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Gauge, Wifi, Loader2, CheckCircle } from "lucide-react";

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

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    cyan: "bg-cyan-100 text-cyan-600",
    violet: "bg-violet-100 text-violet-600",
  };

  const runSpeedTest = async () => {
    setTesting(true);
    setStatus("Running speed test...");
    setMetrics([]);

    const simulated: Metric[] = [
      { label: "Download", value: 0, unit: "Mbps", color: "blue", icon: <ArrowDown className="w-4 h-4" /> },
      { label: "Upload", value: 0, unit: "Mbps", color: "cyan", icon: <ArrowUp className="w-4 h-4" /> },
      { label: "Latency", value: 0, unit: "ms", color: "violet", icon: <Gauge className="w-4 h-4" /> },
    ];
    setMetrics(simulated);

    // Simulated gradual results for visual feedback
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 150));
      simulated[0].value = Math.min(100, simulated[0].value + Math.random() * 6);
      simulated[1].value = Math.min(40, simulated[1].value + Math.random() * 3);
      simulated[2].value = 5 + Math.random() * 40;
      setMetrics([...simulated]);
    }

    setStatus("✅ Test Complete");
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* Header */}
        <h1 className="text-4xl font-bold text-slate-800 mb-2">VNX Speed Test</h1>
        <p className="text-slate-500 mb-6">
          Measure your internet connection speed — download, upload, and latency.
        </p>
        <div className="inline-flex items-center text-sm text-blue-600 font-medium">
          <Wifi className="w-4 h-4 mr-1" /> Powered by VNX-Netscan
        </div>

        {/* Test Button */}
        <div className="mt-8">
          <button
            onClick={runSpeedTest}
            disabled={testing}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 flex items-center justify-center mx-auto gap-2"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Testing...
              </>
            ) : (
              <>
                <Gauge className="w-4 h-4" /> Start Test
              </>
            )}
          </button>
        </div>

        {/* Status Banner */}
        <div
          className={`mt-8 mx-auto max-w-md text-white font-semibold py-3 rounded-lg transition-all ${
            status.includes("Complete")
              ? "bg-green-500"
              : status.includes("Running")
              ? "bg-blue-500 animate-pulse"
              : "bg-slate-400"
          }`}
        >
          {status}
        </div>

        {/* Metrics Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          {metrics.map((m, i) => {
            const colors = colorMap[m.color];
            const [bg, text] = colors.split(" ");
            return (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center transition-all animate-[popIn_0.3s_ease-in-out]"
              >
                <div className={`p-3 rounded-full ${bg} ${text} mb-2`}>{m.icon}</div>
                <h3 className="text-lg font-semibold text-slate-700">{m.label}</h3>
                <p className={`text-3xl font-bold ${text}`}>
                  {m.value.toFixed(1)} {m.unit}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {!testing && status.includes("Complete") && (
          <div className="mt-8 text-slate-500 text-sm flex justify-center items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Speed test completed successfully.</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* Add this CSS to globals.css for animation */
