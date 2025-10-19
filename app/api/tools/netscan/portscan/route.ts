// app/api/tools/netscan/<tool>/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

const cache = new LRUCache<string, any>({ max: 200, ttl: 1000 * 60 * 10 });
const portscan/ = '<toolKey>'; // e.g., geoip, dns, portscan, etc.

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || url.searchParams.get('ip') || '').trim();
    const useMocks = (url.searchParams.get('mock') || '').toLowerCase() === 'true';

    if (!q) {
      return NextResponse.json({ error: 'Missing required parameter' }, { status: 400 });
    }

    // Free mode: skip subscription gating
    const clientIp = getClientIp(request);
    const identifier = clientIp || 'anon';
    const rateLimit = await checkRateLimit(identifier, false);
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit.resetIn);

    // Optional mock mode
    if (useMocks) {
      return NextResponse.json({
        success: true,
        tool: portscan/,
        data: { message: `[mocked] ${portscan/} result for ${q}` },
        cached: false,
        rateLimit: { remaining: Infinity, resetIn: 0 },
        timestamp: new Date().toISOString(),
      });
    }

    const cacheKey = `${portscan/}:${q}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        rateLimit: { remaining: rateLimit.remaining, resetIn: rateLimit.resetIn },
      });
    }

    // Do the actual lookup
    const data = await performLookup(q);

    const result = {
      success: true,
      tool: portscan/,
      data,
      timestamp: new Date().toISOString(),
    };

    cache.set(cacheKey, result);
    return NextResponse.json({
      ...result,
      cached: false,
      rateLimit: { remaining: rateLimit.remaining, resetIn: rateLimit.resetIn },
    });
  } catch (err: any) {
    console.error(`${portscan/} route error:`, err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

// Replace this with your real tool logic
async function performLookup(q: string): Promise<any> {
  return { info: `Performing ${portscan/} lookup for ${q}` };
}
