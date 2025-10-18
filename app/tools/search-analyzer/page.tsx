"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { TrendingUp, Search, BarChart3, Calendar, Globe, ArrowUp, ArrowDown } from "lucide-react";

export default function SearchAnalyzerPage() {
  const [keyword, setKeyword] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResults({
        keyword: keyword,
        volume: Math.floor(Math.random() * 100000) + 10000,
        trend: Math.random() > 0.5 ? "up" : "down",
        difficulty: Math.floor(Math.random() * 100),
        cpc: (Math.random() * 5 + 0.5).toFixed(2),
        competition: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Search Trend Analyzer</h1>
            <p className="text-xl text-white/90 mb-10">
              Analyze search trends, keyword volume, and SEO metrics in real-time
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 -mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Analyze Keyword</h2>
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Enter keyword (e.g., AI tools, digital marketing)"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={!keyword || analyzing}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-slate-300 flex items-center gap-2"
                >
                  {analyzing ? (
                    "Analyzing..."
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze
                    </>
                  )}
                </button>
              </div>

              {results && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800">
                    Results for "{results.keyword}"
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Search Volume</span>
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {results.volume.toLocaleString()}/mo
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Trend</span>
                        {results.trend === "up" ? (
                          <ArrowUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          results.trend === "up"
                            ? "text-green-900"
                            : "text-red-900"
                        }`}
                      >
                        {results.trend === "up" ? "Rising" : "Declining"}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">SEO Difficulty</span>
                        <Globe className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-orange-900">
                        {results.difficulty}/100
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">CPC</span>
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-900">
                        ${results.cpc}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-100 rounded-lg">
                    <span className="text-sm text-slate-600">Competition Level: </span>
                    <span className="font-bold text-slate-800">
                      {results.competition}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Demo Version</h3>
              <p className="text-sm text-blue-800">
                This demo uses simulated data. Production version will integrate with Google Trends, SEMrush, or Ahrefs APIs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
