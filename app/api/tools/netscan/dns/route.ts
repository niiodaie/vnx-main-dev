 import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });
  }

  try {
    // use Google's DNS-over-HTTPS API
    const res = await fetch(`https://dns.google/resolve?name=${domain}&type=ANY`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("DNS API request failed");

    const data = await res.json();
    if (!data.Answer) {
      return NextResponse.json({ success: false, message: "No DNS records found." });
    }

    return NextResponse.json({
      success: true,
      domain,
      records: data.Answer.map((r: any) => ({
        name: r.name,
        type: r.type,
        data: r.data,
        ttl: r.TTL,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "DNS lookup failed" },
      { status: 500 }
    );
  }
}
