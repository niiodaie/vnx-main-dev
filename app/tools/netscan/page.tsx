'use client'

import { useState } from 'react'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import DiagnosticsPanel from './components/DiagnosticsPanel'
import NetscanHero from './components/NetscanHero'
import ToolCard from './components/ToolCard'
import ResultsPanel from './components/ResultsPanel'
import { NETSCAN_TOOLS } from './config/tools'

type ToolKey = 'ping' | 'whois' | 'geoip' | 'dns' | 'traceroute' | 'scan'

export default function NetscanPage() {
  const [target, setTarget] = useState('')
  const [activeTool, setActiveTool] = useState<ToolKey | null>(null)
  const [results, setResults] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useMocks, setUseMocks] = useState(true) // dev toggle: mocks vs live apis

  // single helper to call tool APIs
  async function callTool(tool: ToolKey) {
    if (!target.trim()) {
      setError('Please enter an IP address or domain.')
      return
    }

    setError(null)
    setResults(null)
    setActiveTool(tool)
    setLoading(true)

    try {
      // map tool -> route + param name
      const routeBase = '/app/tools/netscan/api'
      const url =
        tool === 'ping'
          ? `${routeBase}/ping?host=${encodeURIComponent(target)}`
          : tool === 'whois'
          ? `${routeBase}/whois?domain=${encodeURIComponent(target)}`
          : tool === 'geoip'
          ? `${routeBase}/geoip?ip=${encodeURIComponent(target)}`
          : tool === 'dns'
          ? `${routeBase}/dns?domain=${encodeURIComponent(target)}`
          : tool === 'traceroute'
          ? `${routeBase}/traceroute?host=${encodeURIComponent(target)}`
          : `${routeBase}/scan?ip=${encodeURIComponent(target)}`

      // if useMocks is true, API handlers already return mocks; the toggle remains for future switching
      const resp = await fetch(url)
      const json = await resp.json()
      setResults(json)
    } catch (err: any) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-12">
      <NetscanHero />
      <section className="container mx-auto p-6">
        {/* Search / target input */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start mb-6">
          <div className="md:col-span-3">
            <Input
              placeholder="Enter IP or domain (example: 8.8.8.8 or example.com)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              aria-label="IP or domain"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => callTool('ping')} disabled={loading}>
              {loading && activeTool === 'ping' ? 'Running…' : 'Ping'}
            </Button>
            <Button onClick={() => callTool('whois')} disabled={loading}>
              WHOIS
            </Button>
            <Button onClick={() => callTool('geoip')} disabled={loading}>
              GeoIP
            </Button>
          </div>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {NETSCAN_TOOLS.map((t) => (
            <ToolCard
              key={t.name}
              toolKey={t.path.replace('/api/', '') as ToolKey}
              name={t.name}
              tier={t.tier}
              description={t.description}
              onRun={() => callTool(t.path.replace('/api/', '') as ToolKey)}
            />
          ))}
        </div>

        {/* Results + Diagnostics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium">Tool Output</h3>
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Use mocks</label>
                    <input
                      type="checkbox"
                      checked={useMocks}
                      onChange={() => setUseMocks((v) => !v)}
                      aria-label="Toggle mocks"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 mb-2">
                    <strong>Error: </strong>
                    {error}
                  </div>
                )}

                {!results && !error && (
                  <div className="text-sm text-slate-500">Run a tool to see results here.</div>
                )}

                {results && <ResultsPanel data={results} />}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent>
                <h4 className="font-medium mb-2">Diagnostics Feed</h4>
                <DiagnosticsPanel />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
