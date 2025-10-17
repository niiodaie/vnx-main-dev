import SpeedTestPanel from "@/components/netscan/SpeedTestPanel";

export default function NetscanSpeedPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Speed Test (Professional Diagnostic Mode)
        </h1>
        <SpeedTestPanel />
      </div>
    </div>
  );
}
