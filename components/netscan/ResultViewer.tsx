'use client';

import { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';

interface ResultViewerProps {
  data: any;
  title?: string;
}

export default function ResultViewer({ data, title = 'Results' }: ResultViewerProps) {
  const [copied, setCopied] = useState(false);

  const hasMapData =
    data?.latitude &&
    data?.longitude &&
    typeof data.latitude === 'number' &&
    typeof data.longitude === 'number';

  const hasMapDataInLocation =
    data?.location?.coordinates?.latitude &&
    data?.location?.coordinates?.longitude;

  const lat = hasMapData
    ? data.latitude
    : hasMapDataInLocation
    ? data.location.coordinates.latitude
    : null;
  const lon = hasMapData
    ? data.longitude
    : hasMapDataInLocation
    ? data.location.coordinates.longitude
    : null;

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const showMap = lat && lon;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netscan-result-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Map Section */}
      {showMap && (
        <div className="rounded-lg overflow-hidden border-2 border-blue-200">
          {mapboxToken ? (
            <img
              src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l+0047ff(${lon},${lat})/${lon},${lat},4/600x300?access_token=${mapboxToken}`}
              alt="Location Map"
              className="w-full h-[300px] object-cover"
            />
          ) : (
            <div className="w-full h-[300px] flex items-center justify-center bg-slate-200 text-slate-600">
              <div className="text-center">
                <p className="font-medium">Map unavailable</p>
                <p className="text-sm">No Mapbox token configured</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Card */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Download JSON"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* JSON Content */}
        <div className="p-6">
          <pre className="bg-slate-50 rounded-lg p-4 overflow-x-auto text-sm">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

