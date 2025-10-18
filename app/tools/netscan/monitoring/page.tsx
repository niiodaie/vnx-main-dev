'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function NetworkMonitoringPage() {
  const [target, setTarget] = useState('')
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<number | null>(null)

  async function singlePing() {
    setError(null)
    if (!target.trim()) { setError('Please enter a host or IP.'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/ping?host=${encodeURIComponent(target)}`)
      const ct = res.headers.get('content-type') || ''
      const payload = ct.includes('application/json') ? await res.json() : { raw: await res.text() }
      setLogs((s) => [{ time: new Date().toISOString(), result: payload }, ...s])
    } catch (err: any) {
      setError(String(err?.message ?? err))
    } finally {
      setLoading(false)
    }
  }

  function startAuto() {
    if (!target.trim()) { setError('Please enter a host or IP.'); return }
    setError(null)
    // run immediately then every 10s
    singlePing()
    intervalRef.current = window.setInterval(singlePing, 10000)
  }

  function stopAuto() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  return (
    <main>
      <section className="text-center py-8">
        <h1 className="text-2xl font-bold">Network Monitoring</h1>
        <p className="text-sm text-slate-600">Quick uptime & latency checks (mock or lightweight probes).</p>
      </section>

      <section className="container mx-auto px-6">
        <div className="flex gap-3 mb-4">
          <Input placeholder="Host or IP" value={target} onChange={(e: any) => setTarget(e.target.value)} />
          <Button onClick={singlePing} disabled={loading}>{loading ? 'Pinging…' : 'Ping Now'}</Button>
          <Button onClick={startAuto}>Start (auto)</Button>
          <Button onClick={stopAuto}>Stop</Button>
        </div>

        <Card>
          <CardContent>
            <h4 className="font-semibold mb-2">Recent checks</h4>
            {error && <p className="text-red-600">{error}</p>}
            {logs.length === 0 && <p className="text-slate-500">No checks yet. Run a ping to populate results.</p>}
            {logs.map((l, idx) => (
              <div key={idx} className="mb-3">
                <div className="text-xs text-slate-400">{l.time}</div>
                <pre className="bg-slate-50 p-3 rounded text-sm">{JSON.stringify(l.result, null, 2)}</pre>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
