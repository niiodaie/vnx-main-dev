"use client";

import { Layers3, Rocket, Map, BookOpen, Users, Store, LineChart, Compass, Lightbulb, Globe, TrendingUp } from "lucide-react";

const pillars = [
  {
    name: "Tools",
    description: "Handy utilities that solve real-world problems",
    icon: Layers3,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Platforms",
    description: "Interactive launchpads and service layers",
    icon: Rocket,
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Directories",
    description: "Discover niche resources by category",
    icon: Map,
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Resources",
    description: "Templates, guides, and downloadable kits",
    icon: BookOpen,
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "Community",
    description: "Peer collaboration and feedback forums",
    icon: Users,
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Marketplace",
    description: "Digital products, services, and SaaS tools",
    icon: Store,
    color: "from-blue-600 to-indigo-600",
  },
  {
    name: "Insights",
    description: "Trends, forecasts, and business analytics",
    icon: LineChart,
    color: "from-teal-500 to-cyan-500",
  },
  {
    name: "Experiences",
    description: "Immersive digital journeys and exploration",
    icon: Compass,
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "Trends",
    description: "What's hot in tech, culture, and innovation",
    icon: TrendingUp,
    color: "from-red-500 to-pink-600",
  },
  {
    name: "Ventures",
    description: "Startups, investments, and opportunities",
    icon: Lightbulb,
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "E-Services",
    description: "Digital services for modern global needs",
    icon: Globe,
    color: "from-sky-500 to-cyan-400",
  },
];

export default function PillarsSection() {
  return (
    <section id="pillars" className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          The VNX Ecosystem
        </h2>
        <p className="text-slate-600 mb-14 max-w-2xl mx-auto">
          Eleven interconnected pillars designed to empower innovators, creators, and global citizens.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[210px]"
              >
                <div
                  className={`w-12 h-12 mb-4 mx-auto rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                  {pillar.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
