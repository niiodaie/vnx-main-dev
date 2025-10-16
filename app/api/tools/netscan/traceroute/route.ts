import { NextResponse } from "next/server";
import traceroute from "traceroute";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get("host");

  if (!host)
    return NextResponse.json({ error: "Missing host parameter" }, { status: 400 });

  try {
    const hops: any[] = [];
    await new Promise<void>((resolve, reject) => {
      traceroute.trace(host, async (err: any, hopsData: any) => {
        if (err) return reject(err);

        const geoPromises = hopsData.map(async (hop: any) => {
          if (!hop.ip) return { hop: hop.hop, ip: null };
          const geoRes = await fetch(`https://ipapi.co/${hop.ip}/json`);
          const geo = await geoRes.json();

          return {
            hop: hop.hop,
            ip: hop.ip,
            rtt: hop.rtt1 || 0,
            city: geo.city || "Unknown",
            country: geo.country_name || "Unknown",
            lat: geo.latitude,
            lon: geo.longitude,
          };
        });

        const results = await Promise.all(geoPromises);
        hops.push(...results);
        resolve();
      });
    });

    return NextResponse.json({ host, hops });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Traceroute failed" }, { status: 500 });
  }
}
