// app/api/tools/netscan/meta/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

/**
 * Meta route - list of tools and UI metadata.
 * No Pro gating here (development).
 */

const cache = new LRUCache<string, any>({ max: 50, ttl: 1000 * 60 * 10 });

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const useMocks = (url.searchParams.get('mock') || '').toLowerCase() === 'true';

    // rate-limit guard (light)
    const user = await getCurrentUser().catch(() => null);
    const userTier = user ? await getUserTier(user.id).catch(() => 'free') : 'free';
    const id = user?.id || getClientIp(req) || 'anon';
    const rl = await checkRateLimit(id, userTier === 'pro');
    if (!rl.allowed) return rateLimitResponse(rl.resetIn);

    const cacheKey = 'tools_meta';
    const cached = cache.get(cacheKey);
    if (cached) return NextResponse.json({ ...cached, cached: true, rateLimit: { remaining: rl.remaining, resetIn: rl.resetIn } });

    // canonical tool metadata used by UI
    const tools = [
      {
        id: 'ip-lookup',
        title: 'IP Address Lookup',
        description: 'Get geolocation, ISP information, timezone, ASN and basic network data for an IP or domain.',
        path: '/api/tools/netscan/ip-lookup',
        icon: 'search',
        params: [{ name: 'ip', required: true }, { name: 'mock', required: false }],
      },
      {
        id: 'portscan',
        title: 'Port Scanner',
        description: 'Quick TCP port probe (dev-safe).',
        path: '/api/tools/netscan/portscan',
        icon: 'scanner',
        params: [{ name: 'ip', required: true }, { name: 'ports', required: false }, { name: 'mock', required: false }],
      },
      {
        id: 'geoip',
        title: 'GeoIP',
        description: 'Resolve IP to geolocation, ASN, ISP, timezone.',
        path: '/api/tools/netscan/geoip',
        icon: 'map-pin',
        params: [{ name: 'ip', required: true }, { name: 'mock', required: false }],
      },
      {
        id: 'dns',
        title: 'DNS Lookup',
        description: 'Resolve A/MX/NS/AAAA records via DNS-over-HTTPS.',
        path: '/api/tools/netscan/dns',
        icon: 'globe',
        params: [{ name: 'ip', required: true }, { name: 'type', required: false }, { name: 'mock', required: false }],
      },
      {
        id: 'whois',
        title: 'Domain Tools (WHOIS / RDAP)',
        description: 'RDAP lookup for domain registration and contact metadata.',
        path: '/api/tools/netscan/whois',
        icon: 'document',
        params: [{ name: 'ip', required: true }, { name: 'mock', required: false }],
      },
      {
        id: 'speed',
        title: 'Network Speed Test',
        description: 'Browser-driven speed test using server upload/download endpoints.',
        path: '/api/tools/netscan/speed',
        icon: 'speedometer',
        params: [{ name: 'download_size_mb', required: false }, { name: 'upload', required: false }, { name: 'mock', required: false }],
      },
      {
        id: 'network-analyzer',
        title: 'Wi-Fi / Network Analyzer (dev)',
        description: 'Wi-Fi scan / summary. For real packet capture use a native agent.',
        path: '/api/tools/netscan/network-analyzer',
        icon: 'wifi',
        params: [{ name: 'ip', required: true }, { name: 'mock', required: false }],
      },
      // add more if needed
    ];

    const payload = { success: true, tool: 'meta', data: tools, timestamp: new Date().toISOString() };
    cache.set(cacheKey, payload);
    return NextResponse.json({ ...payload, cached: false, rateLimit: { remaining: rl.remaining, resetIn: rl.resetIn } });
  } catch (err: any) {
    console.error('Meta route error', err);
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}
