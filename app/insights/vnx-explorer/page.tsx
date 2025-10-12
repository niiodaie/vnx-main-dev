"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Compass, Search, TrendingUp, Users, Zap } from "lucide-react";

export default function VNXExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const insights = [
    { title: "AI Tools Market", value: "$50B", trend: "+25%", color: "from-blue-500 to-cyan-500" },
    { title: "Active Users", value: "2.5M", trend: "+18%", color: "from-purple-500 to-pink-500" },
    { title: "New Startups", value: "1,234", trend: "+42%", color: "from-green-500 to-emerald-500" },
    { title: "Platform Growth", value: "156%", trend: "+12%", color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <section className="pt-32 pb-20 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Compass className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">VNX Explorer</h1>
            <p className="text-xl text-white/90 mb-10">Explore the VNX ecosystem with data-driven insights and analytics</p>
          </div>
        </div>
      </section>

      <section className="py-12 -mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search VNX ecosystem..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Key Insights</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {insights.map((insight, idx) => (
                <div key={idx} className={`p-6 bg-gradient-to-br ${insight.color} rounded-xl text-white`}>
                  <h3 className="text-sm font-medium mb-2 opacity-90">{insight.title}</h3>
                  <div className="text-3xl font-bold mb-2">{insight.value}</div>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>{insight.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Explore Categories</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border-2 border-teal-200 rounded-xl hover:border-teal-400 transition-colors cursor-pointer">
                <Zap className="w-12 h-12 mb-4 text-teal-600" />
                <h3 className="font-bold text-slate-800 mb-2">Tools</h3>
                <p className="text-sm text-slate-600">Discover AI-powered tools</p>
              </div>
              <div className="p-6 border-2 border-cyan-200 rounded-xl hover:border-cyan-400 transition-colors cursor-pointer">
                <Users className="w-12 h-12 mb-4 text-cyan-600" />
                <h3 className="font-bold text-slate-800 mb-2">Community</h3>
                <p className="text-sm text-slate-600">Connect with innovators</p>
              </div>
              <div className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-colors cursor-pointer">
                <TrendingUp className="w-12 h-12 mb-4 text-blue-600" />
                <h3 className="font-bold text-slate-800 mb-2">Trends</h3>
                <p className="text-sm text-slate-600">Latest market insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}