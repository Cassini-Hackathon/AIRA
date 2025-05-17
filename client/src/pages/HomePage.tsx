import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAppContext } from '@/context/AppContext';
import AppHeader from '@/components/AppHeader';
import WeatherDisplay from '@/components/WeatherDisplay';
import GuideCard from '@/components/GuideCard';
import { Guide } from '@/lib/types';
import { mockGuides } from '@/lib/mocks';

const HomePage = () => {
  const [, setLocation] = useLocation();
  const { state } = useAppContext();
  const { weatherData, location, isOffline } = state;

  // In offline mode, use cached guides
  const { data: guides, isLoading } = useQuery<Guide[]>({
    queryKey: ['/api/guides'],
    enabled: !isOffline,
    initialData: isOffline ? mockGuides : undefined
  });

  const handleEmergencyRequest = () => {
    setLocation('/emergency');
  };

  const handleDroneKitRequest = () => {
    setLocation('/drone-kit');
  };

  const handleViewAllGuides = () => {
    setLocation('/guides');
  };

  const handleGuideClick = (guideId: number) => {
    setLocation(`/guides/${guideId}`);
  };

  return (
    <div className="px-4 py-6">
      <AppHeader />

      {/* Emergency Action Card */}
      <div className="bg-white rounded-2xl shadow-lg p-0 mb-6">
        <h2 className="text-xl font-bold mb-3">Emergenza</h2>
        <button 
          onClick={handleEmergencyRequest}
          className="w-full bg-emergency text-white font-bold py-5 px-6 rounded-xl mb-6 text-xl flex items-center justify-center shadow-lg hover:bg-red-600 active:bg-red-700 transition-colors"
        >
          <span className="material-icons mr-2 text-2xl">emergency</span>
          Richiedi Soccorso Immediato
        </button>
        {/* <button 
          onClick={handleDroneKitRequest}
          className="w-full bg-medical text-white font-medium py-3 px-6 rounded-lg text-base flex items-center justify-center hover:bg-blue-600 active:bg-blue-700 transition-colors"
        >
          <span className="material-icons mr-2">medication</span>
          Richiedi Kit Medico via Drone
        </button> */}
      </div>

      {/* Quick-Access Guides */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Guide Primo Soccorso</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); handleViewAllGuides(); }} className="text-medical font-medium">
            Vedi Tutte
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-2">
            {isLoading ? (
              <div className="flex-shrink-0 w-44 h-48 bg-white rounded-xl shadow-md animate-pulse"></div>
            ) : (
              guides?.slice(0, 3).map((guide) => (
                <GuideCard 
                  key={guide.id} 
                  guide={guide} 
                  onClick={() => handleGuideClick(guide.id)} 
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Weather & Environmental Section */}
      {weatherData && location && (
        <WeatherDisplay weatherData={weatherData} location={location} className="mb-6" />
      )}
    </div>
  );
};

export default HomePage;
