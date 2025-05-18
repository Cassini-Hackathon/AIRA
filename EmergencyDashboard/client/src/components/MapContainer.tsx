import React, { useEffect, useRef } from "react";
import { Emergency } from "@/types";
import useMapAnimation from "@/hooks/useMapAnimation";

interface MapContainerProps {
  emergencies: Emergency[];
}

const MapContainer: React.FC<MapContainerProps> = ({ emergencies }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { initializeMap } = useMapAnimation();

  useEffect(() => {
    if (mapRef.current) {
      const cleanupFn = initializeMap(mapRef.current, emergencies);
      return () => cleanupFn();
    }
  }, [emergencies, initializeMap]);

  return (
    <div className="h-[500px] relative">
      <div id="map" ref={mapRef} className="w-full h-full z-0"></div>
    </div>
  );
};

export default MapContainer;
