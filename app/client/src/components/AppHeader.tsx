import { useLocation } from 'wouter';

interface AppHeaderProps {
  showProfile?: boolean;
  showWeather?: boolean;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const AppHeader = ({ 
  showProfile = false,  // Modificato: default a false
  showWeather = false,  // Modificato: default a false
  title, 
  showBackButton = false,
  onBack
}: AppHeaderProps) => {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setLocation('/');
    }
  };

  return (
    <header className="flex items-center justify-between mb-6">
      {title ? (
        <div className="flex items-center">
          {showBackButton && (
            <button onClick={handleBack} className="mr-3">
              <span className="material-icons">arrow_back</span>
            </button>
          )}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      ) : (
        <div className="flex items-center">
          <span className="text-emergency font-bold text-2xl">AIRA</span>
          <span className="text-medical font-bold text-2xl">+</span>
        </div>
      )}
      
      {/* Rimuoviamo i pulsanti di meteo e profilo dall'header principale */}
      <div className="flex items-center">
        {showWeather && (
          <button onClick={() => setLocation('/weather')} className="mr-3">
            <span className="material-icons text-dark">wb_sunny</span>
          </button>
        )}
        
        {showProfile && (
          <button onClick={() => setLocation('/profile')} className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
            <span className="material-icons text-dark text-sm">person</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
