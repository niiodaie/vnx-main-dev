import { useState, useEffect } from "react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/98 backdrop-blur-sm" : "bg-white/95 backdrop-blur-sm"
      } border-b border-slate-200`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VX</span>
            </div>
            <span className="text-xl font-bold text-slate-800">VNX</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection("pillars")}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Tools
            </button>
            <button
              onClick={() => scrollToSection("pillars")}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Platforms
            </button>
            <button
              onClick={() => scrollToSection("pillars")}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Community
            </button>
            <button
              onClick={() => scrollToSection("pillars")}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Experience
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="hidden sm:block px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
