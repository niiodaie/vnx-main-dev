"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { 
  Plane,
  Search,
  MapPin,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Globe
} from "lucide-react";

interface FlightData {
  flightNumber: string;
  airline: string;
  status: 'On Time' | 'Delayed' | 'Cancelled' | 'Departed' | 'Arrived';
  departure: {
    airport: string;
    code: string;
    time: string;
    terminal?: string;
    gate?: string;
  };
  arrival: {
    airport: string;
    code: string;
    time: string;
    terminal?: string;
    gate?: string;
  };
  aircraft?: string;
  duration?: string;
}

// Mock flight data for demonstration
const mockFlightData: Record<string, FlightData> = {
  'AA100': {
    flightNumber: 'AA100',
    airline: 'American Airlines',
    status: 'On Time',
    departure: {
      airport: 'John F. Kennedy International',
      code: 'JFK',
      time: '14:30',
      terminal: '8',
      gate: 'B12'
    },
    arrival: {
      airport: 'Los Angeles International',
      code: 'LAX',
      time: '17:45',
      terminal: '4',
      gate: 'A5'
    },
    aircraft: 'Boeing 777-300ER',
    duration: '6h 15m'
  },
  'UA456': {
    flightNumber: 'UA456',
    airline: 'United Airlines',
    status: 'Delayed',
    departure: {
      airport: 'Chicago O\'Hare International',
      code: 'ORD',
      time: '09:15',
      terminal: '1',
      gate: 'C18'
    },
    arrival: {
      airport: 'San Francisco International',
      code: 'SFO',
      time: '12:30',
      terminal: '3',
      gate: 'F7'
    },
    aircraft: 'Airbus A320',
    duration: '4h 15m'
  },
  'DL789': {
    flightNumber: 'DL789',
    airline: 'Delta Air Lines',
    status: 'Departed',
    departure: {
      airport: 'Hartsfield-Jackson Atlanta International',
      code: 'ATL',
      time: '11:00',
      terminal: 'S',
      gate: 'T1'
    },
    arrival: {
      airport: 'Miami International',
      code: 'MIA',
      time: '13:15',
      terminal: 'N',
      gate: 'D8'
    },
    aircraft: 'Boeing 737-900',
    duration: '2h 15m'
  }
};

export default function FlightTrackerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a flight number");
      return;
    }

    setSearching(true);
    setError(null);
    setFlightData(null);

    // Simulate API call delay
    setTimeout(() => {
      const query = searchQuery.toUpperCase().trim();
      const found = mockFlightData[query];

      if (found) {
        setFlightData(found);
      } else {
        setError(`Flight ${query} not found. Try AA100, UA456, or DL789 for demo.`);
      }
      setSearching(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Time':
      case 'Departed':
      case 'Arrived':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'Delayed':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time':
      case 'Departed':
      case 'Arrived':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Delayed':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-sky-600 to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Plane className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Flight Tracker
            </h1>
            <p className="text-xl text-white/90 mb-10">
              Track real-time flight status, delays, and arrivals. Get instant updates on your flight information.
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
                Search for Your Flight
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Enter flight number (e.g., AA100, UA456, DL789)"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    disabled={searching}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-8 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {searching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Flight Details */}
            {flightData && (
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800">
                        {flightData.flightNumber}
                      </h2>
                      <p className="text-slate-600">{flightData.airline}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 ${getStatusColor(flightData.status)}`}>
                      {getStatusIcon(flightData.status)}
                      <span className="font-semibold">{flightData.status}</span>
                    </div>
                  </div>

                  {/* Route Visualization */}
                  <div className="relative py-8">
                    <div className="flex items-center justify-between">
                      {/* Departure */}
                      <div className="flex-1 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
                          <MapPin className="w-8 h-8 text-sky-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">
                          {flightData.departure.code}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {flightData.departure.airport}
                        </p>
                        <div className="text-3xl font-bold text-sky-600">
                          {flightData.departure.time}
                        </div>
                        {flightData.departure.terminal && (
                          <p className="text-sm text-slate-500 mt-2">
                            Terminal {flightData.departure.terminal} • Gate {flightData.departure.gate}
                          </p>
                        )}
                      </div>

                      {/* Flight Path */}
                      <div className="flex-1 flex flex-col items-center px-8">
                        <div className="relative w-full">
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-300 -translate-y-1/2"></div>
                          <div className="relative flex justify-center">
                            <div className="bg-white px-4">
                              <Plane className="w-8 h-8 text-sky-600 transform rotate-90" />
                            </div>
                          </div>
                        </div>
                        {flightData.duration && (
                          <p className="text-sm text-slate-600 mt-4">
                            {flightData.duration}
                          </p>
                        )}
                      </div>

                      {/* Arrival */}
                      <div className="flex-1 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                          <MapPin className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">
                          {flightData.arrival.code}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {flightData.arrival.airport}
                        </p>
                        <div className="text-3xl font-bold text-green-600">
                          {flightData.arrival.time}
                        </div>
                        {flightData.arrival.terminal && (
                          <p className="text-sm text-slate-500 mt-2">
                            Terminal {flightData.arrival.terminal} • Gate {flightData.arrival.gate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {flightData.aircraft && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Plane className="w-4 h-4" />
                          <span>Aircraft: {flightData.aircraft}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span>Duration: {flightData.duration}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 p-6">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Flight Tracking Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Check your flight status 24 hours before departure</li>
                    <li>• Arrive at the airport at least 2 hours before domestic flights</li>
                    <li>• Download your airline&apos;s app for real-time gate updates</li>
                    <li>• Sign up for flight status notifications via SMS or email</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Demo Instructions */}
            {!flightData && !error && !searching && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-sky-600" />
                  Try These Demo Flights
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.values(mockFlightData).map((flight) => (
                    <button
                      key={flight.flightNumber}
                      onClick={() => {
                        setSearchQuery(flight.flightNumber);
                        setTimeout(() => {
                          setFlightData(flight);
                        }, 100);
                      }}
                      className="p-4 border-2 border-slate-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition-all text-left"
                    >
                      <div className="font-bold text-slate-800 mb-1">
                        {flight.flightNumber}
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        {flight.airline}
                      </div>
                      <div className="text-xs text-slate-500">
                        {flight.departure.code} → {flight.arrival.code}
                      </div>
                      <div className={`mt-2 text-xs px-2 py-1 rounded inline-block ${getStatusColor(flight.status)}`}>
                        {flight.status}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">
                    <strong>Note:</strong> This is a demo version with sample flight data. 
                    In production, this would connect to a real-time flight tracking API 
                    for live flight information worldwide.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

