import { useEffect, useRef } from 'react';
import { Location } from '@/lib/types';

interface MapComponentProps {
  location: Location;
  height?: string;
  className?: string;
}

const MapComponent = ({ location, height = 'h-48', className = '' }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, this would initialize a map (like Leaflet)
    // For this demo, we'll just use a static image
    if (mapRef.current) {
      mapRef.current.style.backgroundImage = "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400')";
      mapRef.current.style.backgroundSize = "cover";
      mapRef.current.style.backgroundPosition = "center";
    }
  }, []);

  return (
    <div className={`relative bg-gray-200 rounded-xl w-full ${height} mb-4 overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full"></div>
      
      <div className="absolute bottom-3 right-3 bg-white rounded-lg shadow-md p-2 text-sm">
        <div className="flex items-center text-gray-700">
          <span className="material-icons text-sm mr-1">location_on</span>
          <span>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
        </div>
        {location.accuracy && (
          <div className="text-xs text-gray-500 mt-1">Precisione: ~{location.accuracy}m</div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
