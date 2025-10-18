'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import DiagnosticsPanel from './components/DiagnosticsPanel'
import NetscanHero from './components/NetscanHero'
import { NETSCAN_TOOLS } from './config/tools'

export default function NetscanPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleScan = async () => {
    if (!query) return
    setLoading(true)
    try {
      const res = await fetch(`/app/tools/netscan/api/ping?host=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <NetscanHero />
      <section className="container mx-auto p-6">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter IP or domain"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={handleScan} disabled={loading}>
            {loading ? 'Scanning…' : 'Start Scan'}
          </Button>
        </div>

        {result && (
          <Card className="mt-4">
            <CardContent>
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <DiagnosticsPanel />
      </section>
    </main>
  )
}
