"use client";
export default function VNXLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 text-white z-[9999]">
      <div className="animate-pulse text-4xl font-extrabold tracking-wider">VNX</div>
      <div className="mt-4 w-20 h-1.5 bg-white/50 rounded-full overflow-hidden">
        <div className="animate-[loading_1.5s_ease-in-out_infinite] bg-white w-1/3 h-full rounded-full" />
      </div>
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(0); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
