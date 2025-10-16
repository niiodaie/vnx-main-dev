import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

/**
 * Handles GET requests for /api/tools/netscan/ping
 * Example: /api/tools/netscan/ping?host=google.com
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get("host");

  if (!host) {
    return NextResponse.json({ error: "Missing host parameter" }, { status: 400 });
  }

  try {
    // Execute ping command — lightweight and safe for serverless
    const { stdout } = await execPromise(`ping -c 4 -w 5 ${host}`);

    // Extract latency stats using regex
    const match = stdout.match(/= ([\d\.]+)\/([\d\.]+)\/([\d\.]+)\/([\d\.]+)/);
    const packetLossMatch = stdout.match(/(\d+)% packet loss/);

    const stats = match
      ? {
          min: parseFloat(match[1]),
          avg: parseFloat(match[2]),
          max: parseFloat(match[3]),
          stddev: parseFloat(match[4]),
        }
      : null;

    const packetLoss = packetLossMatch ? parseFloat(packetLossMatch[1]) : 0;

    // Create JSON output
    const result = {
      host,
      avg: stats?.avg || null,
      min: stats?.min || null,
      max: stats?.max || null,
      jitter: stats?.stddev || null,
      packetLoss,
      alive: packetLoss < 100,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Ping error:", err);
    return NextResponse.json(
      { error: err.message || "Ping failed" },
      { status: 500 }
    );
  }
}
