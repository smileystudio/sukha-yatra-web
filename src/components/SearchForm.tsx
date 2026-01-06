import { useState } from 'react';
import { MapPin, Search, Navigation } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';
import { Menu } from './Menu';

interface SearchFormProps {
  onSearch: (params: { from: string; to: string }) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const { language } = useLanguage();

  // Shivamogga inter-city areas
  const shivamogaAreas = [
    'Gvt Bus Stand',
    'Circuit House',
    'Market',
    'Shivamurthy Circle',
    'Gandhi Bazzar',
    'Kamala Nursing Home',
    'Usha Nursing Home',
    'Vinoba Nagara',
    'Gopala',
    'Gopi Circle',
    'Draupadamma Circle',
    'APMC',
    'Ragigudda',
    'Navle',
    'JNNC',
    'Sheshadri Puram',
    'Bommanakatte',
    'Savalanga Road',
    'Gurupura',
    'Tank Moholla',
    'Gandhi Nagara',
    'Nehru Stadium',
    'Karnataka Sangha',
    'Church',
    'Meenakshi Bhavana',
    'Harige',
    'Kashipura',
    'Lakshmi Talkies'
  ];

  // Reverse geocoding - map coordinates to nearby area
  const findNearestArea = (lat: number, lng: number): string => {
    // Simplified: map to closest known area
    // In real implementation, this would use reverse geocoding API
    const shivamogaCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'Gvt Bus Stand': { lat: 13.9299, lng: 75.5681 },
      'Circuit House': { lat: 13.9318, lng: 75.5695 },
      'Market': { lat: 13.9287, lng: 75.5672 },
      'Gandhi Bazzar': { lat: 13.9265, lng: 75.5701 },
      'Kamala Nursing Home': { lat: 13.9395, lng: 75.5643 },
      'JNNC': { lat: 13.9378, lng: 75.5715 },
    };

    let closestArea = 'Gvt Bus Stand';
    let minDistance = Infinity;

    Object.entries(shivamogaCoordinates).forEach(([area, coords]) => {
      const distance = Math.sqrt(
        Math.pow(lat - coords.lat, 2) + Math.pow(lng - coords.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestArea = area;
      }
    });

    return closestArea;
  };

  const getUserLocation = () => {
    setGettingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestArea = findNearestArea(latitude, longitude);
          setFrom(nearestArea);
          setGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please select manually.');
          setGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setGettingLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to) {
      onSearch({ from, to });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Menu />
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl mb-4 text-indigo-900">SUKHA YATRA</h1>
          <p className="text-gray-600">{getTranslation('your_travel_companion', language)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl text-gray-900 mb-6">{getTranslation('book_your_journey', language)}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-700">{getTranslation('from', language)}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    list="from-areas"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Select or type pickup area"
                    required
                  />
                  <datalist id="from-areas">
                    {shivamogaAreas.map((area) => (
                      <option key={area} value={area} />
                    ))}
                  </datalist>
                </div>
                <button
                  type="button"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                  onClick={getUserLocation}
                  disabled={gettingLocation}
                >
                  <Navigation className="w-5 h-5" />
                  {gettingLocation ? 'Getting Location...' : 'Use Current Location'}
                </button>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">{getTranslation('to', language)}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    list="to-areas"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Select or type drop-off area"
                    required
                  />
                  <datalist id="to-areas">
                    {shivamogaAreas.map((area) => (
                      <option key={area} value={area} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              {getTranslation('search_buses', language)}
            </button>
          </form>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/80 backdrop-blur rounded-xl p-6">
            <div className="text-3xl mb-2">🚌</div>
            <div className="text-gray-600">Wide Selection</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-6">
            <div className="text-3xl mb-2">💺</div>
            <div className="text-gray-600">Choose Your Seat</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-gray-600">Instant Confirmation</div>
          </div>
        </div>
      </div>
    </div>
  );
}