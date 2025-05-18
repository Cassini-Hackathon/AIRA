import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import type { Feature, FeatureCollection } from "geojson";
import type { LatLngBounds } from "leaflet";
import L from "leaflet";
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

const getStartCoordinate = (
  geoJsonData: FeatureCollection
): [number, number] | null => {
  for (const feature of geoJsonData.features) {
    const geom = feature.geometry;

    if (geom.type === "LineString" && Array.isArray(geom.coordinates)) {
      const [lng, lat] = geom.coordinates[0];
      return [lat, lng];
    }

    if (geom.type === "MultiLineString") {
      const firstLine = geom.coordinates[0];
      if (Array.isArray(firstLine) && firstLine.length > 0) {
        const [lng, lat] = firstLine[0];
        return [lat, lng];
      }
    }
  }

  return null;
};

const getEndCoordinate = (
  geoJsonData: FeatureCollection
): [number, number] | null => {
  for (const feature of [...geoJsonData.features].reverse()) {
    const geom = feature.geometry;

    if (geom.type === "LineString" && Array.isArray(geom.coordinates)) {
      const [lng, lat] = geom.coordinates[geom.coordinates.length - 1];
      return [lat, lng];
    }

    if (geom.type === "MultiLineString") {
      const lastLine = geom.coordinates[geom.coordinates.length - 1];
      if (Array.isArray(lastLine) && lastLine.length > 0) {
        const [lng, lat] = lastLine[lastLine.length - 1];
        return [lat, lng];
      }
    }
  }

  return null;
};

// Custom emoji icons
const ambulanceEmojiIcon = L.divIcon({
  html: `<div style="font-size: 1.75rem; line-height: 1; text-align: center;">🚑</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  className: "",
});

const arrivalEmojiIcon = L.divIcon({
  html: `<div style="font-size: 1.75rem; line-height: 1; text-align: center;">🧍</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  className: "",
});


// Route style: red and thick
const geoJsonStyle = {
  color: "red",
  weight: 6,
  opacity: 0.8,
};

const GeoMap: React.FC<GeoMapProps> = ({ geoJsonData, bounds }) => {
  const startCoord = getStartCoordinate(geoJsonData);
  const endCoord = getEndCoordinate(geoJsonData);

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

      <GeoJSON
        data={geoJsonData}
        onEachFeature={onEachFeature}
        style={geoJsonStyle}
      />

      {startCoord && (
        <Marker position={startCoord} icon={ambulanceEmojiIcon}>
          <Popup>Punto di partenza</Popup>
        </Marker>
      )}

      {endCoord && (
        <Marker position={endCoord} icon={arrivalEmojiIcon}>
          <Popup>Punto di arrivo</Popup>
        </Marker>
      )}

      <SetBounds bounds={bounds} />
    </MapContainer>
  );
};

export default GeoMap;