"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[url('/tech-bg.svg')] opacity-10" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-slate-900/90" />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-20">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-200 text-sm mb-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Powering the Future of Innovation</span>
        </div>

        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 transition-all duration-1000 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Visnec Nexus
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl mt-4 text-slate-200">
            Your Digital Ecosystem
          </span>
        </h1>

        <p
          className={`text-xl sm:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Explore cutting-edge tools, platforms, and experiences designed for global innovators,
          travelers, and digital pioneers.
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={() => scrollToSection("pillars")}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center gap-2"
          >
            Explore VNX
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollToSection("trending")}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
          >
            What's Trending
          </button>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {[
            { label: "Tools", value: "50+" },
            { label: "Platforms", value: "20+" },
            { label: "Global Users", value: "100K+" },
            { label: "Countries", value: "150+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

