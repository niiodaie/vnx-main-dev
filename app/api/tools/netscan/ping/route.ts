import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ✅ ensures full fetch support on Vercel

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get("host");

  if (!host) {
    return NextResponse.json({ success: false, message: "Missing host parameter" }, { status: 400 });
  }

  try {
    const target = host.startsWith("http") ? host : `https://${host}`;
    const start = Date.now();

    // Timeout controller
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let res;
    try {
      res = await fetch(target, { method: "HEAD", signal: controller.signal });
    } catch (err) {
      console.warn("Ping fetch error:", err);
    } finally {
      clearTimeout(timeout);
    }

    const latency = Date.now() - start;

    if (!res || !res.ok) {
      return NextResponse.json({
        success: false,
        message: `Ping failed or timed out for ${host}`,
        latency,
      });
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
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Ping error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Ping failed" },
      { status: 500 }
    );
  }
}
