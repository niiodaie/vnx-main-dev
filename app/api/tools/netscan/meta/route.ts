import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const meta = {
    name: 'VNX-Netscan',
    version: '1.0.0-phase1',
    description: 'Network diagnostic and scanning tools',
    tools: [
      {
        id: 'ip-lookup',
        name: 'IP Lookup',
        description: 'Get detailed information about an IP address',
        endpoint: '/api/tools/netscan/ip-lookup',
        params: ['ip'],
      },
      {
        id: 'geoip',
        name: 'GeoIP',
        description: 'Get geographic location information for an IP',
        endpoint: '/api/tools/netscan/geoip',
        params: ['ip'],
      },
      {
        id: 'whois',
        name: 'WHOIS',
        description: 'Get domain registration information',
        endpoint: '/api/tools/netscan/whois',
        params: ['domain'],
      },
      {
        id: 'dns',
        name: 'DNS Lookup',
        description: 'Query DNS records for a domain',
        endpoint: '/api/tools/netscan/dns',
        params: ['domain'],
      },
    ],
    features: {
      caching: true,
      cacheTTL: 600, // 10 minutes
      authentication: !!process.env.NETSCAN_API_KEY,
      mapbox: !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    },
    status: 'operational',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(meta);
}

