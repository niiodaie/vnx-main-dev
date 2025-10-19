 // app/api/tools/netscan/ip-lookup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase';

/**
 * IP Lookup wrapper: uses geoip internally, but keeps separate endpoint for UI.
 * Accepts ?ip=<ip|domain>&mock=true
 */

const cache = new LRUCache<string, any>({ max: 200, ttl: 1000 * 60 * 10 });

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const raw = (url.searchParams.get('ip') || '').trim();
    const mock = (url.searchParams.get('mock') || '').toLowerCase() === 'true';

    if (mock) {
      const out = { success: true, tool: 'ip-lookup', data: { ip: raw || '8.8.8.8', isp: 'Google', asn: 'AS15169', country: 'United States' }, timestamp: new Date().toISOString() };
      return NextResponse.json({ ...out, cached: false, rateLimit: { remaining: Infinity, resetIn: 0 } });
    }
    if (!raw) return NextResponse.json({ error: 'IP/domain required' }, { status: 400 });

    const user = await getCurrentUser().catch(() => null);
    const userTier = user ? await getUserTier(user.id).catch(() => 'free') : 'free';
    const id = user?.id || getClientIp(request) || 'anon';
    const rl = await checkRateLimit(id, userTier === 'pro');
    if (!rl.allowed) return rateLimitResponse(rl.resetIn);

    // call geoip route internally (server-side fetch)
    const resp = await fetch(`${new URL(request.url).origin}/api/tools/netscan/geoip?ip=${encodeURIComponent(raw)}`);
    if (!resp.ok) {
      return NextResponse.json({ error: 'GeoIP service error' }, { status: 502 });
    }
    const j = await resp.json();
    const out = { success: true, tool: 'ip-lookup', data: j.data ?? j, timestamp: new Date().toISOString() };
    cache.set(`iplookup:${raw}`, out);
    return NextResponse.json({ ...out, cached: false, rateLimit: { remaining: rl.remaining, resetIn: rl.resetIn } });
  } catch (err: any) {
    console.error('IP lookup error', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
