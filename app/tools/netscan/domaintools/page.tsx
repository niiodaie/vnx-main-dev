'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function DomainToolsPage() {
  const [domain, setDomain] = useState('')
  const [whois, setWhois] = useState<any>(null)
  const [dns, setDns] = useState<any>(null)
  const [loadingWhois, setLoadingWhois] = useState(false)
  const [loadingDns, setLoadingDns] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runWhois() {
    setError(null)
    setWhois(null)
    if (!domain.trim()) { setError('Please enter a domain.'); return }
    setLoadingWhois(true)
    try {
      const res = await fetch(`/api/whois?domain=${encodeURIComponent(domain)}`)
      const ct = res.headers.get('content-type') || ''
      const data = ct.includes('application/json') ? await res.json() : { raw: await res.text() }
      setWhois(data)
    } catch (err: any) {
      setError(String(err?.message ?? err))
    } finally {
      setLoadingWhois(false)
    }
  }

  async function runDns() {
    setError(null)
    setDns(null)
    if (!domain.trim()) { setError('Please enter a domain.'); return }
    setLoadingDns(true)
    try {
      const res = await fetch(`/api/dns?domain=${encodeURIComponent(domain)}`)
      const ct = res.headers.get('content-type') || ''
      const data = ct.includes('application/json') ? await res.json() : { raw: await res.text() }
      setDns(data)
    } catch (err: any) {
      setError(String(err?.message ?? err))
    } finally {
      setLoadingDns(false)
    }
  }

  return (
    <main>
      <section className="text-center py-8">
        <h1 className="text-2xl font-bold">Domain Tools</h1>
        <p className="text-sm text-slate-600">WHOIS and DNS lookup utilities for domains.</p>
      </section>

      <section className="container mx-auto px-6">
        <div className="flex gap-3 mb-4">
          <Input placeholder="example.com" value={domain} onChange={(e: any) => setDomain(e.target.value)} />
          <Button onClick={runWhois} disabled={loadingWhois}>{loadingWhois ? 'Running WHOIS…' : 'Run WHOIS'}</Button>
          <Button onClick={runDns} disabled={loadingDns}>{loadingDns ? 'Running DNS…' : 'Run DNS Lookup'}</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent>
              <h4 className="font-semibold mb-2">WHOIS</h4>
              {error && <p className="text-red-600">{error}</p>}
              {!whois && !error && <p className="text-slate-500">Run WHOIS to view registration details.</p>}
              {whois && <pre className="bg-slate-50 p-3 rounded text-sm">{JSON.stringify(whois, null, 2)}</pre>}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h4 className="font-semibold mb-2">DNS Records</h4>
              {!dns && <p className="text-slate-500">Run DNS lookup to view A/MX/NS records and more.</p>}
              {dns && <pre className="bg-slate-50 p-3 rounded text-sm">{JSON.stringify(dns, null, 2)}</pre>}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
