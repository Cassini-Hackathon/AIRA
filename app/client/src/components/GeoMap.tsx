import React, { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { Feature, FeatureCollection } from "geojson";
import type { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";

type GeoMapProps = {
  geoJsonData: FeatureCollection;
  bounds?: LatLngBounds | null;
};

const onEachFeature = (feature: Feature, layer: L.Layer) => {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name);
  }
};

const SetBounds: React.FC<{ bounds: LatLngBounds | null | undefined }> = ({
  bounds,
}) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [bounds, map]);

  return null;
};

const GeoMap: React.FC<GeoMapProps> = ({ geoJsonData, bounds }) => {
  return (
    <MapContainer
      zoom={10}
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={geoJsonData} onEachFeature={onEachFeature} />
      <SetBounds bounds={bounds} />
    </MapContainer>
  );
};

export default GeoMap;
