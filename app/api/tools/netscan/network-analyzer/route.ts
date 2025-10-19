// app/api/tools/netscan/network-analyzer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase';

/**
 * Network analyzer (dev-friendly placeholder).
 * Accepts ?ip=<host>&mock=true
 * Returns a high-level summary (protocols, top-talkers, sample packets)
 */

const cache = new LRUCache<string, any>({ max: 200, ttl: 1000 * 60 * 10 });

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const target = (url.searchParams.get('ip') || '').trim();
    const mock = (url.searchParams.get('mock') || '').toLowerCase() === 'true';

    if (!target) return NextResponse.json({ error: 'target is required' }, { status: 400 });

    if (mock) {
      const sample = {
        success: true,
        tool: 'network-analyzer',
        data: {
          target,
          summary: { total_packets: 1234, protocols: { tcp: 800, udp: 300, icmp: 134 }, top_ports: [80, 443, 22] },
          top_talkers: [{ addr: '192.0.2.5', bytes: 123456 }, { addr: '198.51.100.7', bytes: 98765 }],
          sample_packets: [
            { ts: Date.now() - 1000, src: '192.0.2.5', dst: target, proto: 'TCP', info: 'TCP 80 > 512 bytes' },
            { ts: Date.now() - 500, src: target, dst: '192.0.2.5', proto: 'TCP', info: 'HTTP 200 OK' }
          ]
        },
        timestamp: new Date().toISOString()
      };
      return NextResponse.json({ ...sample, cached: false, rateLimit: { remaining: Infinity, resetIn: 0 } });
    }

    const user = await getCurrentUser().catch(() => null);
    const userTier = user ? await getUserTier(user.id).catch(() => 'free') : 'free';
    const id = user?.id || getClientIp(request) || 'anon';
    const rl = await checkRateLimit(id, userTier === 'pro');
    if (!rl.allowed) return rateLimitResponse(rl.resetIn);

    // For now provide a small synthetic summary. Replace with actual packet-capture backend later.
    const out = {
      success: true,
      tool: 'network-analyzer',
      data: {
        target,
        summary: { total_packets: 0, protocols: {}, top_ports: [] },
        top_talkers: [],
        sample_packets: []
      },
      timestamp: new Date().toISOString()
    };

    cache.set(`na:${target}`, out);
    return NextResponse.json({ ...out, cached: false, rateLimit: { remaining: rl.remaining, resetIn: rl.resetIn } });
  } catch (err: any) {
    console.error('Network analyzer error', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
