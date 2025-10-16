"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    "Tools",
    "Platforms",
    "Directories",
    "Resources",
    "Community",
    "Marketplace",
    "Insights",
    "Experiences",
    "Trends",
    "Ventures",
    "E-Services",
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 shadow-sm backdrop-blur-md"
          : "bg-white/60 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="text-blue-600">VNX</span>
          <span className="text-slate-600 hidden sm:inline">Visnec Nexus</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-6 text-sm font-medium text-slate-700">
          {links.map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-blue-600 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* CTA & Mobile Menu */}
        <div className="flex items-center gap-3">
          <Link
            href="/join"
            className="hidden sm:inline bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Get Started
          </Link>
          <button
            className="lg:hidden p-2 text-slate-700"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-md">
          {links.map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="block px-6 py-3 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
              onClick={() => setOpen(false)}
            >
              {item}
            </Link>
          ))}
          <Link
            href="/join"
            className="block m-4 text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 rounded-lg"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
