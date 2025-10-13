import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("target") || "example.com";

  return NextResponse.json({
    host: target,
    openPorts: [22, 80, 443],
    scanTime: "1.23s",
    timestamp: new Date().toISOString(),
  });
}

