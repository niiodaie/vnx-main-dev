 // app/api/tools/netscan/portscan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase';

/**
 * Port scan (dev-safe).
 * Accepts: ?ip=<host|ip>&ports=22,80,443&mock=true
 *
 * WARNING: performing real port scans from serverless can be harmful, blocked, or violate provider policy.
 * This endpoint returns mock results for development. Later you can replace mock logic with an authorized scanning backend.
 */

const cache = new LRUCache<string, any>({ max: 200, ttl: 1000 * 60 * 10 });

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const target = (url.searchParams.get('ip') || '').trim();
    const portsParam = (url.searchParams.get('ports') || '22,80,443').trim();
    const useMocks = (url.searchParams.get('mock') || '').toLowerCase() === 'true';

    if (!target) return NextResponse.json({ error: 'target is required' }, { status: 400 });
    const ports = portsParam.split(',').map(p => Number(p.trim())).filter(Boolean);

    if (useMocks) {
      // generate predictable mock output
      const result = ports.map(p => ({ port: p, proto: 'tcp', state: (p === 22 ? 'open' : p === 80 ? 'open' : 'closed'), service: p === 22 ? 'ssh' : p === 80 ? 'http' : null }));
      return NextResponse.json({ success: true, tool: 'portscan', data: { target, results: result }, cached: false, timestamp: new Date().toISOString(), rateLimit: { remaining: Infinity, resetIn: 0 } });
    }

    const user = await getCurrentUser().catch(() => null);
    const userTier = user ? await getUserTier(user.id).catch(() => 'free') : 'free';
    const id = user?.id || getClientIp(request) || 'anon';
    const rl = await checkRateLimit(id, userTier === 'pro');
    if (!rl.allowed) return rateLimitResponse(rl.resetIn);

    // For now: return "best-effort" using HTTP probe for common ports, otherwise mark closed.
    const probeResults: any[] = [];
    for (const p of ports) {
      try {
        // probe using http scheme when port is 80/443; otherwise skip active network scan.
        if (p === 80 || p === 443) {
          const scheme = p === 443 ? 'https' : 'http';
          const start = Date.now();
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);
          await fetch(`${scheme}://${target}`, { method: 'HEAD', signal: controller.signal });
          clearTimeout(timeout);
          probeResults.push({ port: p, proto: 'tcp', state: 'open', rtt_ms: Date.now() - start, service: p === 443 ? 'https' : 'http' });
        } else {
          // we cannot open sockets here; mark as filtered/unknown
          probeResults.push({ port: p, proto: 'tcp', state: 'filtered', service: null });
        }
      } catch (e) {
        probeResults.push({ port: p, proto: 'tcp', state: 'closed', service: null });
      }
    }

    const out = { success: true, tool: 'portscan', data: { target, results: probeResults }, timestamp: new Date().toISOString() };
    cache.set(`ps:${target}:${ports.join(',')}`, out);
    return NextResponse.json({ ...out, cached: false, rateLimit: { remaining: rl.remaining, resetIn: rl.resetIn } });
  } catch (err: any) {
    console.error('Portscan error', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
