"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { 
  Building2,
  Search,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Tv,
  Wind,
  Users,
  DollarSign,
  Filter,
  Heart
} from "lucide-react";

interface Accommodation {
  id: number;
  name: string;
  type: string;
  location: string;
  country: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  amenities: string[];
  image: string;
  featured: boolean;
}

const accommodations: Accommodation[] = [
  {
    id: 1,
    name: "Serengeti Safari Lodge",
    type: "Lodge",
    location: "Serengeti National Park",
    country: "Tanzania",
    rating: 4.9,
    reviews: 342,
    pricePerNight: 250,
    amenities: ["WiFi", "Pool", "Restaurant", "Safari Tours"],
    image: "🇹🇿",
    featured: true
  },
  {
    id: 2,
    name: "Cape Town Waterfront Hotel",
    type: "Hotel",
    location: "V&A Waterfront",
    country: "South Africa",
    rating: 4.8,
    reviews: 567,
    pricePerNight: 180,
    amenities: ["WiFi", "Gym", "Ocean View", "Bar"],
    image: "🇿🇦",
    featured: true
  },
  {
    id: 3,
    name: "Marrakech Riad",
    type: "Riad",
    location: "Medina",
    country: "Morocco",
    rating: 4.7,
    reviews: 234,
    pricePerNight: 120,
    amenities: ["WiFi", "Rooftop Terrace", "Traditional Decor", "Breakfast"],
    image: "🇲🇦",
    featured: true
  },
  {
    id: 4,
    name: "Lagos Business Hotel",
    type: "Hotel",
    location: "Victoria Island",
    country: "Nigeria",
    rating: 4.6,
    reviews: 189,
    pricePerNight: 150,
    amenities: ["WiFi", "Conference Rooms", "Restaurant", "Gym"],
    image: "🇳🇬",
    featured: false
  },
  {
    id: 5,
    name: "Zanzibar Beach Resort",
    type: "Resort",
    location: "Nungwi Beach",
    country: "Tanzania",
    rating: 4.9,
    reviews: 421,
    pricePerNight: 300,
    amenities: ["WiFi", "Beach Access", "Spa", "Water Sports"],
    image: "🇹🇿",
    featured: true
  },
  {
    id: 6,
    name: "Nairobi City Apartments",
    type: "Apartment",
    location: "Westlands",
    country: "Kenya",
    rating: 4.5,
    reviews: 156,
    pricePerNight: 90,
    amenities: ["WiFi", "Kitchen", "Parking", "Security"],
    image: "🇰🇪",
    featured: false
  }
];

const accommodationTypes = ["All", "Hotel", "Lodge", "Resort", "Riad", "Apartment", "Guesthouse"];
const countries = ["All Countries", "Tanzania", "South Africa", "Morocco", "Nigeria", "Kenya", "Ghana", "Egypt"];

export default function AfricaStaysPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  const filteredAccommodations = accommodations.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         acc.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || acc.type === selectedType;
    const matchesCountry = selectedCountry === "All Countries" || acc.country === selectedCountry;
    const matchesPrice = acc.pricePerNight >= priceRange[0] && acc.pricePerNight <= priceRange[1];
    
    return matchesSearch && matchesType && matchesCountry && matchesPrice;
  });

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes("WiFi")) return <Wifi className="w-4 h-4" />;
    if (amenity.includes("Restaurant") || amenity.includes("Breakfast")) return <Coffee className="w-4 h-4" />;
    if (amenity.includes("TV")) return <Tv className="w-4 h-4" />;
    if (amenity.includes("AC") || amenity.includes("Gym")) return <Wind className="w-4 h-4" />;
    return <Users className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Building2 className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AfricaStays
            </h1>
            <p className="text-xl text-white/90 mb-10">
              Discover unique accommodations across Africa. From safari lodges to city hotels, find your perfect stay.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-12 -mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or location..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>

              {/* Filters */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter className="w-4 h-4 inline mr-1" />
                    Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {accommodationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Max Price: ${priceRange[1]}/night
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-600">
                Showing {filteredAccommodations.length} of {accommodations.length} properties
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodations Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccommodations.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center relative">
                    <span className="text-6xl">{acc.image}</span>
                    {acc.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                        FEATURED
                      </div>
                    )}
                    <button className="absolute top-4 left-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Heart className="w-5 h-5 text-slate-600 hover:text-red-500" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">
                          {acc.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4" />
                          <span>{acc.location}, {acc.country}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-slate-800">{acc.rating}</span>
                      </div>
                      <span className="text-sm text-slate-600">({acc.reviews} reviews)</span>
                    </div>

                    {/* Type Badge */}
                    <div className="mb-3">
                      <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                        {acc.type}
                      </span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {acc.amenities.slice(0, 3).map((amenity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded"
                        >
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                      {acc.amenities.length > 3 && (
                        <div className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          +{acc.amenities.length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div>
                        <div className="text-2xl font-bold text-emerald-600">
                          ${acc.pricePerNight}
                        </div>
                        <div className="text-xs text-slate-600">per night</div>
                      </div>
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAccommodations.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  No properties found
                </h3>
                <p className="text-slate-600">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                About AfricaStays
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                This is a demo version showcasing accommodation discovery features. In production, this would include:
              </p>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Real-time availability and booking</li>
                <li>• Verified reviews and ratings</li>
                <li>• Interactive maps and location details</li>
                <li>• Secure payment processing</li>
                <li>• Host communication system</li>
                <li>• Photo galleries and virtual tours</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

