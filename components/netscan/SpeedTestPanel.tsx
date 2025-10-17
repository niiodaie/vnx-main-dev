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
  const [resultSummary, setResultSummary] = useState<{
    status: string;
    message: string;
    download: number;
    upload: number;
    latency: number;
  } | null>(null);

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
    setResultSummary(null);

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

      // Summary evaluation
      let summaryStatus = "Good";
      let summaryMsg = "Your internet speed is stable for streaming and browsing.";
      if (downloadSpeed > 100 && latency < 50) {
        summaryStatus = "Excellent";
        summaryMsg =
          "Fantastic! You have a fast and reliable connection — perfect for gaming, 4K streaming, and remote work.";
      } else if (downloadSpeed < 25 || latency > 150) {
        summaryStatus = "Poor";
        summaryMsg =
          "Your connection seems slow or unstable. Consider checking your router or upgrading your plan.";
      }

      setResultSummary({
        status: summaryStatus,
        message: summaryMsg,
        download: downloadSpeed,
        upload: uploadSpeed,
        latency,
      });

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
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent mb-4 tracking-tight">
          VNX Speed Test
        </h1>
        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
          Real-time network diagnostics powered by{" "}
          <span className="font-semibold text-blue-600">VNX-Netscan</span> — measure{" "}
          <span className="text-blue-500">download</span>,{" "}
          <span className="text-cyan-500">upload</span>, and{" "}
          <span className="text-violet-500">latency</span>.
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
                <div className={`p-4 rounded-full ${bg} ${text} mb-3`}>
                  {m.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-1">
                  {m.label}
                </h3>
                <p className={`text-4xl font-bold ${text}`}>
                  {m.value.toFixed(1)} {m.unit}
                </p>
              </div>
            );
          })}
        </div>

        {/* Performance Summary */}
        {!testing && resultSummary && (
          <div className="mt-14 bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-left max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-600" /> Performance Summary
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              {resultSummary.message}
            </p>
            <div className="flex items-center gap-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  resultSummary.status === "Excellent"
                    ? "bg-green-100 text-green-700"
                    : resultSummary.status === "Good"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {resultSummary.status}
              </span>
              <p className="text-sm text-slate-500">
                ({resultSummary.download} Mbps download, {resultSummary.upload} Mbps upload,{" "}
                {resultSummary.latency} ms latency)
              </p>
            </div>
          </div>
        )}

        {/* Affiliate Recommendations */}
        {!testing && resultSummary && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              💡 Recommended Tools & Upgrades
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <a
                href="https://amzn.to/44mFp0h"
                target="_blank"
                className="block bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center"
              >
                <img
                  src="https://m.media-amazon.com/images/I/61f0pET2hCL._AC_SL1500_.jpg"
                  alt="WiFi 6 Router"
                  className="w-20 h-20 mx-auto mb-4 object-contain"
                />
                <h3 className="font-semibold text-slate-800 mb-2">
                  Upgrade to WiFi 6
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                  Boost range, speed & stability with the latest mesh routers.
                </p>
                <span className="text-blue-600 font-medium text-sm">
                  Shop on Amazon →
                </span>
              </a>

              <a
                href="https://payhip.com/affiliate-program"
                target="_blank"
                className="block bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7e/VPN_icon.svg"
                  alt="VPN Service"
                  className="w-20 h-20 mx-auto mb-4 object-contain"
                />
                <h3 className="font-semibold text-slate-800 mb-2">
                  Protect Your Connection
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                  Stay private and secure online with top-rated VPN services.
                </p>
                <span className="text-cyan-600 font-medium text-sm">
                  Try a VPN →
                </span>
              </a>

              <a
                href="https://www.buymeacoffee.com/partners"
                target="_blank"
                className="block bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center"
              >
                <img
                  src="https://cdn.buymeacoffee.com/buttons/bmc-new-logo.svg"
                  alt="Support"
                  className="w-20 h-20 mx-auto mb-4 object-contain"
                />
                <h3 className="font-semibold text-slate-800 mb-2">
                  Support VNX Tools
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                  Enjoy using our free diagnostics? Help us build more tools!
                </p>
                <span className="text-pink-600 font-medium text-sm">
                  Buy Us a Coffee →
                </span>
              </a>
            </div>
          </div>
        )}

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
