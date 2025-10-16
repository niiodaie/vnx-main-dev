"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Loader2 } from "lucide-react";

interface SmartTracerouteMapProps {
  hops: Array<{
    hop: number;
    ip: string;
    lat?: number;
    lon?: number;
    city?: string;
    country?: string;
    rtt?: number;
    success?: boolean;
  }>;
}

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
  "pk.eyJ1IjoidmlzbmVjIiwiYSI6ImNtNDRjcHM3NjBhcnEyanM3ZWNnbXVkbGcifQ.demo";

export default function SmartTracerouteMap({ hops }: SmartTracerouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [0, 20],
        zoom: 2,
      });

      map.current.on("load", () => setLoading(false));
    }

    if (!map.current || !hops?.length) return;
    const currentMap = map.current;

    // Clear previous layers/sources
    const existing = currentMap.getStyle().layers || [];
    existing.forEach((layer) => {
      if (layer.id.startsWith("hop-")) {
        if (currentMap.getLayer(layer.id)) currentMap.removeLayer(layer.id);
        if (currentMap.getSource(layer.id)) currentMap.removeSource(layer.id);
      }
    });

    // Plot each hop with animation delay
    hops.forEach((hop, idx) => {
      if (!hop.lat || !hop.lon) return;

      const color =
        hop.success === false
          ? "#ef4444"
          : hop.rtt && hop.rtt < 100
          ? "#22c55e"
          : hop.rtt && hop.rtt < 200
          ? "#facc15"
          : "#f87171";

      // Marker element
      const marker = document.createElement("div");
      marker.className = "hop-marker";
      marker.style.width = "16px";
      marker.style.height = "16px";
      marker.style.borderRadius = "50%";
      marker.style.backgroundColor = color;
      marker.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
      marker.style.transition = "transform 0.3s ease";

      const popupHtml = `
        <div class="text-sm">
          <strong>Hop ${hop.hop}</strong><br/>
          ${hop.city || ""}, ${hop.country || ""}<br/>
          IP: ${hop.ip}<br/>
          RTT: ${hop.rtt ? hop.rtt.toFixed(1) + " ms" : "N/A"}
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 10 }).setHTML(popupHtml);
      new mapboxgl.Marker(marker).setLngLat([hop.lon, hop.lat]).setPopup(popup).addTo(currentMap);

      // Animate hop lines
      if (idx > 0) {
        const prev = hops[idx - 1];
        if (prev.lat && prev.lon) {
          const lineId = `hop-line-${idx}-${Date.now()}`;
          const coords = [
            [prev.lon, prev.lat],
            [hop.lon, hop.lat],
          ];

          currentMap.addSource(lineId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: coords,
              },
            },
          });

          currentMap.addLayer({
            id: lineId,
            type: "line",
            source: lineId,
            paint: {
              "line-color": color,
              "line-width": 3,
              "line-opacity": 0.7,
            },
          });
        }
      }
    });

    // Fit bounds
    const bounds = new mapboxgl.LngLatBounds();
    hops.forEach((h) => h.lon && h.lat && bounds.extend([h.lon, h.lat]));
    if (!bounds.isEmpty()) currentMap.fitBounds(bounds, { padding: 80, duration: 1000 });
  }, [hops]);

  return (
    <div className="relative mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-md">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-[400px]" />

      {/* Hop Stats Panel */}
      {hops?.length > 0 && (
        <div className="bg-white border-t border-slate-200 p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {hops.map((hop) => (
            <div
              key={hop.hop}
              className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:shadow-md transition-all"
            >
              <p className="text-sm font-semibold text-slate-800">
                Hop {hop.hop} – {hop.ip}
              </p>
              <p className="text-xs text-slate-500">
                {hop.city || "Unknown"}, {hop.country || ""}
              </p>
              <p
                className={`text-sm font-bold ${
                  hop.success === false
                    ? "text-red-600"
                    : hop.rtt && hop.rtt < 100
                    ? "text-green-600"
                    : hop.rtt && hop.rtt < 200
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {hop.rtt ? `${hop.rtt.toFixed(1)} ms` : "No Response"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
