'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  comingSoon?: boolean;
}

export default function ToolCard({
  id,
  title,
  description,
  icon: Icon,
  gradient,
  comingSoon = false,
}: ToolCardProps) {
  const content = (
    <div
      className={`relative rounded-2xl border-2 transition-all duration-200 p-6 h-full ${
        comingSoon
          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
          : `${gradient} border-transparent hover:shadow-xl hover:scale-[1.02] cursor-pointer`
      }`}
    >
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
          PRO
        </div>
      )}

      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`p-3 rounded-lg ${
              comingSoon ? 'bg-gray-200' : 'bg-white/20'
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>

        <p className={`text-sm flex-grow ${comingSoon ? 'text-gray-600' : ''}`}>
          {description}
        </p>

        {comingSoon && (
          <div className="mt-4 text-xs text-gray-500 font-medium">
            Coming Soon in Pro Version
          </div>
        )}
      </div>
    </div>
  );

  if (comingSoon) {
    return content;
  }

  return <Link href={`/tools/netscan/${id}`}>{content}</Link>;
}

