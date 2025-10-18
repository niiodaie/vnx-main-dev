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

  // Mock API for demo (replace with real API later)
  async function handleLookup() {
    setError(null)
    setResult(null)
    if (!query.trim()) {
      setError('Please enter an IP address or domain.')
      return
    }

    setLoading(true)
    try {
      // Temporary: simulate real API response
      await new Promise((r) => setTimeout(r, 1000))

      const mock = {
        ip: query,
        city: 'Mountain View',
        region: 'California',
        country: 'United States',
        isp: 'Google LLC',
        timezone: 'America/Los_Angeles',
        latitude: 37.422,
        longitude: -122.084,
        org: 'AS15169 Google LLC',
      }

      setResult(mock)
    } catch (err: any) {
      setError('Failed to fetch IP details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      {/* HERO */}
      <section className="text-center py-10 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <h1 className="text-3xl font-bold mb-2">IP Address Lookup</h1>
        <p className="text-sm opacity-90">
          Get detailed geolocation, ISP, and network info for any IP or domain.
        </p>
      </section>

      {/* INPUT */}
      <section className="max-w-3xl mx-auto mt-10 px-4">
        <div className="flex gap-3 mb-6">
          <Input
            placeholder="Enter IP or domain (e.g. 8.8.8.8 or visnec.com)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleLookup} disabled={loading}>
            {loading ? 'Looking up...' : 'Lookup'}
          </Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50 text-red-600">
            <CardContent className="p-4">{error}</CardContent>
          </Card>
        )}

        {!error && result && (
          <Card className="mt-6 shadow-md">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-slate-700">
                Results for <span className="font-mono">{result.ip}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-semibold">City:</span> {result.city}</p>
                  <p><span className="font-semibold">Region:</span> {result.region}</p>
                  <p><span className="font-semibold">Country:</span> {result.country}</p>
                  <p><span className="font-semibold">Timezone:</span> {result.timezone}</p>
                </div>
                <div>
                  <p><span className="font-semibold">ISP:</span> {result.isp}</p>
                  <p><span className="font-semibold">Organization:</span> {result.org}</p>
                  <p><span className="font-semibold">Latitude:</span> {result.latitude}</p>
                  <p><span className="font-semibold">Longitude:</span> {result.longitude}</p>
                </div>
              </div>

              <div className="mt-6">
                <pre className="bg-slate-100 rounded-lg p-3 text-xs text-slate-600 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  )
}
