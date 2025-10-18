import { NextResponse } from 'next/server'
export async function GET(req: Request) {
  const ip = new URL(req.url).searchParams.get('ip') ?? '8.8.8.8'
  return NextResponse.json({
    ip,
    country: 'United States',
    city: 'Mountain View',
    lat: 37.386,
    lon: -122.084,
    isp: 'Google LLC',
  })
}
