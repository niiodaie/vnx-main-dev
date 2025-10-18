import { NextResponse } from 'next/server'
export async function GET(req: Request) {
  const domain = new URL(req.url).searchParams.get('domain') ?? 'example.com'
  return NextResponse.json({
    A: ['93.184.216.34'],
    MX: ['mail.example.com'],
    NS: ['ns1.example.com'],
  })
}
