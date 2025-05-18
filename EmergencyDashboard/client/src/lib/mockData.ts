import { Emergency, Vehicle, GeoJSONData } from "@/types";

// Hospital coordinates (center point)
export const hospitalCoords: [number, number] = [42.2000, 12.5000];

// Emergency data
export const emergencies: Emergency[] = [
  {
    id: 1,
    name: "Mario",
    surname: "Rossi",
    coords: [42.1234, 12.4321],
    eta: "12 min",
    vehicle: "Ambulanza A-103",
    vehicleId: "A-103",
    rescuers: "Dott. Bianchi, Inf. Verdi",
    type: "ground",
  },
  {
    id: 2,
    name: "Lucia",
    surname: "Neri",
    coords: [42.2345, 12.5432],
    eta: "7 min",
    vehicle: "Elicottero E-01",
    vehicleId: "E-01",
    rescuers: "Dott. Ferrari, Inf. Marini, Tecnico Russo",
    type: "air",
  },
  {
    id: 3,
    name: "Giovanni",
    surname: "Bruno",
    coords: [42.3456, 12.6543],
    eta: "15 min",
    vehicle: "Ambulanza A-201",
    vehicleId: "A-201",
    rescuers: "Dott.ssa Ricci, Inf. Esposito",
    type: "ground",
  },
];

// Vehicle data
export const vehicles: Vehicle[] = [
  {
    id: "A-101",
    type: "ground",
    description: "Ambulanza Tipo A",
    status: "active",
  },
  {
    id: "A-103",
    type: "ground",
    description: "Ambulanza Tipo A",
    status: "active",
  },
  {
    id: "A-201",
    type: "ground",
    description: "Ambulanza Tipo B",
    status: "active",
  },
  {
    id: "E-01",
    type: "air",
    description: "Elicottero Medico",
    status: "active",
  },
  {
    id: "D-01",
    type: "drone",
    description: "Drone Farmaci Emergenza",
    status: "active",
  },
  {
    id: "D-02",
    type: "drone",
    description: "Drone Defibrillatore",
    status: "active",
  },
  {
    id: "A-105",
    type: "ground",
    description: "Ambulanza Tipo A",
    status: "available",
  },
  {
    id: "E-02",
    type: "air",
    description: "Elicottero Medico",
    status: "available",
  },
  {
    id: "D-03",
    type: "drone",
    description: "Drone Farmaci Salvavita",
    status: "available",
  },
  {
    id: "D-04",
    type: "drone",
    description: "Drone Defibrillatore",
    status: "available",
  },
];

// GeoJSON data for map
export const geoJsonData: GeoJSONData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Zona Ospedaliera",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [12.495, 42.195],
            [12.505, 42.195],
            [12.505, 42.205],
            [12.495, 42.205],
            [12.495, 42.195],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Route 1",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [12.5000, 42.2000],
          [12.4321, 42.1234],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Route 2",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [12.5000, 42.2000],
          [12.5432, 42.2345],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Route 3",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [12.5000, 42.2000],
          [12.6543, 42.3456],
        ],
      },
    },
  ],
};
