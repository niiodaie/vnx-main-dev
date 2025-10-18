'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function PortScannerPage() {
  const [host, setHost] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [ports, setPorts] = useState('22,80,443') // example default

  async function runScan() {
    setError(null)
    setResult(null)

    if (!host.trim()) {
      setError('Please enter a host or IP to scan.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/scan?host=${encodeURIComponent(host)}&ports=${encodeURIComponent(ports)}`, {
        method: 'GET'
      })
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
        <h1 className="text-2xl font-bold">Port Scanner</h1>
        <p className="text-sm text-slate-600">Quick TCP port scan. Use responsibly.</p>
      </section>

      <section className="container mx-auto px-6">
        <div className="flex gap-3 mb-4">
          <Input placeholder="Host or IP (example.com or 1.2.3.4)" value={host} onChange={(e: any) => setHost(e.target.value)} />
          <Input placeholder="Ports (csv)" value={ports} onChange={(e: any) => setPorts(e.target.value)} />
          <Button onClick={runScan} disabled={loading}>{loading ? 'Scanning…' : 'Run Port Scan'}</Button>
        </div>

        <Card>
          <CardContent>
            {error && <p className="text-red-600">Error: {error}</p>}
            {!error && !result && <p className="text-slate-500">No scan yet — configure ports and run the scan.</p>}
            {result && <pre className="bg-slate-50 p-4 rounded text-sm">{JSON.stringify(result, null, 2)}</pre>}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
