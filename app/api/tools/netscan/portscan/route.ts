// app/api/tools/netscan/portscan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase';
import { hasToolAccess } from '@/config/tools';
import net from 'net';

/**
 * Port Scanner API
 * - Scans a list of TCP ports on a target host or IP
 * - Example query: /api/tools/netscan/portscan?target=example.com&ports=80,443,22
 * - Optional: ?mock=true for demo output
 *
 * Response JSON:
 * {
 *   success: boolean,
 *   tool: 'portscan',
 *   data: { host, openPorts: [22,80], closedPorts: [443] },
 *   rateLimit, timestamp, cached
 * }
 */

const cache = new LRUCache<string, any>({
  max: 200,
  ttl: 1000 * 60 * 5, // 5-minute TTL
});

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const target = (params.get('target') || '').trim();
    const portParam = (params.get('ports') || '').trim();
    const useMock = params.get('mock')?.toLowerCase() === 'true';
    const isProduction = process.env.NODE_ENV === 'production';

    // ✅ Mock mode
    if (useMock) {
      return NextResponse.json({
        success: true,
        tool: 'portscan',
        data: {
          host: target || '8.8.8.8',
          openPorts: [22, 80, 443],
          closedPorts: [21, 25, 3306],
        },
        cached: false,
        rateLimit: { remaining: Infinity, resetIn: 0 },
        timestamp: new Date().toISOString(),
      });
    }

    // ✅ Validate
    if (!target) {
      return NextResponse.json({ error: 'Target host or IP is required' }, { status: 400 });
    }

    // Parse ports
    const ports = portParam
      ? portParam
          .split(',')
          .map((p) => parseInt(p.trim(), 10))
          .filter((p) => !isNaN(p) && p > 0 && p <= 65535)
      : [21, 22, 25, 53, 80, 110, 143, 443, 445, 8080];

    // ✅ Auth / Tier
    const user = await getCurrentUser().catch(() => null);
    const userTier = user ? await getUserTier(user.id).catch(() => 'free') : 'free';
    const safeTier: 'free' | 'pro' = userTier === 'pro' ? 'pro' : 'free';

    if (isProduction && !hasToolAccess('portscan', safeTier)) {
      return NextResponse.json(
        {
          error: 'Pro subscription required',
          message: 'This tool requires a Pro subscription. Upgrade to access all tools.',
          upgradeUrl: '/tools/netscan/pricing',
        },
        { status: 403 }
      );
    }

    // ✅ Rate limit
    const clientIp = getClientIp(request);
    const identifier = user?.id || clientIp || 'anon';
    const isPro = userTier === 'pro';
    const rateLimit = await checkRateLimit(identifier, isPro);

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetIn);
    }

    // ✅ Cache lookup
    const cacheKey = `portscan:${target}:${ports.join(',')}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        rateLimit: { remaining: rateLimit.remaining, resetIn: rateLimit.resetIn },
      });
    }

    // ✅ Run actual port scan (TCP connect)
    const scanResults = await scanPorts(target, ports);

    const result = {
      success: true,
      tool: 'portscan',
      data: { host: target, ...scanResults },
      timestamp: new Date().toISOString(),
    };

    cache.set(cacheKey, result);

    return NextResponse.json({
      ...result,
      cached: false,
      rateLimit: { remaining: rateLimit.remaining, resetIn: rateLimit.resetIn },
    });
  } catch (error: any) {
    console.error('PortScan error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

/* -------------------------- Helper functions -------------------------- */

/**
 * Asynchronously scan a set of ports using TCP connection attempts.
 * Timeout: 1200 ms per port
 */
async function scanPorts(
  host: string,
  ports: number[]
): Promise<{ openPorts: number[]; closedPorts: number[] }> {
  const openPorts: number[] = [];
  const closedPorts: number[] = [];

  const checks = ports.map(
    (port) =>
      new Promise<void>((resolve) => {
        const socket = new net.Socket();
        let isOpen = false;

        socket.setTimeout(1200);

        socket
          .once('connect', () => {
            isOpen = true;
            openPorts.push(port);
            socket.destroy();
            resolve();
          })
          .once('timeout', () => {
            socket.destroy();
            if (!isOpen) closedPorts.push(port);
            resolve();
          })
          .once('error', () => {
            socket.destroy();
            if (!isOpen) closedPorts.push(port);
            resolve();
          })
          .connect(port, host);
      })
  );

  await Promise.all(checks);
  return { openPorts, closedPorts };
}
