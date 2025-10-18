// app/api/tools/netscan/<tool>/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase';
import { hasToolAccess } from '@/config/tools';

/**
 * Generic netscan tool route template
 *
 * Expects query params:
 *   - q (main query: ip/domain for geoip, host for portscan, etc.)
 *   - mock=true to return canned response in dev
 *
 * Standard response shape:
 *  { success, tool: '<geoip>', data, timestamp, cached, rateLimit: { remaining, resetIn } }
 */

// small LRU cache for results (10 minutes)
const cache = new LRUCache<string, any>({ max: 200, ttl: 1000 * 60 * 10 });

// tool key for config/permissions
const geoip = '<geoip>'; // <- replace with 'geoip', 'portscan', 'dns', 'ping', 'monitoring', 'security', 'topology', etc.

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || url.searchParams.get('ip') || '').trim();
    const useMocks = (url.searchParams.get('mock') || '').toLowerCase() === 'true';

    // simple mock support for dev/testing
    if (useMocks) {
      const mock = {
        success: true,
        tool: geoip,
        data: { message: `[mock] ${geoip} result for ${q || 'example'}` },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json({ ...mock, cached: false, rateLimit: { remaining: Infinity, resetIn: 0 } });
    }

    // require query param
    if (!q) {
      return NextResponse.json({ error: 'Query parameter required (q or ip)' }, { status: 400 });
    }

    // auth & tier
    const user = await getCurrentUser().catch(() => null);
    const userTier = user ? await getUserTier(user.id).catch(() => 'free') : 'free';
    const isProduction = process.env.NODE_ENV === 'production';

    // DEV bypass: allow running in preview/dev; enforce gate only in production
    const safeTier: 'free' | 'pro' = userTier === 'pro' ? 'pro' : 'free';
    if (!isProduction) {
      console.log(`[DEV MODE] ${geoip} running with unrestricted access (tier=${userTier})`);
    } else if (!hasToolAccess(geoip, safeTier)) {
      return NextResponse.json(
        {
          error: 'Pro subscription required',
          message: 'This tool requires a Pro subscription. Upgrade to access all tools.',
          upgradeUrl: '/tools/netscan/pricing',
        },
        { status: 403 }
      );
    }

    // rate limiting
    const clientIp = getClientIp(request);
    const identifier = user?.id || clientIp || 'anon';
    const isPro = userTier === 'pro';
    const rateLimit = await checkRateLimit(identifier, isPro);
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit.resetIn);

    // caching key
    const cacheKey = `${geoip}:${q}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        rateLimit: { remaining: rateLimit.remaining, resetIn: rateLimit.resetIn },
      });
    }

    // Perform actual lookup (implement per tool below)
    const resultData = await performLookup(q);

    const result = {
      success: true,
      tool: geoip,
      data: resultData,
      timestamp: new Date().toISOString(),
    };

    cache.set(cacheKey, result);

    return NextResponse.json({
      ...result,
      cached: false,
      rateLimit: { remaining: rateLimit.remaining, resetIn: rateLimit.resetIn },
    });
  } catch (err: any) {
    console.error(`${geoip} route error:`, err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}

/**
 * performLookup(q: string) -> implement per tool:
 * - return a serializable object representing "data" for the response.
 *
 * Example implementations/notes provided separately in the repo for each tool.
 */
async function performLookup(q: string): Promise<any> {
  // PLACEHOLDER: replace with real provider call
  // e.g. for geoip call ipapi.co, for dns call your DNS provider, for portscan call your scanning backend, etc.
  return { info: `Replace performLookup() for ${geoip}. Received: ${q}` };
}
