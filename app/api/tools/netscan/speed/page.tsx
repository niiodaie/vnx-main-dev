 // app/api/tools/netscan/speed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { getCurrentUser, getUserTier } from '@/lib/auth/supabase';

/**
 * Speed route:
 * - GET /download?size_mb=5  -> streams repeatedly a small buffer until size reached (Content-Length omitted; client measures bytes/time)
 * - POST /upload            -> receives body and returns bytes received + time (Content-Length not required)
 *
 * This approach avoids writing large files to disk and works in serverless.
 */

const cache = new LRUCache<string, any>({ max: 100, ttl: 1000 * 60 * 5 });
const DEFAULT_MB = 5;
const MAX_MB = 50; // safety cap

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sizeMb = Math.min(MAX_MB, Math.max(0.1, Number(url.searchParams.get('size_mb')) || DEFAULT_MB));
    const useMocks = (url.searchParams.get('mock') || '').toLowerCase() === 'true';

    if (useMocks) {
      const mock = { success: true, tool: 'speed', data: { download_size_mb: sizeMb, url: '/api/tools/netscan/speed/download?size_mb=' + sizeMb }, timestamp: new Date().toISOString() };
      return NextResponse.json({ ...mock, cached: false, rateLimit: { remaining: Infinity, resetIn: 0 } });
    }

    // rate limit
    const user = await getCurrentUser().catch(() => null);
    const userTier = user ? await getUserTier(user.id).catch(() => 'free') : 'free';
    const id = user?.id || getClientIp(request) || 'anon';
    const rl = await checkRateLimit(id, userTier === 'pro');
    if (!rl.allowed) return rateLimitResponse(rl.resetIn);

    // This path streams bytes; the browser measures time and bytes to compute Mbps.
    // We cannot set a reliable Content-Length in many serverless deployments, so client should measure received bytes.
    const totalBytes = Math.round(sizeMb * 1024 * 1024);
    // a small chunk we repeat
    const chunk = new Uint8Array(64 * 1024); // 64KB
    for (let i = 0; i < chunk.length; i++) chunk[i] = 0x61; // ASCII 'a'

    // create a ReadableStream that pushes chunks until totalBytes reached
    const stream = new ReadableStream({
      start(controller) {
        let sent = 0;
        function push() {
          if (sent >= totalBytes) {
            controller.close();
            return;
          }
          const remaining = totalBytes - sent;
          const toSend = remaining >= chunk.byteLength ? chunk : chunk.slice(0, remaining);
          controller.enqueue(toSend);
          sent += toSend.byteLength;
          // schedule next
          setTimeout(push, 0);
        }
        push();
      },
      cancel() {
        // noop
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'application/octet-stream', 'Cache-Control': 'no-store' },
    });
  } catch (err: any) {
    console.error('Speed GET error', err);
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}

// upload measurement endpoint
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const useMocks = (url.searchParams.get('mock') || '').toLowerCase() === 'true';
    if (useMocks) {
      return NextResponse.json({ success: true, tool: 'speed', data: { upload_bytes: 1234567, elapsed_ms: 1234 }, timestamp: new Date().toISOString(), rateLimit: { remaining: Infinity, resetIn: 0 } });
    }

    const user = await getCurrentUser().catch(() => null);
    const userTier = user ? await getUserTier(user.id).catch(() => 'free') : 'free';
    const id = user?.id || getClientIp(request) || 'anon';
    const rl = await checkRateLimit(id, userTier === 'pro');
    if (!rl.allowed) return rateLimitResponse(rl.resetIn);

    const start = Date.now();
    // read the body as a stream counting bytes (works in Node fetch)
    const reader = request.body?.getReader?.();
    if (!reader) {
      // fallback: try to read full arrayBuffer
      const buf = await request.arrayBuffer().catch(() => null);
      if (!buf) return NextResponse.json({ error: 'No body provided' }, { status: 400 });
      const elapsed = Date.now() - start;
      return NextResponse.json({ success: true, tool: 'speed', data: { upload_bytes: buf.byteLength, elapsed_ms: elapsed }, timestamp: new Date().toISOString(), rateLimit: { remaining: rl.remaining, resetIn: rl.resetIn } });
    }

    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += (value?.byteLength ?? value?.length ?? 0);
    }
    const elapsed = Date.now() - start;
    return NextResponse.json({ success: true, tool: 'speed', data: { upload_bytes: total, elapsed_ms: elapsed }, timestamp: new Date().toISOString(), rateLimit: { remaining: rl.remaining, resetIn: rl.resetIn } });
  } catch (err: any) {
    console.error('Speed POST error', err);
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}
