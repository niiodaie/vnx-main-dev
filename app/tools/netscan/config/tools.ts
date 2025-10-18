export const NETSCAN_TOOLS = [
  { name: 'Ping', path: '/api/ping', tier: 'free', enabled: true, description: 'Check reachability & latency' },
  { name: 'WHOIS', path: '/api/whois', tier: 'free', enabled: true, description: 'Domain registration info' },
  { name: 'GeoIP', path: '/api/geoip', tier: 'free', enabled: true, description: 'IP geolocation (city, country)' },
  { name: 'Traceroute', path: '/api/traceroute', tier: 'pro', enabled: true, description: 'Show network hops' },
  { name: 'Port Scan', path: '/api/scan', tier: 'pro', enabled: true, description: 'Quick TCP port scan' },
  { name: 'DNS Lookup', path: '/api/dns', tier: 'free', enabled: true, description: 'Resolve A/MX/NS records' },
]
