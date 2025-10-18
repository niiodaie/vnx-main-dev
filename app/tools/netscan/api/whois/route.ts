import { NextResponse } from 'next/server'
export async function GET(req: Request) {
  const domain = new URL(req.url).searchParams.get('domain') ?? 'example.com'
  return NextResponse.json({
    domain,
    registrar: 'IANA',
    created: '1995-08-13',
    status: 'active',
  })
}
