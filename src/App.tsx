import { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { BusList } from './components/BusList';
import { MapTracker } from './components/MapTracker';
import { Bus } from './types';
import { LanguageProvider } from './contexts/LanguageContext';

type Step = 'search' | 'buses' | 'tracking';

export default function App() {
  const [step, setStep] = useState<Step>('search');
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
  });
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  const handleSearch = (params: { from: string; to: string }) => {
    setSearchParams(params);
    setStep('buses');
  };

  const handleSelectBus = (bus: Bus) => {
    setSelectedBus(bus);
    setStep('tracking');
  };

  const handleBackToSearch = () => {
    setStep('search');
    setSelectedBus(null);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {step === 'search' && <SearchForm onSearch={handleSearch} />}
        
        {step === 'buses' && (
          <BusList
            searchParams={searchParams}
            onSelectBus={handleSelectBus}
            onBack={() => setStep('search')}
          />
        )}
        
        {step === 'tracking' && selectedBus && (
          <MapTracker
            bus={selectedBus}
            searchParams={searchParams}
            onBack={() => setStep('buses')}
          />
        )}
      </div>
    </LanguageProvider>
  );
}