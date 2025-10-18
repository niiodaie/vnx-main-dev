'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function NetworkTopologyPage() {
  const [target, setTarget] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runTraceroute() {
    setError(null)
    setResult(null)
    if (!target.trim()) { setError('Please enter a target (host or IP).'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/traceroute?target=${encodeURIComponent(target)}`)
      const ct = res.headers.get('content-type') || ''
      const payload = ct.includes('application/json') ? await res.json() : { raw: await res.text() }
      setResult(payload)
    } catch (err: any) {
      setError(String(err?.message ?? err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <section className="text-center py-8">
        <h1 className="text-2xl font-bold">Network Topology</h1>
        <p className="text-sm text-slate-600">Visualize hops & routes (traceroute-like output).</p>
      </section>

      <section className="container mx-auto px-6">
        <div className="flex gap-3 mb-4">
          <Input placeholder="example.com or 1.2.3.4" value={target} onChange={(e: any) => setTarget(e.target.value)} />
          <Button onClick={runTraceroute} disabled={loading}>{loading ? 'Tracing…' : 'Run Traceroute'}</Button>
        </div>

        <Card>
          <CardContent>
            {error && <p className="text-red-600">{error}</p>}
            {!result && <p className="text-slate-500">No route yet — run traceroute to see hops.</p>}
            {result && <pre className="bg-slate-50 p-3 rounded text-sm">{JSON.stringify(result, null, 2)}</pre>}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
