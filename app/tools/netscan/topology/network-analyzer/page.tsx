'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function PacketAnalyzerPage() {
  const [target, setTarget] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Lightweight packet inspection endpoint - for UI demo / limited metadata only
  async function analyze() {
    setError(null)
    setResult(null)
    if (!target.trim()) { setError('Please enter an IP or host.'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/analyzer?target=${encodeURIComponent(target)}`)
      const ct = res.headers.get('content-type') || ''
      const data = ct.includes('application/json') ? await res.json() : { raw: await res.text() }
      setResult(data)
    } catch (err: any) {
      setError(String(err?.message ?? err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <section className="text-center py-8">
        <h1 className="text-2xl font-bold">Packet Analyzer (Wireshark Light)</h1>
        <p className="text-sm text-slate-600">Lightweight packet metadata and flow inspection (no full PCAP upload).</p>
      </section>

      <section className="container mx-auto px-6">
        <div className="flex gap-3 mb-4">
          <Input placeholder="Host or IP to inspect (limited metadata)" value={target} onChange={(e: any) => setTarget(e.target.value)} />
          <Button onClick={analyze} disabled={loading}>{loading ? 'Analyzing…' : 'Analyze'}</Button>
        </div>

        <Card>
          <CardContent>
            {error && <p className="text-red-600">{error}</p>}
            {!result && <p className="text-slate-500">No analysis yet — run analyzer to view metadata.</p>}
            {result && <pre className="bg-slate-50 p-3 rounded text-sm">{JSON.stringify(result, null, 2)}</pre>}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
