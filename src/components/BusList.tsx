import { ArrowLeft, Star, Wifi, Plug, Wind, Coffee, MapPin } from 'lucide-react';
import { Bus } from '../types';

interface BusListProps {
  searchParams: { from: string; to: string };
  onSelectBus: (bus: Bus) => void;
  onBack: () => void;
}

export function BusList({ searchParams, onSelectBus, onBack }: BusListProps) {
  // Function to format time in AM/PM
  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Mock bus data - 5 buses with Karnataka bus names at different timings
  const buses: Bus[] = [
    {
      id: '1',
      operator: 'Shashi Kumar',
      type: 'City Bus',
      departureTime: '06:00',
      arrivalTime: '06:15',
      duration: '15m',
      price: 15,
      availableSeats: 15,
      rating: 4.5,
      amenities: ['wifi', 'charging', 'ac'],
    },
    {
      id: '2',
      operator: 'Manjunatha',
      type: 'City Bus',
      departureTime: '10:30',
      arrivalTime: '10:40',
      duration: '10m',
      price: 20,
      availableSeats: 20,
      rating: 4.6,
      amenities: ['wifi', 'charging', 'ac'],
    },
    {
      id: '3',
      operator: 'Veerabhadreshwara',
      type: 'City Bus',
      departureTime: '15:00',
      arrivalTime: '15:10',
      duration: '10m',
      price: 10,
      availableSeats: 12,
      rating: 4.3,
      amenities: ['charging', 'ac'],
    },
    {
      id: '4',
      operator: 'Ganesh Kripa',
      type: 'City Bus',
      departureTime: '20:00',
      arrivalTime: '20:05',
      duration: '5m',
      price: 10,
      availableSeats: 18,
      rating: 4.7,
      amenities: ['wifi', 'charging', 'ac'],
    },
    {
      id: '5',
      operator: 'SBM',
      type: 'City Bus',
      departureTime: '23:30',
      arrivalTime: '23:45',
      duration: '15m',
      price: 15,
      availableSeats: 10,
      rating: 4.4,
      amenities: ['charging', 'ac'],
    },
    {
      id: '6',
      operator: 'Anjali',
      type: 'City Bus',
      departureTime: '08:00',
      arrivalTime: '08:10',
      duration: '10m',
      price: 15,
      availableSeats: 22,
      rating: 4.5,
      amenities: ['wifi', 'charging', 'ac'],
    },
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'charging':
        return <Plug className="w-4 h-4" />;
      case 'ac':
        return <Wind className="w-4 h-4" />;
      case 'snacks':
        return <Coffee className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Search
        </button>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="text-gray-600">From:</span> <span>{searchParams.from}</span>
            </div>
            <div className="text-gray-400">→</div>
            <div>
              <span className="text-gray-600">To:</span> <span>{searchParams.to}</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl mb-6 text-gray-800">Available Buses ({buses.length})</h2>

        <div className="space-y-4">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl text-gray-900 mb-1">{bus.operator}</h3>
                      <p className="text-gray-600">{bus.type}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{bus.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Departure</p>
                      <p className="text-lg text-gray-900">{formatTime(bus.departureTime)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-lg text-gray-900">{bus.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Arrival</p>
                      <p className="text-lg text-gray-900">{formatTime(bus.arrivalTime)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {bus.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                      >
                        {getAmenityIcon(amenity)}
                        <span className="text-sm capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:text-right lg:border-l lg:pl-6 border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div className="text-3xl text-indigo-600 mb-1">₹{bus.price}</div>
                  <div className="text-gray-500 mb-3">{bus.availableSeats} seats left</div>
                  <button
                    onClick={() => onSelectBus(bus)}
                    className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    Track
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}