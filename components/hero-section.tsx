"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-cyan-600 text-white pt-32 pb-24 text-center">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <h1
          className={`text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg transition-all duration-1000 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Digital Innovation Hub
        </h1>

        <p
          className={`text-lg text-white/90 mb-8 leading-relaxed transition-all duration-1000 delay-300 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Unlock the power of AI-driven tools, cutting-edge platforms, and immersive experiences.
        </p>

        <div
          className={`flex justify-center gap-4 flex-wrap transition-all duration-1000 delay-600 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            href="/tools"
            className="bg-white text-blue-700 font-semibold px-5 py-3 rounded-lg hover:bg-slate-100 transition"
          >
            Explore Tools
          </Link>
          <Link
            href="/platforms"
            className="bg-transparent border border-white/80 px-5 py-3 rounded-lg hover:bg-white/10 transition"
          >
            Visit Platforms
          </Link>
          <Link
            href="/experiences"
            className="bg-pink-600 text-white px-5 py-3 rounded-lg hover:bg-pink-700 transition"
          >
            Discover Experiences
          </Link>
        </div>
      </div>
    </section>
  );
}
