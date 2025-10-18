import * as React from 'react'

export function Card({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-sm p-4 ${className ?? ''}`}>
      {children}
    </div>
  )
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-2">{children}</div>
}
