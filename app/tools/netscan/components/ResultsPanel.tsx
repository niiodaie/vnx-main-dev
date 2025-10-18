export default function ResultsPanel({ data }: { data: any }) {
  // simple human-friendly key highlights
  const summary = () => {
    if (!data) return null
    if (data.latency) return `Latency: ${data.latency}`
    if (data.city || data.country) return `Location: ${data.city ?? ''} ${data.country ?? ''}`
    if (data.A && Array.isArray(data.A)) return `A records: ${data.A.join(', ')}`
    return null
  }

  return (
    <div className="space-y-3">
      {summary() && (
        <div className="text-sm text-slate-700 bg-slate-50 p-2 rounded-md">{summary()}</div>
      )}

      <pre className="text-xs bg-white border rounded-md p-3 overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
