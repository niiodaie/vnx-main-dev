'use client'

import { useState } from 'react'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import DiagnosticsPanel from './components/DiagnosticsPanel'
import NetscanHero from './components/NetscanHero'
import { NETSCAN_TOOLS } from './config/tools'




const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NetscanPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
  }, [])

  const handleScan = async () => {
    if (!query) return
    setLoading(true)
    try {
      const res = await fetch(`/app/tools/netscan/api/ping?host=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    const email = prompt('Enter email to receive magic link:')
    if (!email) return
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (!error) alert('Check your email for the login link.')
  }

  const isProLocked = !user

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

        {isProLocked && (
          <div className="my-4 p-4 border border-amber-400 bg-amber-50 rounded-lg text-center">
            <p className="text-sm mb-2">
              Pro diagnostics like Traceroute &amp; Port Scan require login.
            </p>
            <Button onClick={handleSignIn}>Sign in with Magic Link</Button>
          </div>
        )}

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
