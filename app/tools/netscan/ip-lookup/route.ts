import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("target") || "8.8.8.8";

  return NextResponse.json({
    ip: target,
    city: "Mountain View",
    region: "California",
    country: "US",
    isp: "Google LLC",
    org: "Google Public DNS",
    asn: "AS15169",
    latitude: 37.4056,
    longitude: -122.0775,
  });
}


