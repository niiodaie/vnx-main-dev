"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { TrendingUp, MapPin, Eye, DollarSign, Calendar } from "lucide-react";

export default function BillboardTrackerPage() {
  const billboards = [
    { id: 1, location: "Times Square, NYC", views: 500000, price: 50000, status: "Available", type: "Digital" },
    { id: 2, location: "Sunset Blvd, LA", views: 350000, price: 35000, status: "Booked", type: "Digital" },
    { id: 3, location: "Downtown Chicago", views: 200000, price: 20000, status: "Available", type: "Static" },
    { id: 4, location: "Miami Beach", views: 180000, price: 18000, status: "Available", type: "Digital" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <section className="pt-32 pb-20 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Billboard Tracker</h1>
            <p className="text-xl text-white/90 mb-10">Track, analyze, and book billboard advertising spaces worldwide</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Available Billboards</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {billboards.map((billboard) => (
                <div key={billboard.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <TrendingUp className="w-20 h-20 text-white/80" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{billboard.location}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          billboard.status === "Available" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {billboard.status}
                        </span>
                      </div>
                      <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {billboard.type}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Eye className="w-4 h-4" />
                        <span>{billboard.views.toLocaleString()} daily views</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <DollarSign className="w-4 h-4" />
                        <span>${billboard.price.toLocaleString()}/month</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>Prime location</span>
                      </div>
                    </div>

                    <button 
                      disabled={billboard.status !== "Available"}
                      className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-slate-300"
                    >
                      {billboard.status === "Available" ? "Book Now" : "Unavailable"}
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