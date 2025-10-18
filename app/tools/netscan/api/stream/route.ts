import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      const steps = [
        { step: 'ping', latency: '21 ms' },
        { step: 'whois', status: 'ok' },
        { step: 'geoip', city: 'Mountain View' },
        { step: 'complete' },
      ]
      let i = 0
      const interval = setInterval(() => {
        if (i < steps.length) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(steps[i])}\n\n`))
          i++
        } else {
          clearInterval(interval)
          controller.close()
        }
      }, 900)
    },
  })
  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
