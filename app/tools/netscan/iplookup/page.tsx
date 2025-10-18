'use client'

import React, { useState } from 'react'

type GeoIpResult = {
  success: boolean
  tool: string
  data: {
    ip: string
    location?: {
      city?: string
      region?: string
      country?: string
      country_code?: string
      continent?: string
      postal?: string
      coordinates?: { latitude?: number; longitude?: number }
    }
    timezone?: { name?: string; utc_offset?: string }
    network?: { isp?: string; asn?: string; network?: string }
    currency?: string
    languages?: string
  }
  timestamp?: string
  cached?: boolean
  rateLimit?: { remaining?: number; resetIn?: number }
}

export default function IPLookupPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GeoIpResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [useMocks, setUseMocks] = useState<boolean>(false)

  function validateIpOrHost(input: string) {
    const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/
    const hostname = /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/
    // Accept ip or domain (simple)
    return ipv4.test(input.trim()) || hostname.test(input.trim())
  }

  async function runLookup() {
    setError(null)
    setResult(null)

    const q = query.trim()
    if (!q) {
      setError('Please enter an IP address or domain.')
      return
    }
    if (!validateIpOrHost(q)) {
      setError('Invalid IP or domain format.')
      return
    }

    setLoading(true)
    try {
      if (useMocks) {
        // Demo mock payload (fast)
        const mock: GeoIpResult = {
          success: true,
          tool: 'geoip',
          data: {
            ip: q,
            location: {
              city: 'Mountain View',
              region: 'California',
              country: 'United States',
              country_code: 'US',
              continent: 'NA',
              postal: '94043',
              coordinates: { latitude: 37.422, longitude: -122.084 },
            },
            timezone: { name: 'America/Los_Angeles', utc_offset: '-0700' },
            network: { isp: 'Google LLC', asn: 'AS15169', network: '8.8.8.0/24' },
            currency: 'USD',
            languages: 'en-US',
          },
          timestamp: new Date().toISOString(),
          cached: false,
          rateLimit: { remaining: 100, resetIn: 60 },
        }
        setResult(mock)
        return
      }

      const url = `/api/tools/netscan/geoip?ip=${encodeURIComponent(q)}`
      const res = await fetch(url, { method: 'GET', cache: 'no-store' })

      if (res.status === 403) {
        // pro gating
        const body = await res.json().catch(() => ({}))
        setError(
          body?.message ||
            'This tool requires a Pro subscription. Visit the pricing page to upgrade.'
        )
        setLoading(false)
        return
      }

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const message = body?.error || `Lookup failed with status ${res.status}`
        setError(message)
        setLoading(false)
        return
      }

      const data = (await res.json()) as GeoIpResult
      setResult(data)
    } catch (err: any) {
      setError(err?.message || 'Unexpected error while running lookup')
    } finally {
      setLoading(false)
    }
  }

  const prettyCoordinate = (lat?: number, lon?: number) =>
    lat !== undefined && lon !== undefined ? `${lat.toFixed(4)}, ${lon.toFixed(4)}` : '—'

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-slate-800 mb-2">IP Address Lookup</h1>
      <p className="text-slate-500 mb-6">
        Get geolocation, ISP information, timezone, ASN and basic network data for an IP or domain.
      </p>

      <div className="flex gap-3 mb-6">
        <input
          aria-label="Enter IP or domain"
          className="flex-1 rounded-md border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="8.8.8.8 or example.com"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runLookup()}
        />
        <button
          className="bg-indigo-600 text-white rounded-md px-4 py-3 shadow hover:bg-indigo-700 disabled:opacity-60"
          onClick={runLookup}
          disabled={loading}
        >
          {loading ? 'Looking up…' : 'Run Lookup'}
        </button>
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={useMocks}
            onChange={(e) => setUseMocks(e.target.checked)}
            className="rounded border"
          />
          Use mocks
        </label>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!result && !error && (
        <div className="mb-6 text-sm text-slate-500">Enter an IP/domain and press Run Lookup.</div>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Summary */}
          <div className="col-span-2 space-y-4">
            <div className="rounded-md border p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-medium text-slate-800">Result summary</h2>
                  <p className="text-sm text-slate-500">Quick glance of the lookup</p>
                </div>
                <div className="text-sm text-slate-400">{result.cached ? 'cached' : 'live'}</div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded border p-3 bg-slate-50">
                  <div className="text-xs text-slate-500">IP / Host</div>
                  <div className="text-sm font-medium text-slate-800">{result.data.ip}</div>
                </div>

                <div className="rounded border p-3 bg-slate-50">
                  <div className="text-xs text-slate-500">ISP</div>
                  <div className="text-sm font-medium text-slate-800">{result.data.network?.isp || '—'}</div>
                </div>

                <div className="rounded border p-3 bg-slate-50">
                  <div className="text-xs text-slate-500">ASN</div>
                  <div className="text-sm font-medium text-slate-800">{result.data.network?.asn || '—'}</div>
                </div>

                <div className="rounded border p-3 bg-slate-50">
                  <div className="text-xs text-slate-500">Country</div>
                  <div className="text-sm font-medium text-slate-800">{result.data.location?.country || '—'}</div>
                </div>

                <div className="rounded border p-3 bg-slate-50">
                  <div className="text-xs text-slate-500">Coordinates</div>
                  <div className="text-sm font-medium text-slate-800">
                    {prettyCoordinate(result.data.location?.coordinates?.latitude as any, result.data.location?.coordinates?.longitude as any)}
                  </div>
                </div>

                <div className="rounded border p-3 bg-slate-50">
                  <div className="text-xs text-slate-500">Timezone</div>
                  <div className="text-sm font-medium text-slate-800">{result.data.timezone?.name || '—'}</div>
                </div>
              </div>
            </div>

            {/* Full JSON viewer */}
            <div className="rounded-md border p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-700">Full response</h3>
                <div className="text-xs text-slate-400">timestamp: {result.timestamp ?? '—'}</div>
              </div>

              <pre className="mt-3 overflow-auto rounded bg-slate-50 p-3 text-xs text-slate-700">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>

          {/* Right column: metadata + quick actions */}
          <aside className="space-y-4">
            <div className="rounded-md border p-4 bg-white shadow-sm">
              <h4 className="text-sm font-medium text-slate-700">Tool metadata</h4>
              <dl className="mt-3 text-sm text-slate-600 space-y-2">
                <div>
                  <dt className="text-xs text-slate-500">Cached</dt>
                  <dd>{result.cached ? 'Yes' : 'No'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Rate limit remaining</dt>
                  <dd>{result.rateLimit?.remaining ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Reset in (s)</dt>
                  <dd>{result.rateLimit?.resetIn ?? '—'}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-md border p-4 bg-white shadow-sm">
              <h4 className="text-sm font-medium text-slate-700">Quick actions</h4>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  className="w-full rounded bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
                  onClick={() => navigator.clipboard?.writeText(JSON.stringify(result.data))}
                >
                  Copy JSON
                </button>
                <a
                  className="w-full inline-block text-center rounded bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700"
                  href={`https://www.google.com/search?q=${encodeURIComponent(result.data.ip || '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Search IP on Google
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
