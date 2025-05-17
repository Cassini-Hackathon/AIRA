import { useAppContext } from '@/context/AppContext';
import AppHeader from '@/components/AppHeader';

const WeatherPage = () => {
  const { state } = useAppContext();
  const { weatherData } = state;

  if (!weatherData) {
    return (
      <div className="px-4 py-6">
        <AppHeader title="Condizioni Ambientali" />
        <div className="flex items-center justify-center h-64">
          <p>Caricamento dati meteo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-20">
      <AppHeader title="Condizioni Ambientali" />
      
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Milano, IT</h2>
            <p className="text-sm text-gray-500">
              <span>45.4642, 9.1900</span> •
              <span>Lunedì, 10 Luglio</span>
            </p>
          </div>
          <span className="text-sm text-gray-500">Aggiornato: 10 min fa</span>
        </div>
        
        {/* Current Weather */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center">
            <span className={`material-icons text-5xl text-warning mr-4`}>{weatherData.icon}</span>
            <div>
              <p className="text-4xl font-bold">{weatherData.temperature}°C</p>
              <p className="text-lg">{weatherData.condition}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm">Min: {weatherData.minTemp}°C</p>
            <p className="text-sm">Max: {weatherData.maxTemp}°C</p>
            <p className="text-sm">Percepiti: {weatherData.feelsLike}°C</p>
          </div>
        </div>
        
        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <span className="material-icons text-info mr-2">air</span>
              <p className="font-medium">Vento</p>
            </div>
            <p>{weatherData.wind} km/h</p>
            <p className="text-sm text-gray-500">Direzione: NE</p>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <span className="material-icons text-info mr-2">water_drop</span>
              <p className="font-medium">Umidità</p>
            </div>
            <p>{weatherData.humidity}%</p>
            <p className="text-sm text-gray-500">Punto di rugiada: 16°C</p>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <span className="material-icons text-info mr-2">compress</span>
              <p className="font-medium">Pressione</p>
            </div>
            <p>{weatherData.pressure} hPa</p>
            <p className="text-sm text-gray-500">Stabile</p>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <span className="material-icons text-info mr-2">visibility</span>
              <p className="font-medium">Visibilità</p>
            </div>
            <p>{weatherData.visibility}</p>
            <p className="text-sm text-gray-500">10+ km</p>
          </div>
        </div>
        
        {/* Weather Forecast */}
        <h2 className="text-xl font-bold mb-4">Previsioni</h2>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-2">
            {weatherData.forecast.map((forecast, index) => (
              <div key={index} className="flex-shrink-0 w-24 bg-gray-100 rounded-lg p-3 text-center">
                <p className="text-sm font-medium">{forecast.day}</p>
                <span className="material-icons text-2xl text-warning my-2">{forecast.icon}</span>
                <p className="font-bold">{forecast.maxTemp}°C</p>
                <p className="text-xs text-gray-500">{forecast.minTemp}°C</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Alert Notices */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Allerte Meteo</h2>
        
        <div className="space-y-4">
          {weatherData.alerts && weatherData.alerts.map((alert, index) => (
            <div key={index} className={`bg-${alert.severity}/20 border border-${alert.severity} rounded-lg p-3`}>
              <div className="flex items-start">
                <span className={`material-icons text-${alert.severity} mr-2 mt-0.5`}>warning</span>
                <div>
                  <h3 className="font-bold">{alert.title}</h3>
                  <p className="text-sm">{alert.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Valida fino a: {alert.validUntil}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-info/20 border border-info rounded-lg p-3">
            <div className="flex items-start">
              <span className="material-icons text-info mr-2 mt-0.5">info</span>
              <div>
                <h3 className="font-bold">Qualità dell'Aria</h3>
                <p className="text-sm">Livelli moderati di inquinamento atmosferico. Si consiglia alle persone con problemi respiratori di limitare le attività all'aperto prolungate.</p>
                <p className="text-xs text-gray-500 mt-1">Indice: Moderato (AQI 85)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Environmental Risk Map */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Mappa Rischi Ambientali</h2>
        
        <div className="relative bg-gray-200 rounded-xl w-full h-60 mb-4 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1576502200272-341a4b8d5ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500" 
            alt="Mappa rischi ambientali" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs">Rischio basso</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-xs">Rischio moderato</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span className="text-xs">Rischio alto</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600">
          La mappa mostra le aree con potenziali rischi ambientali basati su condizioni meteorologiche, qualità dell'aria e altri fattori ambientali.
        </p>
      </div>
    </div>
  );
};

export default WeatherPage;
