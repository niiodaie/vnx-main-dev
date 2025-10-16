"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface SmartTracerouteMapProps {
  hops: Array<{
    hop: number;
    ip: string;
    lat?: number;
    lon?: number;
    city?: string;
    country?: string;
    rtt?: number;
  }>;
}

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
  "pk.eyJ1IjoidmlzbmVjIiwiYSI6ImNtNDRjcHM3NjBhcnEyanM3ZWNnbXVkbGcifQ.demo";

export default function SmartTracerouteMap({ hops }: SmartTracerouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map only once
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [0, 20],
        zoom: 2,
      });
    }

    if (!map.current) return;
    const currentMap = map.current;

    // Clear old markers
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    // Add markers for hops
    const validHops = hops.filter((h) => h.lon && h.lat);
    validHops.forEach((hop) => {
      const el = document.createElement("div");
      el.className = "hop-marker";
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = "#007aff";
      el.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
      const marker = new mapboxgl.Marker(el)
        .setLngLat([hop.lon!, hop.lat!])
        .setPopup(
          new mapboxgl.Popup({ offset: 8 }).setHTML(`
            <strong>Hop ${hop.hop}</strong><br/>
            IP: ${hop.ip}<br/>
            ${hop.city || ""}, ${hop.country || ""}
          `)
        )
        .addTo(currentMap);

      markers.current.push(marker);
    });

    // Remove existing route layers
    const layers = currentMap.getStyle().layers;
    if (layers) {
      layers.forEach((layer) => {
        if (layer.id.startsWith("hop-line")) {
          if (currentMap.getLayer(layer.id)) currentMap.removeLayer(layer.id);
          if (currentMap.getSource(layer.id)) currentMap.removeSource(layer.id);
        }
      });
    }

    // Draw connecting line
    if (validHops.length >= 2) {
      const lineCoords = validHops.map((h) => [h.lon!, h.lat!]);
      const lineId = `hop-line-${Date.now()}`;

      currentMap.addSource(lineId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: lineCoords },
        },
      });

      currentMap.addLayer({
        id: lineId,
        type: "line",
        source: lineId,
        paint: {
          "line-color": "#00b3ff",
          "line-width": 3,
          "line-opacity": 0.7,
        },
      });

      const bounds = new mapboxgl.LngLatBounds();
      lineCoords.forEach((c) => bounds.extend(c));
      currentMap.fitBounds(bounds, { padding: 80, duration: 1000 });
    }
  }, [hops]);

  return (
    <div className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-md">
      <div ref={mapContainer} className="w-full h-[400px]" />
    </div>
  );
}
