import SmartTracerouteMap from "@/components/netscan/SmartTracerouteMap";

export default function TraceroutePage() {
  const mockHops = [
    { hop: 1, ip: "192.168.1.1", city: "Local", country: "Router", lat: 37.77, lon: -122.42, rtt: 5, success: true },
    { hop: 2, ip: "10.0.0.1", city: "Chicago", country: "USA", lat: 41.88, lon: -87.63, rtt: 45, success: true },
    { hop: 3, ip: "172.16.0.1", city: "New York", country: "USA", lat: 40.71, lon: -74.00, rtt: 90, success: true },
    { hop: 4, ip: "8.8.8.8", city: "Mountain View", country: "USA", lat: 37.39, lon: -122.08, rtt: 110, success: true },
  ];
  return <SmartTracerouteMap hops={mockHops} />;
}
