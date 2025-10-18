'use client'

import { useState, useEffect } from 'react'
import Loader from './Loader'
import ResultsCard from './ResultsCard'

export default function DiagnosticsPanel() {
  const [streamData, setStreamData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const mockSteps = [
      { step: 'ping', latency: '22 ms' },
      { step: 'whois', status: 'success' },
      { step: 'geoip', city: 'Mountain View' },
      { step: 'complete' },
    ]
    setLoading(true)
    let i = 0
    const timer = setInterval(() => {
      setStreamData((prev) => [...prev, mockSteps[i]])
      i++
      if (i === mockSteps.length) {
        clearInterval(timer)
        setLoading(false)
      }
    }, 800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mt-8">
      <h2 className="font-semibold text-xl mb-2">Diagnostics Feed</h2>
      {loading && <Loader />}
      {streamData.map((item, idx) => (
        <ResultsCard key={idx} data={item} />
      ))}
    </div>
  )
}

