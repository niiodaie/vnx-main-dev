"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Link as LinkIcon, Copy, ExternalLink, BarChart3 } from "lucide-react";

export default function BoostlinkPage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleShorten = () => {
    const short = `visnec.ai/${Math.random().toString(36).substr(2, 6)}`;
    setShortUrl(short);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <section className="pt-32 pb-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <LinkIcon className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">BoostLink</h1>
            <p className="text-xl text-white/90 mb-10">Shorten, track, and optimize your links</p>
          </div>
        </div>
      </section>

      <section className="py-12 -mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Shorten Your Link</h2>
              <div className="space-y-4">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter your long URL here..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleShorten}
                  disabled={!url}
                  className="w-full px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-slate-300"
                >
                  Shorten Link
                </button>

                {shortUrl && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 mb-2">Your shortened link:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-white rounded border border-green-300 text-green-900 font-mono">
                        {shortUrl}
                      </code>
                      <button className="p-2 bg-green-600 text-white rounded hover:bg-green-700">
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-900">Track Clicks</div>
                  <p className="text-sm text-blue-700">Monitor link performance</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg text-center">
                  <LinkIcon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-900">Custom URLs</div>
                  <p className="text-sm text-purple-700">Branded short links</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg text-center">
                  <ExternalLink className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                  <div className="text-2xl font-bold text-pink-900">QR Codes</div>
                  <p className="text-sm text-pink-700">Generate QR codes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}