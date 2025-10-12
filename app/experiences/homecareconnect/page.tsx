"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { 
  Home,
  Search,
  Wrench,
  Droplet,
  Zap,
  PaintBucket,
  Wind,
  Leaf,
  Star,
  Clock,
  DollarSign,
  CheckCircle2,
  MapPin,
  Phone
} from "lucide-react";

interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  icon: string;
  priceRange: string;
  rating: number;
  reviews: number;
}

interface Provider {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  yearsExperience: number;
  verified: boolean;
  location: string;
}

const services: Service[] = [
  {
    id: 1,
    name: "Plumbing Services",
    category: "Plumbing",
    description: "Professional plumbing repairs, installations, and maintenance",
    icon: "💧",
    priceRange: "$50-150",
    rating: 4.8,
    reviews: 234
  },
  {
    id: 2,
    name: "Electrical Work",
    category: "Electrical",
    description: "Licensed electricians for all electrical needs",
    icon: "⚡",
    priceRange: "$75-200",
    rating: 4.9,
    reviews: 189
  },
  {
    id: 3,
    name: "House Cleaning",
    category: "Cleaning",
    description: "Deep cleaning, regular maintenance, and move-in/out cleaning",
    icon: "🧹",
    priceRange: "$80-250",
    rating: 4.7,
    reviews: 456
  },
  {
    id: 4,
    name: "HVAC Services",
    category: "HVAC",
    description: "AC repair, heating installation, and maintenance",
    icon: "❄️",
    priceRange: "$100-300",
    rating: 4.8,
    reviews: 167
  },
  {
    id: 5,
    name: "Painting Services",
    category: "Painting",
    description: "Interior and exterior painting by professionals",
    icon: "🎨",
    priceRange: "$200-800",
    rating: 4.6,
    reviews: 123
  },
  {
    id: 6,
    name: "Lawn Care",
    category: "Landscaping",
    description: "Mowing, trimming, and landscape maintenance",
    icon: "🌱",
    priceRange: "$40-120",
    rating: 4.7,
    reviews: 289
  }
];

const featuredProviders: Provider[] = [
  {
    id: 1,
    name: "John's Plumbing Pro",
    specialty: "Plumbing",
    rating: 4.9,
    reviews: 234,
    yearsExperience: 15,
    verified: true,
    location: "Downtown"
  },
  {
    id: 2,
    name: "Elite Electrical",
    specialty: "Electrical",
    rating: 4.8,
    reviews: 189,
    yearsExperience: 12,
    verified: true,
    location: "Westside"
  },
  {
    id: 3,
    name: "Sparkle Clean Co",
    specialty: "Cleaning",
    rating: 4.9,
    reviews: 456,
    yearsExperience: 8,
    verified: true,
    location: "Citywide"
  }
];

const categories = ["All Services", "Plumbing", "Electrical", "Cleaning", "HVAC", "Painting", "Landscaping"];

export default function HomeCareConnectPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Services");

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Services" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Home className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              HomeCare Connect
            </h1>
            <p className="text-xl text-white/90 mb-10">
              Connect with trusted home service professionals. From plumbing to cleaning, find verified experts for all your home needs.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 -mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                What service do you need?
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for services..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
              Browse by Category
            </h2>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
              {selectedCategory === "All Services" ? "All Services" : `${selectedCategory} Services`}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-32 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                    <span className="text-6xl">{service.icon}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-slate-800">{service.rating}</span>
                      </div>
                      <span className="text-sm text-slate-600">({service.reviews} reviews)</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-slate-700">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">{service.priceRange}</span>
                      </div>
                      <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {service.category}
                      </span>
                    </div>

                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
              Featured Service Providers
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-slate-600">{provider.specialty}</p>
                    </div>
                    {provider.verified && (
                      <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-slate-800">{provider.rating}</span>
                      <span className="text-sm text-slate-600">({provider.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{provider.yearsExperience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{provider.location}</span>
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Provider
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">1. Search</h3>
                <p className="text-sm text-slate-600">
                  Find the service you need from our verified providers
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">2. Book</h3>
                <p className="text-sm text-slate-600">
                  Schedule an appointment at your convenience
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">3. Done</h3>
                <p className="text-sm text-slate-600">
                  Get quality service from trusted professionals
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Home className="w-5 h-5" />
                About HomeCare Connect
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                This is a demo version showcasing home service features. In production, this would include:
              </p>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Real-time booking and scheduling</li>
                <li>• Verified provider profiles with background checks</li>
                <li>• Secure payment processing</li>
                <li>• Customer reviews and ratings</li>
                <li>• Service guarantees and insurance</li>
                <li>• Live chat and support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

