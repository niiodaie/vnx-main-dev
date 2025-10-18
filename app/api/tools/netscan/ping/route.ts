import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // ✅ Edge-compatible, no Node APIs

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get("host");

  if (!host) {
    return NextResponse.json({ error: "Missing host parameter" }, { status: 400 });
  }

  try {
    const target = host.startsWith("http") ? host : `https://${host}`;
    const start = performance.now();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(target, { method: "HEAD", signal: controller.signal }).catch(() => null);
    clearTimeout(timeout);

    const latency = Math.round(performance.now() - start);

    if (!res) {
      return NextResponse.json({ success: false, message: "Ping failed or timed out." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      host,
      latency,
      grade:
        latency < 50 ? "A+" :
        latency < 100 ? "A" :
        latency < 200 ? "B" :
        latency < 400 ? "C" : "D",
      region: "VNX Edge",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Ping failed" }, { status: 500 });
  }
}
