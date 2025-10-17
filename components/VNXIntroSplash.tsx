"use client";
import { useEffect, useState } from "react";

export default function VNXIntroSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("vnx-intro-seen");
    if (hasSeen) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("vnx-intro-seen", "true");
    }, 2200); // visible for ~2 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-violet-700 via-blue-700 to-cyan-500 text-white z-[9999] transition-opacity duration-500">
      <h1 className="text-5xl font-extrabold tracking-wider drop-shadow-lg animate-pulse">VNX</h1>
      <p className="text-sm mt-3 opacity-80">Powered by Visnec Global</p>
      <div className="mt-6 w-28 h-1.5 bg-white/30 rounded-full overflow-hidden">
        <div className="animate-[slide_1.5s_ease-in-out_infinite] bg-white w-1/3 h-full rounded-full" />
      </div>
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
