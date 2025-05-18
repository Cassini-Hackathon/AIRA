import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  AmbulanceData,
  AppContextState,
  Location,
  WeatherData,
} from "@/lib/types";
import { mockLocation, mockWeatherData } from "@/lib/mocks";
import { apiRequest } from "@/lib/queryClient";
import CapacitorService from "@/lib/capacitor";
import { getAmbulancePath } from "@/lib/geolocationAssistance";

// Definisco il tipo per il contesto
type AppContextType = {
  state: AppContextState;
  setIsOffline: (isOffline: boolean) => void;
  setLocation: (location: Location | null) => void;
  setWeatherData: (weatherData: WeatherData | null) => void;
  refreshLocation: () => Promise<void>;
};

// Create the context with a default value
const AppContext = createContext<AppContextType>({
  state: {
    isOffline: false,
    location: null,
    weatherData: null,
    ambulance: null,
  },
  setIsOffline: () => {},
  setLocation: () => {},
  setWeatherData: () => {},
  refreshLocation: async () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppContextState>({
    isOffline: false,
    location: null,
    weatherData: null,
    ambulance: null,
  });

  // Methods to update state
  const setIsOffline = (isOffline: boolean) => {
    setState((prevState) => ({ ...prevState, isOffline }));
  };

  const setLocation = (location: Location | null) => {
    setState((prevState) => ({ ...prevState, location }));
  };

  const setWeatherData = (weatherData: WeatherData | null) => {
    setState((prevState) => ({ ...prevState, weatherData }));
  };

  const setAmbulanceData = (ambulance: AmbulanceData | null) => {
    setState((prevState) => ({ ...prevState, ambulance }));
  };

  // Funzione per aggiornare la posizione dell'utente tramite Capacitor
  const refreshLocation = async () => {
    try {
      const position = await CapacitorService.getCurrentPosition();
      setLocation(position);
    } catch (error) {
      console.error("Errore durante l'aggiornamento della posizione:", error);
    }
  };

  // Check for internet connection using Capacitor Network API
  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        // Utilizziamo Capacitor per verificare lo stato della rete
        const isConnected = await CapacitorService.checkNetworkStatus();
        setIsOffline(!isConnected);
      } catch (error) {
        console.error(
          "Errore durante il controllo dello stato della rete:",
          error
        );
        // Fallback a navigator.onLine
        setIsOffline(!navigator.onLine);
      }
    };

    // Verifica iniziale
    checkNetworkStatus();

    // Aggiungiamo un listener per i cambiamenti dello stato della rete
    const cleanup = CapacitorService.addNetworkStatusListener((isConnected) => {
      console.log("Stato rete cambiato, connesso:", isConnected);
      setIsOffline(!isConnected);
    });

    // Inizializza tutti i servizi Capacitor
    CapacitorService.init();

    return () => {
      // Pulizia del listener quando il componente viene smontato
      cleanup();
    };
  }, []);

  // Get user's location using Capacitor Geolocation API
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        // Utilizziamo Capacitor per ottenere la posizione
        const position = await CapacitorService.getCurrentPosition();
        setLocation(position);
      } catch (error) {
        console.error("Errore durante l'acquisizione della posizione:", error);
        // In caso di errore, utilizzare i dati di mock come fallback
        setLocation(mockLocation);
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchAmbPath = async () => {
      if (!state.location) return;

      const result = await getAmbulancePath(
        44.491799,
        11.356466,
        state.location.latitude,
        state.location.longitude
      );

      if (result) {
        setAmbulanceData({
          path: result.geoJson,
          bounds: result.bounds,
        });
      } else {
        setAmbulanceData({
          path: null,
          bounds: null,
        });
      }
    };

    fetchAmbPath();
  }, [state.location]);

  // Get weather data based on location
  useEffect(() => {
    const getWeatherData = async () => {
      if (!state.location) return;

      try {
        if (state.isOffline) {
          // Use cached data when offline
          setWeatherData(mockWeatherData);
          return;
        }

        // In a real app, we would fetch this from a weather API
        const response = await apiRequest(
          "POST",
          "/api/weather",
          state.location
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        // Fallback to mock data
        setWeatherData(mockWeatherData);
      }
    };

    getWeatherData();
  }, [state.location, state.isOffline]);

  return (
    <AppContext.Provider
      value={{
        state,
        setIsOffline,
        setLocation,
        setWeatherData,
        refreshLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => useContext(AppContext);
