import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Navigation, Clock, Bus as BusIcon, Route, Users, Armchair, TrendingUp, AlertCircle } from 'lucide-react';
import { Bus } from '../types';
import { shivamogaCoordinates, getRoute, getIntermediateStops } from '../utils/shivamogga-routes';

interface MapTrackerProps {
  bus: Bus;
  searchParams: { from: string; to: string };
  onBack: () => void;
}

export function MapTracker({ bus, searchParams, onBack }: MapTrackerProps) {
  const [busProgress, setBusProgress] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('');
  const [estimatedArrival, setEstimatedArrival] = useState('');
  const [currentCrowd, setCurrentCrowd] = useState(0);

  // Get real coordinates from the data
  const fromCoords = shivamogaCoordinates[searchParams.from] || { lat: 13.9299, lng: 75.5681 };
  const toCoords = shivamogaCoordinates[searchParams.to] || { lat: 13.9299, lng: 75.5681 };

  // Get the actual route with intermediate stops
  const fullRoute = getRoute(searchParams.from, searchParams.to);
  const intermediateStopNames = getIntermediateStops(searchParams.from, searchParams.to);
  
  // Convert intermediate stop names to coordinates
  const intermediateStops = intermediateStopNames.map(stopName => ({
    name: stopName,
    coords: shivamogaCoordinates[stopName] || fromCoords,
  }));

  // Calculate bus position based on progress
  const getBusPosition = () => {
    const progress = busProgress / 100;
    return {
      lat: fromCoords.lat + (toCoords.lat - fromCoords.lat) * progress,
      lng: fromCoords.lng + (toCoords.lng - fromCoords.lng) * progress,
    };
  };

  const busPosition = getBusPosition();

  // Calculate estimated arrival time
  const calculateEstimatedArrival = () => {
    if (busProgress >= 100) {
      return 'Arrived';
    }
    
    const remainingPercent = 100 - busProgress;
    // Parse duration (e.g., "15m" or "10m")
    const totalMinutes = parseInt(bus.duration.replace('m', ''));
    const remainingMinutes = Math.round((remainingPercent / 100) * totalMinutes);
    
    if (remainingMinutes === 0) {
      return 'Less than 1 min';
    }
    return `${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`;
  };

  // Get crowd level
  const getCrowdLevel = () => {
    const occupancy = ((50 - bus.availableSeats) / 50) * 100;
    if (occupancy < 30) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
    if (occupancy < 60) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const crowdInfo = getCrowdLevel();

  useEffect(() => {
    // Simulate bus movement
    const interval = setInterval(() => {
      setBusProgress((prev) => {
        const next = prev + 3; // Faster increment for shorter trips
        if (next >= 100) {
          setCurrentLocation(searchParams.to);
          return 100;
        }
        
        // Update location based on progress
        const currentStop = intermediateStops.find(stop => 
          stop.progress > prev && stop.progress <= next
        );
        
        if (currentStop) {
          setCurrentLocation(`At ${currentStop.name}`);
        } else if (next < 20) {
          setCurrentLocation(`Departing from ${searchParams.from}`);
        } else if (next >= 80) {
          setCurrentLocation(`Approaching ${searchParams.to}`);
        } else {
          setCurrentLocation('En route');
        }
        
        return next;
      });
    }, 1000); // Update every 1 second for shorter trips

    return () => clearInterval(interval);
  }, [searchParams.from, searchParams.to, intermediateStops]);

  useEffect(() => {
    setEstimatedArrival(calculateEstimatedArrival());
  }, [busProgress]);

  useEffect(() => {
    // Simulate varying crowd levels
    const interval = setInterval(() => {
      setCurrentCrowd(Math.floor(Math.random() * 5) + (50 - bus.availableSeats));
    }, 3000);
    return () => clearInterval(interval);
  }, [bus.availableSeats]);

  // Format time in AM/PM
  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Buses
          </button>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl text-gray-900">Live Bus Tracking - Shivamogga City</h1>
              <p className="text-gray-600">{bus.operator}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Progress</div>
                <div className="text-2xl text-indigo-600">{busProgress}%</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">ETA</div>
                <div className="text-lg text-green-600">{estimatedArrival}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Map Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Map Header */}
              <div className="bg-indigo-600 text-white px-6 py-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <h2 className="text-lg font-semibold">Shivamogga City Map</h2>
                    <p className="text-indigo-100 text-xs">Live tracking: {searchParams.from} → {searchParams.to}</p>
                  </div>
                </div>
              </div>

              {/* Clean Map Container - Single Screen */}
              <div className="relative" style={{ height: '600px' }}>
                {/* Embedded Google Map - Full Screen */}
                <iframe
                  src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${fromCoords.lat},${fromCoords.lng}&destination=${toCoords.lat},${toCoords.lng}&mode=driving&zoom=14`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>

                {/* Animated Bus Overlay */}
                {busProgress < 100 && (
                  <div 
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear z-20 pointer-events-none"
                    style={{
                      left: `${20 + (busProgress / 100) * 60}%`,
                      top: `${50 - (busProgress / 100) * 10}%`
                    }}
                  >
                    <div className="relative animate-bounce">
                      <div className="absolute -top-4 -left-4 w-16 h-16 bg-indigo-500 rounded-full animate-pulse opacity-30"></div>
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
                        <BusIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-bold">
                        🚌 {bus.operator}
                      </div>
                    </div>
                  </div>
                )}

                {/* From Point Marker Overlay */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                  style={{
                    left: '20%',
                    top: '50%'
                  }}
                >
                  <div className="relative">
                    <div className="absolute -top-3 -left-3 w-12 h-12 bg-green-500 rounded-full animate-ping opacity-40"></div>
                    <div className="w-12 h-12 bg-green-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-semibold">
                      📍 {searchParams.from}
                    </div>
                  </div>
                </div>

                {/* To Point Marker Overlay */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                  style={{
                    left: '80%',
                    top: '40%'
                  }}
                >
                  <div className="relative">
                    <div className="absolute -top-3 -left-3 w-12 h-12 bg-red-500 rounded-full animate-ping opacity-40"></div>
                    <div className="w-12 h-12 bg-red-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
                      <MapPin className="w-7 h-7 text-white fill-white" />
                    </div>
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-semibold">
                      🎯 {searchParams.to}
                    </div>
                  </div>
                </div>

                {/* Route Progress Line Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.8 }} />
                      <stop offset={`${busProgress}%`} style={{ stopColor: '#6366F1', stopOpacity: 0.9 }} />
                      <stop offset={`${busProgress}%`} style={{ stopColor: '#9CA3AF', stopOpacity: 0.4 }} />
                      <stop offset="100%" style={{ stopColor: '#EF4444', stopOpacity: 0.6 }} />
                    </linearGradient>
                  </defs>
                  <line 
                    x1="20%" 
                    y1="50%" 
                    x2="80%" 
                    y2="40%"
                    stroke="url(#routeGradient)" 
                    strokeWidth="6" 
                    strokeDasharray="10,5"
                  />
                </svg>

                {/* Progress Indicator */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-5 py-3 rounded-xl shadow-lg border-2 border-indigo-200 z-10 pointer-events-none">
                  <div className="text-xs text-gray-600 mb-2 font-semibold">Journey Progress</div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2 w-48">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 via-indigo-600 to-purple-600 transition-all duration-1000 ease-linear"
                      style={{ width: `${busProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-xl font-bold text-indigo-600">{busProgress}%</div>
                </div>

                {/* Live Status Badge */}
                <div className="absolute bottom-4 left-4 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg border-2 border-indigo-400 z-10 pointer-events-none min-w-[280px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-sm">LIVE TRACKING</span>
                  </div>
                  <p className="text-indigo-100 text-xs font-medium">{currentLocation}</p>
                  {busProgress === 100 ? (
                    <div className="mt-2 text-green-300 font-semibold text-sm">✅ Reached Destination</div>
                  ) : (
                    <div className="mt-2 text-yellow-300 font-semibold text-sm">⏱️ ETA: {estimatedArrival}</div>
                  )}
                </div>
              </div>

              {/* Next Bus Button */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <button
                  onClick={onBack}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <BusIcon className="w-5 h-5" />
                  Next Bus
                </button>
              </div>
            </div>
          </div>

          {/* Trip Details Panel - Takes 1 column on right */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-4">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4">
                <h2 className="text-lg font-bold">Trip Details</h2>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {/* 1. Bus Details */}
                <div className="p-6 border-b border-gray-200 bg-indigo-50">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BusIcon className="w-5 h-5 text-indigo-600" />
                    Bus Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">From</span>
                        </div>
                        <span className="font-bold text-gray-900">{searchParams.from}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">To</span>
                        </div>
                        <span className="font-bold text-gray-900">{searchParams.to}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="text-xs text-gray-500 mb-1">Travel Time</div>
                        <div className="font-bold text-indigo-600 text-lg">{bus.duration}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="text-xs text-gray-500 mb-1">Fare</div>
                        <div className="font-bold text-green-600 text-lg">₹{bus.price}</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">Operator</div>
                      <div className="font-semibold text-gray-900">{bus.operator}</div>
                    </div>
                  </div>
                </div>

                {/* 2. Bus Current Location & Route */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-indigo-600" />
                    Journey Progress
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Current Bus Location */}
                    <div className="bg-indigo-600 text-white rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BusIcon className="w-5 h-5" />
                        <span className="font-semibold">Bus Current Location</span>
                      </div>
                      <p className="text-indigo-100 text-sm">{currentLocation}</p>
                      <div className="mt-3 bg-white/20 rounded-full h-2">
                        <div
                          className="bg-white h-full rounded-full transition-all duration-2000"
                          style={{ width: `${busProgress}%` }}
                        ></div>
                      </div>
                      <div className="text-right mt-1 text-xs text-indigo-100">{busProgress}% Complete</div>
                    </div>

                    {/* Your Location */}
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Your Location</span>
                      </div>
                      <p className="text-green-700 font-bold text-lg">{searchParams.from}</p>
                      <p className="text-xs text-green-600 mt-1">Pickup Point - {formatTime(bus.departureTime)}</p>
                    </div>

                    {/* Route with Intermediate Stops */}
                    {intermediateStops.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="font-semibold text-blue-900 mb-3 text-sm">Stops Along the Way</div>
                        <div className="space-y-2">
                          {intermediateStops.map((stop, index) => (
                            <div key={stop.name} className="flex items-center gap-3 bg-white rounded p-2">
                              <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold">
                                {index + 1}
                              </div>
                              <span className="text-sm text-gray-700 font-medium">{stop.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Destination */}
                    <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-800">Destination</span>
                      </div>
                      <p className="text-red-700 font-bold text-lg">{searchParams.to}</p>
                      {busProgress >= 100 ? (
                        <p className="text-xs text-green-600 mt-1 font-semibold">✅ Arrived!</p>
                      ) : (
                        <p className="text-xs text-red-600 mt-1">Drop Point - ETA: {estimatedArrival}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Seat Available Block */}
                <div className="p-6 border-b border-gray-200 bg-green-50">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Armchair className="w-5 h-5 text-green-600" />
                    Seat Availability
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">{bus.availableSeats}</div>
                      <div className="text-sm text-gray-600">Seats Available</div>
                      <div className="text-xs text-gray-500 mt-1">out of 50 total seats</div>
                    </div>

                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Occupancy</span>
                        <span className="font-bold text-orange-600">
                          {Math.round(((50 - bus.availableSeats) / 50) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-orange-500 h-full rounded-full transition-all"
                          style={{ width: `${Math.round(((50 - bus.availableSeats) / 50) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Crowd Block */}
                <div className="p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Crowd Report
                  </h3>
                  
                  <div className="space-y-3">
                    <div className={`${crowdInfo.bg} p-5 rounded-lg text-center border-2 ${crowdInfo.level === 'High' ? 'border-red-300' : crowdInfo.level === 'Medium' ? 'border-yellow-300' : 'border-green-300'}`}>
                      <div className={`text-2xl font-bold ${crowdInfo.color} mb-1`}>{crowdInfo.level}</div>
                      <div className="text-xs text-gray-600">Crowd Level</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Current Passengers</span>
                        <span className="font-bold text-gray-900 text-lg">{currentCrowd}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Empty Seats</span>
                        <span className="font-bold text-green-600 text-lg">{bus.availableSeats}</span>
                      </div>
                    </div>

                    {crowdInfo.level === 'High' && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-700">Crowded Bus Alert!</p>
                          <p className="text-xs text-red-600 mt-1">Consider waiting for the next bus for a more comfortable journey.</p>
                        </div>
                      </div>
                    )}

                    {crowdInfo.level === 'Low' && (
                      <div className="flex items-start gap-2 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                        <div className="text-green-600 text-lg">✓</div>
                        <div>
                          <p className="text-sm font-semibold text-green-700">Great Choice!</p>
                          <p className="text-xs text-green-600 mt-1">Bus has plenty of space for a comfortable journey.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}