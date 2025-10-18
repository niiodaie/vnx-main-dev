'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function IPAddressLookupPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLookup() {
    setError(null)
    setResult(null)

    if (!query.trim()) {
      setError('Please enter an IP or hostname.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/geoip?q=${encodeURIComponent(query)}`)
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
        <h1 className="text-2xl font-bold">IP Address Lookup</h1>
        <p className="text-sm text-slate-600">Get geolocation, ISP and network details for an IP or host.</p>
      </section>

      <section className="container mx-auto px-6">
        <div className="flex gap-3 mb-6">
          <Input placeholder="Enter IP or domain (e.g. 8.8.8.8 or example.com)" value={query} onChange={(e: any) => setQuery(e.target.value)} />
          <Button onClick={handleLookup} disabled={loading}>
            {loading ? 'Looking up…' : 'Run Lookup'}
          </Button>
        </div>

        <Card>
          <CardContent>
            {error && <p className="text-red-600">Error: {error}</p>}
            {!error && !result && <p className="text-slate-500">No result yet — run a lookup to see details.</p>}
            {result && (
              <pre className="whitespace-pre-wrap bg-slate-50 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
