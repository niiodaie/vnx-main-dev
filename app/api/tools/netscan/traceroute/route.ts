import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get("host");

  if (!host)
    return NextResponse.json({ error: "Missing host parameter" }, { status: 400 });

  try {
    // Run traceroute command safely
    const { stdout } = await execPromise(`traceroute -m 10 -q 1 ${host}`);

    const lines = stdout
      .split("\n")
      .filter((line) => line.trim().length > 0 && !line.startsWith("traceroute"));

    const hops = await Promise.all(
      lines.map(async (line) => {
        const match = line.match(/\s*(\d+)\s+([\d\.]+)\s+\(([\d\.]+)\)\s+([\d\.]+)\s+ms/);
        if (!match) return null;

        const hopNum = Number(match[1]);
        const ip = match[3];
        const rtt = Number(match[4]);

        // Get geolocation for each hop (using ipapi)
        try {
          const geoRes = await fetch(`https://ipapi.co/${ip}/json`);
          const geo = await geoRes.json();
          return {
            hop: hopNum,
            ip,
            rtt,
            city: geo.city || "Unknown",
            country: geo.country_name || "Unknown",
            lat: geo.latitude,
            lon: geo.longitude,
          };
        } catch {
          return { hop: hopNum, ip, rtt, city: "Unknown", country: "Unknown" };
        }
      })
    );

    return NextResponse.json({
      host,
      hops: hops.filter(Boolean),
      total: hops.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Traceroute error:", err);
    return NextResponse.json(
      { error: err.message || "Traceroute failed" },
      { status: 500 }
    );
  }
}
