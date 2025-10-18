import { NextResponse } from 'next/server'
export async function GET(req: Request) {
  const ip = new URL(req.url).searchParams.get('ip') ?? '8.8.8.8'
  return NextResponse.json({
    ip,
    results: [
      { port: 22, status: 'closed' },
      { port: 80, status: 'open' },
      { port: 443, status: 'open' },
    ],
  })
}
