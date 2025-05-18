import React, { useEffect, useState } from "react";
import GeoMap from "@/components/GeoMap";
import { useAppContext } from "@/context/AppContext";
import { getAmbulancePath } from "@/lib/geolocationAssistance";

import type { FeatureCollection } from "geojson";
import type { LatLngBounds } from "leaflet";
import AppHeader from "@/components/AppHeader";

const EmergencyCoordinationScreen = () => {
  const { state } = useAppContext();
  const { location } = state;

  const [ambPath, setAmbPath] = useState<
    FeatureCollection | null | undefined
  >();
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  useEffect(() => {
    const fetchAmbPath = async () => {
      if (!location) return;

      const result = await getAmbulancePath(
        44.491799,
        11.356466,
        location.latitude,
        location.longitude
      );

      if (result) {
        setAmbPath(result.geoJson);
        setBounds(result.bounds);
      } else {
        setAmbPath(null);
        setBounds(null);
      }
    };

    fetchAmbPath();
  }, [location]);

  return (
    <div className="px-4 py-6 pb-20">
      <AppHeader
        title="Soccorso in corso"
        showBackButton
        showProfile={false}
        showWeather={false}
      />

      {ambPath === undefined && (
        <div className="flex flex-col items-center justify-center h-[75vh] border rounded-2xl shadow-md animate-pulse bg-gray-50">
          <svg
            className="w-12 h-12 text-gray-400 animate-spin mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-gray-500 text-lg font-medium">
            Caricamento percorso ambulanza...
          </p>
        </div>
      )}

      {ambPath === null && (
        <div className="flex flex-col items-center justify-center h-[75vh] border rounded-2xl shadow-md bg-red-50 text-red-700">
          <svg
            className="w-12 h-12 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
            />
          </svg>
          <p className="text-lg font-semibold">
            Errore nel caricamento del percorso
          </p>
        </div>
      )}

      {ambPath && (
        <div className="h-[75vh] shadow-md rounded-2xl overflow-hidden border">
          <GeoMap geoJsonData={ambPath} bounds={bounds} />
        </div>
      )}
    </div>
  );
};

export default EmergencyCoordinationScreen;
