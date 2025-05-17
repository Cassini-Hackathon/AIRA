import { useLocation } from "wouter";

const BottomNavigation = () => {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4 z-40">
      <button
        className={`flex flex-col items-center p-2 ${
          isActive("/") ? "text-medical" : "text-gray-500"
        }`}
        onClick={() => setLocation("/")}
      >
        <span className="material-icons">home</span>
        <span className="text-xs mt-1">Home</span>
      </button>

      <button
        className={`flex flex-col items-center p-2 ${
          isActive("/guides") ? "text-medical" : "text-gray-500"
        }`}
        onClick={() => setLocation("/guides")}
      >
        <span className="material-icons">healing</span>
        <span className="text-xs mt-1">Guide</span>
      </button>

      <button
        className="flex flex-col items-center justify-center p-1 bg-emergency text-white rounded-full w-14 h-14 flex-shrink-0 -mt-5 shadow-md"
        onClick={() => setLocation("/emergency")}
      >
        <span className="material-icons">emergency</span>
        <span className="text-xs">SOS</span>
      </button>

      {/* <button 
        className={`flex flex-col items-center p-2 ${isActive('/weather') ? 'text-medical' : 'text-gray-500'}`}
        onClick={() => setLocation('/weather')}
      >
        <span className="material-icons">wb_sunny</span>
        <span className="text-xs mt-1">Meteo</span>
      </button> */}

      <button
        className={`flex flex-col items-center p-2 ${
          isActive("/maps") ? "text-medical" : "text-gray-500"
        }`}
        onClick={() => setLocation("/maps")}
      >
        <span className="material-icons">map</span>
        <span className="text-xs mt-1">Mappe</span>
      </button>

      <button
        className={`flex flex-col items-center p-2 ${
          isActive("/profile") ? "text-medical" : "text-gray-500"
        }`}
        onClick={() => setLocation("/profile")}
      >
        <span className="material-icons">person</span>
        <span className="text-xs mt-1">Profilo</span>
      </button>
    </nav>
  );
};

export default BottomNavigation;
