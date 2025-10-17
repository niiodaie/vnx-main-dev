// components/ComingSoonCard.tsx
import { Sparkles } from "lucide-react";

export default function ComingSoonCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center hover:shadow-lg transition-all duration-300">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 mb-4">{description}</p>
      <div className="inline-block bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
        Coming Soon
      </div>
    </div>
  );
}
