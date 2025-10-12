"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Activity, CheckCircle2, XCircle, Clock, Server } from "lucide-react";

export default function StatusReportPage() {
  const services = [
    { name: "API Server", status: "operational", uptime: "99.9%", response: "45ms" },
    { name: "Database", status: "operational", uptime: "99.8%", response: "12ms" },
    { name: "CDN", status: "operational", uptime: "100%", response: "8ms" },
    { name: "Authentication", status: "degraded", uptime: "98.5%", response: "120ms" },
    { name: "Storage", status: "operational", uptime: "99.7%", response: "25ms" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <section className="pt-32 pb-20 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Activity className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Status Report</h1>
            <p className="text-xl text-white/90 mb-10">Real-time system status and performance monitoring</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">All Systems Operational</h2>
                  <p className="text-sm text-slate-600">Last updated: Just now</p>
                </div>
              </div>

              <div className="space-y-4">
                {services.map((service, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {service.status === "operational" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        )}
                        <span className="font-semibold text-slate-800">{service.name}</span>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        service.status === "operational" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {service.status}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-slate-600">
                      <span>Uptime: {service.uptime}</span>
                      <span>Response: {service.response}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}