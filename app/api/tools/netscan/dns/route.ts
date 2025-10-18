 import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ✅ Node runtime for network access

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ success: false, message: "Missing domain parameter" }, { status: 400 });
  }

  try {
    const url = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=ANY`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Google DNS API request failed: ${res.status}`);
    }

    const data = await res.json();

    if (!data.Answer) {
      return NextResponse.json({
        success: false,
        message: `No DNS records found for ${domain}`,
      });
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
  } catch (error: any) {
    console.error("DNS Lookup Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "DNS lookup failed" },
      { status: 500 }
    );
  }
}
