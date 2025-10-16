import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { BarChart, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Insights | VNX",
  description: "Trends, forecasts, and business analytics",
};

const insights = [
  {
    name: "VNX Explorer",
    href: "/insights/vnx-explorer",
    description: "Explore the VNX ecosystem with data and analytics",
    gradient: "from-blue-600 to-purple-600",
    comingSoon: false,
  },
];

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-teal-600 to-cyan-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BarChart className="w-16 h-16 mx-auto mb-6 text-white" />
          <h1 className="text-5xl font-bold text-white mb-6">VNX Insights</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Trends, forecasts, and business analytics
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {insights.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={"group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 " + (item.comingSoon ? "opacity-75" : "")}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} mb-4 group-hover:scale-110 transition-transform`} />
                <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600">
                  {item.name}
                  {item.comingSoon && (
                    <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded">
                      COMING SOON
                    </span>
                  )}
                </h2>
                <p className="text-slate-600 mb-4">{item.description}</p>
                <div className="flex items-center text-purple-600 font-semibold">
                  {item.comingSoon ? "Preview" : "Learn More"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
