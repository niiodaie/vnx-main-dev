"use client";

import Link from "next/link";
import { TrendingUp, ExternalLink } from "lucide-react";

export default function TrendingSection() {
  const trendingItems = [
    {
      id: 1,
      title: "Global eSIM",
      category: "E-Services",
      description: "Stay connected anywhere with instant digital SIM cards",
      href: "/e-services/esim",
      badge: "🔥 Hot",
      color: "from-orange-500 to-red-500",
    },
    {
      id: 2,
      title: "VNX Notebook",
      category: "Tools",
      description: "AI-powered note-taking and knowledge management",
      href: "/tools",
      badge: "✨ New",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      title: "Flight Tracker",
      category: "Tools",
      description: "Real-time flight tracking and status updates",
      href: "/tools",
      badge: "📈 Trending",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 4,
      title: "VNX Academy",
      category: "Resources",
      description: "Learn cutting-edge skills and technologies",
      href: "/resources",
      badge: "🎓 Popular",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section
      id="trending"
      className="relative py-24 bg-gradient-to-b from-white via-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-14 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                Trending Now
              </h2>
            </div>
            <p className="text-slate-600 max-w-xl mx-auto md:mx-0">
              Most popular tools and services in the VNX ecosystem
            </p>
          </div>

          <Link
            href="/trends"
            className="hidden md:flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            View All
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-purple-300 flex flex-col justify-between min-h-[240px]"
            >
              <div className="absolute top-4 right-4">
                <span className="text-xs font-medium px-2 py-1 bg-white/90 rounded-full shadow-sm border border-slate-100">
                  {item.badge}
                </span>
              </div>

              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} mb-4 group-hover:scale-110 transition-transform`}
              />

              <div className="text-xs text-purple-600 font-semibold mb-2 uppercase tracking-wide">
                {item.category}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="/trends"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            View All Trends
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
