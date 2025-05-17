import React from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import type { Feature, FeatureCollection } from 'geojson';
import 'leaflet/dist/leaflet.css';

type GeoMapProps = {
  geoJsonData: FeatureCollection;
};

const onEachFeature = (feature: Feature, layer: L.Layer) => {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name);
  }
};

const GeoMap: React.FC<GeoMapProps> = ({ geoJsonData }) => {
  return (
    <MapContainer
      center={[45.4642, 9.19]}
      zoom={10}
      style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={geoJsonData} onEachFeature={onEachFeature} />
    </MapContainer>
  );
};

export default GeoMap;
