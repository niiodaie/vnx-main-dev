"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { 
  Utensils,
  Search,
  MapPin,
  Star,
  Globe,
  ChefHat,
  Heart,
  TrendingUp,
  Clock,
  DollarSign
} from "lucide-react";

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  priceRange: string;
  specialty: string;
  image: string;
}

interface Dish {
  id: number;
  name: string;
  origin: string;
  description: string;
  category: string;
}

const cuisineTypes = [
  { name: "Ethiopian", flag: "🇪🇹", color: "from-green-600 to-yellow-600" },
  { name: "Nigerian", flag: "🇳🇬", color: "from-green-600 to-green-700" },
  { name: "Moroccan", flag: "🇲🇦", color: "from-red-600 to-green-600" },
  { name: "South African", flag: "🇿🇦", color: "from-blue-600 to-yellow-600" },
  { name: "Ghanaian", flag: "🇬🇭", color: "from-red-600 to-yellow-600" },
  { name: "Senegalese", flag: "🇸🇳", color: "from-green-600 to-yellow-600" },
];

const featuredDishes: Dish[] = [
  {
    id: 1,
    name: "Jollof Rice",
    origin: "West Africa",
    description: "A one-pot rice dish popular throughout West Africa, particularly in Nigeria, Ghana, and Senegal.",
    category: "Main Course"
  },
  {
    id: 2,
    name: "Injera with Doro Wat",
    origin: "Ethiopia",
    description: "Sourdough flatbread served with spicy chicken stew, the national dish of Ethiopia.",
    category: "Main Course"
  },
  {
    id: 3,
    name: "Tagine",
    origin: "Morocco",
    description: "Slow-cooked savory stew, traditionally cooked in a conical clay pot.",
    category: "Main Course"
  },
  {
    id: 4,
    name: "Bobotie",
    origin: "South Africa",
    description: "Spiced minced meat baked with an egg topping, a beloved South African dish.",
    category: "Main Course"
  },
  {
    id: 5,
    name: "Waakye",
    origin: "Ghana",
    description: "Rice and beans cooked with dried sorghum leaves, giving it a distinctive reddish-brown color.",
    category: "Main Course"
  },
  {
    id: 6,
    name: "Thieboudienne",
    origin: "Senegal",
    description: "The national dish of Senegal - fish, rice and tomato sauce cooked in one pot.",
    category: "Main Course"
  }
];

const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "Addis Ethiopian Restaurant",
    cuisine: "Ethiopian",
    location: "New York, NY",
    rating: 4.8,
    priceRange: "$$",
    specialty: "Injera & Doro Wat",
    image: "🇪🇹"
  },
  {
    id: 2,
    name: "Lagos Kitchen",
    cuisine: "Nigerian",
    location: "London, UK",
    rating: 4.7,
    priceRange: "$$$",
    specialty: "Jollof Rice",
    image: "🇳🇬"
  },
  {
    id: 3,
    name: "Marrakech Nights",
    cuisine: "Moroccan",
    location: "Paris, France",
    rating: 4.9,
    priceRange: "$$$",
    specialty: "Tagine",
    image: "🇲🇦"
  }
];

export default function AfricanCuisinePage() {
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDishes = selectedCuisine
    ? featuredDishes.filter(dish => dish.origin.includes(selectedCuisine))
    : featuredDishes;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-orange-600 via-red-600 to-yellow-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Utensils className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              African Cuisine Dining
            </h1>
            <p className="text-xl text-white/90 mb-10">
              Discover the rich flavors and diverse culinary traditions of Africa. Explore restaurants, dishes, and cultural insights.
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
                Find African Restaurants & Dishes
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by cuisine, dish, or location..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <button className="px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisine Types */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
              Explore by Cuisine
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine.name}
                  onClick={() => setSelectedCuisine(
                    selectedCuisine === cuisine.name ? null : cuisine.name
                  )}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedCuisine === cuisine.name
                      ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                      : 'border-slate-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-2">{cuisine.flag}</div>
                  <div className="font-semibold text-slate-800 text-sm">
                    {cuisine.name}
                  </div>
                </button>
              ))}
            </div>
            {selectedCuisine && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setSelectedCuisine(null)}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
              {selectedCuisine ? `${selectedCuisine} Dishes` : 'Featured Dishes'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <ChefHat className="w-20 h-20 text-white/80" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-800">
                        {dish.name}
                      </h3>
                      <Heart className="w-5 h-5 text-slate-400 hover:text-red-500 cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{dish.origin}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      {dish.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                        {dish.category}
                      </span>
                      <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                        Learn More →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
              Featured Restaurants
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {mockRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-slate-200"
                >
                  <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                    <span className="text-6xl">{restaurant.image}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Globe className="w-4 h-4" />
                      <span>{restaurant.cuisine}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.location}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-slate-800">
                          {restaurant.rating}
                        </span>
                      </div>
                      <span className="text-slate-600">{restaurant.priceRange}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-sm text-slate-600 mb-3">
                        <strong>Specialty:</strong> {restaurant.specialty}
                      </p>
                      <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Insights */}
      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
              Cultural Insights
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Trending Now</h3>
                <p className="text-sm text-slate-600">
                  Jollof Rice continues to dominate as the most popular West African dish globally, with ongoing debates about the best regional variation.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Traditional Methods</h3>
                <p className="text-sm text-slate-600">
                  Many African dishes are traditionally slow-cooked, allowing flavors to develop and creating the rich, complex tastes they're known for.
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
                <Globe className="w-5 h-5" />
                About This Experience
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                This is a demo version showcasing African cuisine discovery features. In production, this would include:
              </p>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Real restaurant directory with locations and reviews</li>
                <li>• Comprehensive dish database with recipes</li>
                <li>• Cultural insights and cooking tutorials</li>
                <li>• Restaurant reservations and delivery options</li>
                <li>• User reviews and ratings</li>
                <li>• Interactive maps and directions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

