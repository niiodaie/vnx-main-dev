"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500 text-white pt-32 md:pt-40 pb-28 text-center"
      id="hero"
    >
      {/* Background overlay for contrast */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* Hero content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 fade-in">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
          Powering the Future of Innovation
        </h1>

        <p className="text-lg md:text-xl text-white/90 mb-10 fade-in-delayed leading-relaxed">
          Unlock the power of AI-driven tools, cutting-edge platforms, and immersive digital experiences.  
          Join thousands of innovators shaping tomorrow’s digital landscape.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 fade-in-late">
          <Link
            href="/tools"
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-slate-100 transition"
          >
            Explore Tools
          </Link>
          <Link
            href="/platforms"
            className="bg-transparent border border-white/80 px-6 py-3 rounded-lg hover:bg-white/10 transition"
          >
            Visit Platforms
          </Link>
          <Link
            href="/experiences"
            className="bg-pink-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-pink-700 transition"
          >
            Discover Experiences
          </Link>
        </div>
      </div>

      {/* Decorative gradient rings */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
    </section>
  );
}
