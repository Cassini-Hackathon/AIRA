import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import type { FeatureCollection } from "geojson";
import "leaflet/dist/leaflet.css";

// Props
interface MapWithGeoJsonProps {
  redGeoJson: FeatureCollection;
  blueGeoJson: FeatureCollection;
}

// Coordinate centro Bologna
const bolognaCoords: LatLngExpression = [44.4949, 11.3426];

// Icone personalizzate (da GitHub)
const redIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const blueIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Componente mappa
const GeoMapMarkers: React.FC<MapWithGeoJsonProps> = ({
  redGeoJson,
  blueGeoJson
}) => {
  const renderMarkers = (
    data: FeatureCollection,
    icon: Icon,
    color: string
  ) =>
    data.features.map((feature, index) => {
      if (
        feature.geometry.type === "Point" &&
        Array.isArray(feature.geometry.coordinates)
      ) {
        const [lng, lat] = feature.geometry.coordinates;
        return (
          <Marker
            key={`${color}-${index}`}
            position={[lat, lng]}
            icon={icon}
          >
            <Popup>
              <pre style={{ margin: 0 }}>
                {JSON.stringify(feature.properties, null, 2)}
              </pre>
            </Popup>
          </Marker>
        );
      }
      return null;
    });

  return (
    <MapContainer
      center={bolognaCoords}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {renderMarkers(redGeoJson, redIcon, "red")}
      {renderMarkers(blueGeoJson, blueIcon, "blue")}
    </MapContainer>
  );
};

export default GeoMapMarkers;
