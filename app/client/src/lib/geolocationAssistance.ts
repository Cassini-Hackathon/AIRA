import axios from "axios";
import { FeatureCollection } from "geojson";
import L from "leaflet";

export const test = async () => {
  try {
    const { data } = await axios.get("http://127.0.0.1:8000/routing/test");

    console.log("test", data);
  } catch (error) {
    console.error("Errore durante la fetch di /routing/test:", error);
    throw error;
  }
};

export async function getAmbulancePath(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<{ geoJson: FeatureCollection; bounds: L.LatLngBounds } | null> {
  try {
    const response = await axios.post<FeatureCollection>(
      // "http://127.0.0.1:8000/routing/",
      "https://aira-deploy.onrender.com/routing/",
      {
        start_coordinates: {
          latitude: startLat,
          longitude: startLng,
        },
        end_coordinates: {
          latitude: endLat,
          longitude: endLng,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 120000,
      }
    );

    const geoJson = response.data;

    // Funzione per estrarre i bounds dal GeoJSON
    const coords: [number, number][] = [];

    geoJson.features.forEach((feature) => {
      const geom = feature.geometry;
      if (geom.type === "Point") {
        coords.push([geom.coordinates[1], geom.coordinates[0]]);
      } else if (geom.type === "LineString") {
        geom.coordinates.forEach(([lng, lat]) => coords.push([lat, lng]));
      } else if (geom.type === "Polygon") {
        geom.coordinates[0].forEach(([lng, lat]) => coords.push([lat, lng]));
      }
    });

    const bounds = L.latLngBounds(coords);
    

    return { geoJson, bounds };
  } catch (error) {
    console.error("Errore durante il recupero del percorso:", error);
    return null;
  }
}
