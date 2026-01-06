import { useState, useEffect } from 'react';
import { Bus, MapPin, Navigation, Clock, Building } from 'lucide-react';

interface Booking {
  from: string;
  to: string;
  busOperator: string;
  departureTime: string;
  arrivalTime: string;
  bookingId: string;
}

interface BusTrackerProps {
  booking: Booking | null;
}

export function BusTracker({ booking }: BusTrackerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [busProgress, setBusProgress] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('Starting Point');
  const [estimatedArrival, setEstimatedArrival] = useState('');

  // Function to get bus stand/terminal name based on city
  const getBusStand = (city: string, isArrival: boolean = false) => {
    const busStands: { [key: string]: string } = {
      'Bengaluru': isArrival ? 'Kempegowda Bus Station (Majestic)' : 'Platform 12, Kempegowda Bus Station',
      'Mysuru': isArrival ? 'Mysuru City Bus Stand' : 'Platform 5, City Bus Stand',
      'Mangaluru': isArrival ? 'KSRTC Bus Stand, Bejai' : 'Platform 8, KSRTC Bejai',
      'Hubli': isArrival ? 'Hubli Central Bus Station' : 'Platform 3, Central Bus Station',
      'Belgaum': isArrival ? 'Belgaum CBS' : 'Platform 6, CBS',
      'Udupi': isArrival ? 'Udupi Bus Stand' : 'Platform 2, Bus Stand',
      'Coorg': isArrival ? 'Madikeri Bus Stand' : 'Platform 4, Madikeri',
    };
    return busStands[city] || (isArrival ? `${city} Bus Terminal` : `Platform 1, ${city} Terminal`);
  };

  // Calculate estimated arrival time based on progress
  const calculateEstimatedArrival = () => {
    if (busProgress >= 100) {
      return 'Arrived';
    }
    
    const remainingPercent = 100 - busProgress;
    const remainingMinutes = Math.round((remainingPercent / 100) * 210); // Assuming 3.5 hours total
    
    if (remainingMinutes < 60) {
      return `${remainingMinutes} mins`;
    } else {
      const hours = Math.floor(remainingMinutes / 60);
      const mins = remainingMinutes % 60;
      return `${hours}h ${mins}m`;
    }
  };

  useEffect(() => {
    if (booking && isOpen) {
      // Simulate bus movement
      const interval = setInterval(() => {
        setBusProgress((prev) => {
          const next = prev + 2;
          if (next >= 100) {
            setCurrentLocation(booking.to);
            return 100;
          }
          
          // Update location based on progress
          if (next < 25) setCurrentLocation(`Near ${booking.from}`);
          else if (next < 50) setCurrentLocation('Halfway');
          else if (next < 75) setCurrentLocation(`Approaching ${booking.to}`);
          else setCurrentLocation(`Near ${booking.to}`);
          
          return next;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [booking, isOpen]);

  useEffect(() => {
    setEstimatedArrival(calculateEstimatedArrival());
  }, [busProgress]);

  if (!booking) return null;

  return (
    <>
      {/* Tracking Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-40 animate-pulse"
        aria-label="Track Bus"
      >
        <div className="relative">
          <Navigation className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
      </button>

      {/* Tracking Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal */}
          <div className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl">Live Bus Tracking</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <p className="text-indigo-100 text-sm">Booking ID: {booking.bookingId}</p>
            </div>

            <div className="p-6">
              {/* Route Information */}
              <div className="mb-6">
                <div className="mb-4">
                  <div className="flex items-start gap-3 mb-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                    <div className="flex-1">
                      <div className="text-gray-900 mb-1">{booking.from}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Building className="w-4 h-4" />
                        <span>{getBusStand(booking.from)}</span>
                      </div>
                      <p className="text-sm text-indigo-600">Departed: {booking.departureTime}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-4 ml-5">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-indigo-600 transition-all duration-1000 ease-linear"
                      style={{ width: `${busProgress}%` }}
                    ></div>
                  </div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
                    style={{ left: `calc(${busProgress}% - 12px)` }}
                  >
                    <Bus className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>

                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                    <div className="flex-1">
                      <div className="text-gray-900 mb-1">{booking.to}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Building className="w-4 h-4" />
                        <span>{getBusStand(booking.to, true)}</span>
                      </div>
                      <p className="text-sm text-purple-600">
                        {busProgress >= 100 ? `Arrived: ${booking.arrivalTime}` : `Expected: ${booking.arrivalTime}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-900">Current Location</span>
                </div>
                <p className="text-indigo-600 ml-7">{currentLocation}</p>
              </div>

              {/* Bus Details */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Bus className="w-5 h-5 text-gray-400" />
                  <span>{booking.busOperator}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>Progress: {busProgress}%</span>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm text-center">
                  {busProgress === 100
                    ? '✅ Bus has reached destination'
                    : `🚌 Bus is on the way, ETA: ${estimatedArrival}`}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}