"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, CheckCircle, AlertCircle, Loader2, MapPin } from "lucide-react";

interface ResultPanelProps {
  title: string;
  data: any;
  loading: boolean;
  error: string | null;
}

export default function ResultPanel({ title, data, loading, error }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const summary = data
    ? `${data.isp || "Unknown ISP"} • ${data.city || "Unknown City"}, ${data.country || "Unknown Country"}`
    : null;

  const hasGeo = data && data.lat && data.lon;

  if (loading)
    return (
      <div className="mt-10 flex flex-col items-center justify-center text-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-500">Running diagnostic test...</p>
      </div>
    );

  if (error)
    return (
      <div className="mt-10 flex flex-col items-center text-center py-16">
        <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
        <p className="text-red-500 font-semibold">{error}</p>
        <p className="text-slate-500 text-sm mt-1">Please check your connection or try again.</p>
      </div>
    );

  if (!data)
    return <div className="text-center text-slate-500 mt-8">Awaiting input or scan request...</div>;

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8 max-w-4xl mx-auto animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <div className="flex items-center gap-3">
          {summary && (
            <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {summary}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition"
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

      {hasGeo && (
        <div className="mb-6 overflow-hidden rounded-xl shadow-sm border border-slate-100">
          <Image
            src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l+285A98(${data.lon},${data.lat})/${data.lon},${data.lat},8,0/800x300?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "pk.eyJ1IjoidmlzbmVjIiwiYSI6ImNtNDRjcHM3NjBhcnEyanM3ZWNnbXVkbGcifQ.demo"}`}
            alt="GeoIP map"
            width={800}
            height={300}
            className="w-full object-cover"
          />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p className="text-xs uppercase text-slate-500 font-medium">{key}</p>
            <p className="text-slate-800 font-semibold break-words">{String(value)}</p>
          </div>
        ))}
      </div>

      <details className="mt-6">
        <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
          Advanced View ▾
        </summary>
        <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left overflow-x-auto text-sm mt-2">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}
