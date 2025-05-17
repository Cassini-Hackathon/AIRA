import React from 'react';
import GeoMap from '@/components/GeoMap';
import type { FeatureCollection } from 'geojson';

// GeoJSON con tipo corretto FeatureCollection
const exampleGeoJson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Punto A' },
      geometry: {
        type: 'Point',
        coordinates: [9.19, 45.4642], // Milano
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Punto B' },
      geometry: {
        type: 'Point',
        coordinates: [9.21, 45.47],
      },
    },
  ],
};

const GeoMapScreen = () => {
  return (
    <div className="p-6 h-screen">
      <h1 className="text-2xl font-bold mb-4">Mappa GeoJSON</h1>
      <div className="h-[75vh] shadow-md rounded-2xl overflow-hidden border">
        <GeoMap geoJsonData={exampleGeoJson} />
      </div>
    </div>
  );
};

export default GeoMapScreen;
