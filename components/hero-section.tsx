"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[75vh] flex flex-col justify-center items-center text-center overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500 text-white"
      id="hero"
    >
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl px-6 fade-in">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
          Powering the Future of Innovation
        </h1>

        <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed fade-in-delayed">
          Unlock the power of AI-driven tools, cutting-edge platforms, and immersive experiences.  
          Join thousands of innovators shaping tomorrow’s digital landscape.
        </p>

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

      {/* Gradient Decorations */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-indigo-500/30 rounded-full blur-3xl"></div>
    </section>
  );
}
