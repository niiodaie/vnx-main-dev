"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Wrench, Image, FileText, Code, Palette, Zap } from "lucide-react";

export default function SnapToolkitPage() {
  const tools = [
    { name: "Image Optimizer", icon: "🖼️", desc: "Compress and optimize images", color: "from-blue-500 to-cyan-500" },
    { name: "Color Picker", icon: "🎨", desc: "Extract colors from images", color: "from-purple-500 to-pink-500" },
    { name: "Text Formatter", icon: "📝", desc: "Format and transform text", color: "from-green-500 to-emerald-500" },
    { name: "Code Beautifier", icon: "💻", desc: "Format and beautify code", color: "from-orange-500 to-red-500" },
    { name: "URL Shortener", icon: "🔗", desc: "Shorten long URLs", color: "from-indigo-500 to-purple-500" },
    { name: "QR Generator", icon: "📱", desc: "Generate QR codes", color: "from-teal-500 to-cyan-500" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <section className="pt-32 pb-20 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Wrench className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Snap Toolkit</h1>
            <p className="text-xl text-white/90 mb-10">Your all-in-one toolkit for quick tasks and utilities</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Available Tools</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`h-32 bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                    <span className="text-6xl">{tool.icon}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{tool.name}</h3>
                    <p className="text-sm text-slate-600 mb-4">{tool.desc}</p>
                    <button className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors">
                      Launch Tool
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}