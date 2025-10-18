export default function Loader() {
  return (
    <div className="flex items-center gap-2 text-blue-600">
      <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full"></span>
      <span>Running diagnostics…</span>
    </div>
  )
}
