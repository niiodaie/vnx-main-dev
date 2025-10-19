 // app/api/tools/netscan/ping/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase';

/**
 * Ping endpoint (dev-friendly)
 * Accepts ?ip=<domain|url>&count=4&mock=true
 * Note: Serverless can't send ICMP. We approximate latency with an HTTP HEAD/GET
 * if the target has http(s); otherwise return mock/tracer time.
 */

const cache = new LRUCache<string, any>({ max: 200, ttl: 1000 * 60 * 1 });

function nowMs() { return Date.now(); }

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const raw = (url.searchParams.get('ip') || '').trim();
    const count = Math.min(10, Math.max(1, Number(url.searchParams.get('count')) || 4));
    const mock = (url.searchParams.get('mock') || '').toLowerCase() === 'true';

    if (!raw) return NextResponse.json({ error: 'target is required' }, { status: 400 });

    if (mock) {
      const sample = { success: true, tool: 'ping', data: { target: raw, rtt_ms: [12, 15, 14, 13].slice(0, count), loss: 0 }, timestamp: new Date().toISOString() };
      return NextResponse.json({ ...sample, cached: false, rateLimit: { remaining: Infinity, resetIn: 0 } });
    }

    const user = await getCurrentUser().catch(() => null);
    const userTier = user ? await getUserTier(user.id).catch(() => 'free') : 'free';
    const id = user?.id || getClientIp(request) || 'anon';
    const rl = await checkRateLimit(id, userTier === 'pro');
    if (!rl.allowed) return rateLimitResponse(rl.resetIn);

    // If looks like an http/s URL or domain, attempt HEAD requests to measure RTT
    const targetUrl = raw.match(/^https?:\/\//i) ? raw : `https://${raw}`;
    const rtts: number[] = [];
    for (let i = 0; i < count; i++) {
      const start = nowMs();
      try {
        // HEAD often blocked; fall back to GET but with short timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        await fetch(targetUrl, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeout);
        rtts.push(nowMs() - start);
      } catch (e) {
        // on failure, push a sentinel high latency and continue
        rtts.push(9999);
      }
    }

    const loss = rtts.filter(r => r === 9999).length / count;
    const result = { success: true, tool: 'ping', data: { target: raw, rtt_ms: rtts, loss }, timestamp: new Date().toISOString() };
    return NextResponse.json({ ...result, cached: false, rateLimit: { remaining: rl.remaining, resetIn: rl.resetIn } });
  } catch (err: any) {
    console.error('Ping error', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
