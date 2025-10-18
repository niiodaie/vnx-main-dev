'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// ✅ Leaflet CSS
import 'leaflet/dist/leaflet.css';

// ✅ Leaflet will be loaded dynamically later to avoid SSR issues
let L: any = null;


interface GeoMapProps {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  isp?: string;
}

export default function GeoMap({ latitude, longitude, city, country, isp }: GeoMapProps) {
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    async function loadLeaflet() {
      const leaflet = await import('leaflet');
      L = leaflet;

      const markerIcon = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      if (!map) {
        const leafletMap = L.map('geoip-map', {
          center: [latitude, longitude],
          zoom: 6,
          scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }).addTo(leafletMap);

        const marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(leafletMap);
        marker.bindPopup(`
          <b>${city || 'Unknown City'}, ${country || 'Unknown Country'}</b><br/>
          ISP: ${isp || 'N/A'}
        `);

        setMap(leafletMap);
      }
    }

    loadLeaflet();

    return () => {
      if (map) map.remove();
    };
  }, [latitude, longitude]);

  return (
    <div
      id="geoip-map"
      className="w-full h-[400px] rounded-2xl border border-slate-200 shadow-md overflow-hidden"
    />
  );
}
