// app/api/tools/netscan/network-analyzer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase';

/**
 * Wi-Fi / Network Analyzer endpoint (dev placeholder).
 * - Accepts: ?ip=<target> & mock=true
 * - Returns: fake scan results, top SSIDs, channels, and sample usage.
 *
 * IMPORTANT: packet capture / Wi-Fi sniffing requires hardware & OS privileges.
 * Implement real sniffing via a native agent (desktop/mobile) that uploads sanitized results.
 */

const cache = new LRUCache<string, any>({ max: 100, ttl: 1000 * 60 * 5 });

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
          wifi_scan: [
            { ssid: 'Office-WiFi', bssid: '00:11:22:33:44:55', channel: 36, rssi: -45, security: 'WPA2' },
            { ssid: 'Coffee-Shop', bssid: '66:77:88:99:AA:BB', channel: 6, rssi: -68, security: 'WPA2' },
          ],
          summary: { top_protocols: { http: 400, dns: 120, tls: 300 }, top_hosts: [{ ip: '192.168.1.2', bytes: 12345 }] },
          recommendation: 'Channel conflict on 6 and 11; consider moving to 36 or 149.'
        },
        timestamp: new Date().toISOString()
      };
      return NextResponse.json({ ...sample, cached: false, rateLimit: { remaining: Infinity, resetIn: 0 } });
    }

    // rate limit / user check
    const user = await getCurrentUser().catch(() => null);
    const userTier = user ? await getUserTier(user.id).catch(() => 'free') : 'free';
    const id = user?.id || getClientIp(request) || 'anon';
    const rl = await checkRateLimit(id, userTier === 'pro');
    if (!rl.allowed) return rateLimitResponse(rl.resetIn);

    // In production the server can accept sanitized agent-submitted scan payloads.
    // Here we return an empty structure and guidance.
    const out = {
      success: true,
      tool: 'network-analyzer',
      data: {
        target,
        wifi_scan: [],
        summary: {},
        recommendation: 'No on-server scan available. Use a native agent to perform Wi-Fi scanning and POST results to a secure endpoint.'
      },
      timestamp: new Date().toISOString()
    };

    cache.set(`na:${target}`, out);
    return NextResponse.json({ ...out, cached: false, rateLimit: { remaining: rl.remaining, resetIn: rl.resetIn } });
  } catch (err: any) {
    console.error('Network analyzer error', err);
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}
