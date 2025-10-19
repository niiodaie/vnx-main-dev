// app/api/tools/netscan/dns/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase';

/**
 * DNS Lookup route
 * Accepts: ?ip=<domain|ip>&type=A|MX|NS (default A) &mock=true
 */

const cache = new LRUCache<string, any>({ max: 200, ttl: 1000 * 60 * 10 });

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const target = (url.searchParams.get('ip') || '').trim();
    const type = (url.searchParams.get('type') || 'A').toUpperCase();
    const useMocks = (url.searchParams.get('mock') || '').toLowerCase() === 'true';

    if (useMocks) {
      const mock = { success: true, tool: 'dns', data: { query: target || 'example.com', type, Answer: [{ name: target || 'example.com', type: type === 'A' ? 1 : type === 'MX' ? 15 : 2, data: '1.2.3.4' }] }, timestamp: new Date().toISOString() };
      return NextResponse.json({ ...mock, cached: false, rateLimit: { remaining: Infinity, resetIn: 0 } });
    }
    if (!target) return NextResponse.json({ error: 'domain is required' }, { status: 400 });

    const user = await getCurrentUser().catch(() => null);
    const userTier = user ? await getUserTier(user.id).catch(() => 'free') : 'free';
    const id = user?.id || getClientIp(request) || 'anon';
    const rl = await checkRateLimit(id, userTier === 'pro');
    if (!rl.allowed) return rateLimitResponse(rl.resetIn);

    const cacheKey = `dns:${target}:${type}`;
    const cached = cache.get(cacheKey);
    if (cached) return NextResponse.json({ ...cached, cached: true, rateLimit: { remaining: rl.remaining, resetIn: rl.resetIn } });

    // Use Google DoH
    const dohUrl = `https://dns.google/resolve?name=${encodeURIComponent(target)}&type=${encodeURIComponent(type)}`;
    const r = await fetch(dohUrl);
    if (!r.ok) {
      return NextResponse.json({ error: 'DNS provider error' }, { status: 502 });
    }
    const j = await r.json();
    const result = { success: true, tool: 'dns', data: j, timestamp: new Date().toISOString() };
    cache.set(cacheKey, result);
    return NextResponse.json({ ...result, cached: false, rateLimit: { remaining: rl.remaining, resetIn: rl.resetIn } });
  } catch (err: any) {
    console.error('DNS route error', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
