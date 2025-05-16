import { WeatherData } from '@/lib/types';

interface WeatherDisplayProps {
  weatherData: WeatherData;
  showDetails?: boolean;
  className?: string;
}

const WeatherDisplay = ({ weatherData, showDetails = true, className = '' }: WeatherDisplayProps) => {
  if (!weatherData) return null;

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Condizioni Locali</h2>
        <span className="text-sm text-gray-500">Ultimo aggiornamento: 10 min fa</span>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className={`material-icons text-4xl text-warning mr-2`}>{weatherData.icon}</span>
          <div>
            <p className="text-3xl font-bold">{weatherData.temperature}°C</p>
            <p className="text-sm">{weatherData.condition}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-medium">Milano, IT</p>
          <div className="flex items-center justify-end text-sm text-gray-600">
            <span className="material-icons text-sm mr-1">location_on</span>
            <span>45.4642, 9.1900</span>
          </div>
        </div>
      </div>
      
      {showDetails && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-100 rounded-lg p-2 text-center">
              <span className="material-icons text-info">air</span>
              <p className="text-sm font-medium">Vento</p>
              <p className="text-xs">{weatherData.wind} km/h</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-2 text-center">
              <span className="material-icons text-info">water_drop</span>
              <p className="text-sm font-medium">Umidità</p>
              <p className="text-xs">{weatherData.humidity}%</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-2 text-center">
              <span className="material-icons text-warning">visibility</span>
              <p className="text-sm font-medium">Visibilità</p>
              <p className="text-xs">{weatherData.visibility}</p>
            </div>
          </div>
          
          {weatherData.alerts && weatherData.alerts.length > 0 && (
            <div className="bg-warning/20 border border-warning rounded-lg p-3 flex items-start">
              <span className="material-icons text-warning mr-2 mt-0.5">warning</span>
              <div>
                <p className="font-medium">{weatherData.alerts[0].title}</p>
                <p className="text-sm">{weatherData.alerts[0].description}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeatherDisplay;
