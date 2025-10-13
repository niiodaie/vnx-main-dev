import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("target") || "example.com";

  return NextResponse.json({
    host: target,
    hops: [
      { hop: 1, ip: "192.168.1.1", time: "1.23 ms" },
      { hop: 2, ip: "10.0.0.1", time: "5.67 ms" },
      { hop: 3, ip: "172.217.0.46", time: "14.89 ms" },
    ],
  });
}
