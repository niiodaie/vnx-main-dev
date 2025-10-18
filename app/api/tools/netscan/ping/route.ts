import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const host = searchParams.get('host') || 'google.com';

    const start = performance.now();

    // Simulate latency via fetch
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`https://${host}`, {
      method: 'HEAD',
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeout);

    const end = performance.now();
    const latency = Math.round(end - start);

    if (!response) {
      return NextResponse.json({ success: false, message: 'Ping failed or timed out.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      host,
      latency,
      status: response.status,
      timestamp: new Date().toISOString(),
      connectionGrade:
        latency < 50 ? 'A+' : latency < 100 ? 'A' : latency < 200 ? 'B' : 'C',
      region: 'US-EAST', // optional - you can detect region later via geo lookup
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Ping error' },
      { status: 500 }
    );
  }
}
