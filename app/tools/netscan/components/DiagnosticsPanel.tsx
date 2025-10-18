 'use client'

import { useState, useEffect } from 'react'
import Loader from './Loader'
import ResultsCard from './ResultsCard'

export default function DiagnosticsPanel() {
  const [streamData, setStreamData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // keep a small mock feed for UX; real SSE can be connected later
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
    }, 900)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      {loading && <Loader />}
      <div className="space-y-3 mt-3">
        {streamData.map((item, idx) => (
          <ResultsCard key={idx} data={item} />
        ))}
      </div>
    </div>
  )
}
