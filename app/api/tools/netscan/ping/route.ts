import { NextResponse } from "next/server";
import ping from "ping";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get("host");

  if (!host)
    return NextResponse.json({ error: "Missing host parameter" }, { status: 400 });

  try {
    const result = await ping.promise.probe(host, {
      timeout: 5,
      min_reply: 5,
    });

    return NextResponse.json({
      host: result.host,
      avg: result.avg,
      min: result.min,
      max: result.max,
      packetLoss: result.packetLoss,
      alive: result.alive,
      time: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Ping failed" }, { status: 500 });
  }
}
