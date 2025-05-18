export type VehicleType = "ground" | "air" | "drone";
export type VehicleStatus = "active" | "available";

export interface Emergency {
  id: number;
  name: string;
  surname: string;
  coords: [number, number]; // [lat, lng]
  eta: string;
  vehicle: string;
  vehicleId: string;
  rescuers: string;
  type: VehicleType;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  description: string;
  status: VehicleStatus;
}

export interface GeoJSONData {
  type: "FeatureCollection";
  features: Feature[];
}

export interface Feature {
  type: "Feature";
  properties: {
    name: string;
  };
  geometry: {
    type: "Polygon" | "LineString";
    coordinates: number[][][] | number[][];
  };
}
