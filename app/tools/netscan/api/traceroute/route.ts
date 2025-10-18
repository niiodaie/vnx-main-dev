import { NextResponse } from 'next/server'
export async function GET(req: Request) {
  const host = new URL(req.url).searchParams.get('host') ?? '8.8.8.8'
  return NextResponse.json({
    host,
    hops: [
      { hop: 1, ip: '192.168.1.1', rtt: '2 ms' },
      { hop: 2, ip: '10.0.0.1', rtt: '8 ms' },
      { hop: 3, ip: '8.8.8.8', rtt: '23 ms' },
    ],
  })
}
