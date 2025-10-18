import * as React from 'react'

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 border border-slate-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  text-slate-700 placeholder:text-slate-400 ${className ?? ''}`}
    />
  )
}
