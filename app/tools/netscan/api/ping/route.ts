import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const host = new URL(req.url).searchParams.get('host') ?? '8.8.8.8'
  const latency = `${Math.floor(Math.random() * 50)} ms`
  return NextResponse.json({ success: true, host, latency, packetLoss: '0%' })
}
