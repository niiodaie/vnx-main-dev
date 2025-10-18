'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface GeoMapProps {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  isp?: string;
}

// Custom VNX marker
const markerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export default function GeoMap({ latitude, longitude, city, country, isp }: GeoMapProps) {
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || map) return;

    const leafletMap = L.map('geoip-map', {
      center: [latitude, longitude],
      zoom: 6,
      scrollWheelZoom: false,
    });

    // OpenStreetMap layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(leafletMap);

    // Marker with popup
    const marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(leafletMap);
    marker.bindPopup(`
      <b>${city || 'Unknown City'}, ${country || 'Unknown Country'}</b><br/>
      ISP: ${isp || 'N/A'}
    `);

    setMap(leafletMap);

    return () => leafletMap.remove();
  }, [latitude, longitude]);

  return (
    <div
      id="geoip-map"
      className="w-full h-[400px] rounded-2xl border border-slate-200 shadow-md overflow-hidden"
    />
  );
}
