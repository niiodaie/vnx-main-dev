import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ip: "8.8.8.8",
    country: "United States",
    city: "Mountain View",
    isp: "Google LLC",
  });
}

