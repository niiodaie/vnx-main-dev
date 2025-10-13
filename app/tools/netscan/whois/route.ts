import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("target") || "example.com";

  return NextResponse.json({
    domain,
    registrar: "Mock Registrar Inc.",
    creationDate: "2015-03-10",
    expirationDate: "2026-03-10",
    status: "active",
    country: "US",
  });
}

