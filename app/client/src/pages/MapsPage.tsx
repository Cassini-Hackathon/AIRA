import React, { useEffect, useState } from "react";
import { LatLngBounds, LatLngBoundsLiteral } from "leaflet";
import type { Feature, FeatureCollection, Point } from "geojson";
import "leaflet/dist/leaflet.css";
import AppHeader from "@/components/AppHeader";
import { useAppContext } from "@/context/AppContext";
import GeoMapMarkers from "@/components/GeoMapMarkers";

const CLINICS = [
  {
    name: "Poliambulatorio Montebello",
    lat: 44.5020305,
    lon: 11.3422403,
    phone: "Non disponibile",
    address: "Via Montebello",
  },
  {
    name: "Ambulatorio",
    lat: 44.4971589,
    lon: 11.3644901,
    phone: "Non disponibile",
    address: "Via Massenzio Mas\u00eca",
  },
  {
    name: "Infermeria",
    lat: 44.4974319,
    lon: 11.3922128,
    phone: "Non disponibile",
    address: "Non disponibile",
  },
  {
    name: "LCB Life Clinic Bologna",
    lat: 44.5068917,
    lon: 11.3572989,
    phone: "Non disponibile",
    address: "Via del Lavoro",
  },
  {
    name: "Centro Diagnostico Cavour",
    lat: 44.5056945,
    lon: 11.3585803,
    phone: "+39 051 4383810",
    address: "Via del Lavoro",
  },
  {
    name: "Poliambulatorio Mazzacorati",
    lat: 44.4696292,
    lon: 11.3697647,
    phone: "Non disponibile",
    address: "Via Toscana",
  },
  {
    name: "Idroterapic",
    lat: 44.5031703,
    lon: 11.3631069,
    phone: "+39 051 633 3319",
    address: "Via San Donato",
  },
  {
    name: "Centro Medico San Donato",
    lat: 44.5032787,
    lon: 11.3678169,
    phone: "+39 051 512238",
    address: "Via dell'Artigiano",
  },
  {
    name: "Poliambulatorio Mengoli",
    lat: 44.4901494,
    lon: 11.3718621,
    phone: "Non disponibile",
    address: "Non disponibile",
  },
  {
    name: "Poliambulatorio privato Santa Lucia",
    lat: 44.4733453,
    lon: 11.3693819,
    phone: "Non disponibile",
    address: "Via Augusto Murri",
  },
  {
    name: "Poliambulatorio Zanolini",
    lat: 44.4948214,
    lon: 11.3573946,
    phone: "Non disponibile",
    address: "Via Antonio Zanolini",
  },
  {
    name: "Poliambulatorio San Domenico",
    lat: 44.4863741,
    lon: 11.3747705,
    phone: "+39 051 636 0967",
    address: "Non disponibile",
  },
  {
    name: "RadMedica",
    lat: 44.5009973,
    lon: 11.3414371,
    phone: "+390514222240",
    address: "Via del Porto",
  },
  {
    name: "Nome non disponibile",
    lat: 44.5008847,
    lon: 11.3736344,
    phone: "Non disponibile",
    address: "Non disponibile",
  },
  {
    name: "Centro medico legale INPS",
    lat: 44.5023589,
    lon: 11.3438109,
    phone: "Non disponibile",
    address: "Non disponibile",
  },
];

interface GeoPoint {
  lon: number;
  lat: number;
}

interface Result {
  geo_point: GeoPoint;
  [key: string]: any;
}

async function fetchGeoJSONDAE(): Promise<FeatureCollection<Point, any>> {
  const url =
    "https://opendata.comune.bologna.it/api/explore/v2.1/catalog/datasets/progetto-dae/records?limit=30";
  const res = await fetch(url);
  const data = await res.json();

  const features = data.results
    .filter(
      (item: any) =>
        item.geo_point?.lon !== undefined && item.geo_point?.lat !== undefined
    )
    .map(
      ({ geo_point, ...rest }: Result): Feature<Point, any> => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [geo_point.lon, geo_point.lat],
        },
        properties: rest,
      })
    );

  return {
    type: "FeatureCollection",
    features,
  };
}

function clinicsToGeoJSON(): FeatureCollection<Point, any> {
  const features = CLINICS.map((clinic) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [clinic.lon, clinic.lat],
    },
    properties: clinic,
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}

export default function MapsPage() {
  const [data, setData] = useState<FeatureCollection<Point> | null>(null);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const { state } = useAppContext();

  useEffect(() => {
    fetchGeoJSONDAE().then((geojson) => {
      setData(geojson);

      const coords = geojson.features.map((f) => f.geometry.coordinates);
      if (coords.length) {
        const latlngs: LatLngBoundsLiteral = coords.map(([lon, lat]) => [
          lat,
          lon,
        ]);
        setBounds(new LatLngBounds(latlngs));
      }
    });
  }, []);

  if (!data) {
    return <div>Loading map...</div>;
  }

  const clinicsGeoJSON = clinicsToGeoJSON();

  return (
    <div className="px-4 py-6 pb-20">
      <AppHeader
        title="Mappa Sanitaria"
        showBackButton
        showProfile={false}
        showWeather={false}
      />

      {/* Legenda */}
      <div className="mb-4 bg-white rounded-xl shadow p-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <img
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
            alt="Cliniche"
            className="w-4 h-7"
          />
          <span className="text-sm text-gray-800">Cliniche</span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png"
            alt="Defibrillatori"
            className="w-4 h-7"
          />
          <span className="text-sm text-gray-800">Defibrillatori</span>
        </div>
      </div>

      <GeoMapMarkers redGeoJson={clinicsGeoJSON} blueGeoJson={data} />
    </div>
  );
}
