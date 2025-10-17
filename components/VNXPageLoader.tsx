"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function VNXPageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-[9998]">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-slate-700 font-semibold text-sm">Loading...</p>
      </div>
    </div>
  );
}
