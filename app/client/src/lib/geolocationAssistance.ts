import axios from "axios";
import { FeatureCollection } from "geojson";
import L from "leaflet";

const GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      id: "0",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3742958, 44.4836322],
          [11.3738075, 44.4838223],
          [11.373451, 44.4839587],
          [11.3730739, 44.4841089],
          [11.3728346, 44.4842021],
          [11.3727404, 44.4842388],
          [11.3725929, 44.4842962],
          [11.3724807, 44.4843401],
        ],
      },
    },
    {
      id: "1",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3724807, 44.4843401],
          [11.3723663, 44.4843846],
          [11.3721786, 44.4844584],
          [11.3714597, 44.4847429],
          [11.37108, 44.4848857],
          [11.3709578, 44.484928],
        ],
      },
    },
    {
      id: "2",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3709578, 44.484928],
          [11.3708181, 44.4849764],
          [11.3707093, 44.4850151],
          [11.3706006, 44.4850537],
          [11.3705011, 44.4850864],
        ],
      },
    },
    {
      id: "3",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3705011, 44.4850864],
          [11.3699809, 44.4853168],
          [11.3698222, 44.4853816],
          [11.3694665, 44.4855233],
          [11.3692267, 44.4856139],
          [11.3691075, 44.485637],
        ],
      },
    },
    {
      id: "4",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3691075, 44.485637],
          [11.3690579, 44.4855521],
          [11.3690414, 44.4855273],
          [11.3688096, 44.4851783],
          [11.3684101, 44.4845765],
          [11.3683958, 44.484555],
          [11.3683519, 44.4844895],
          [11.3683027, 44.4844163],
        ],
      },
    },
    {
      id: "5",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3683027, 44.4844163],
          [11.3681832, 44.4844607],
          [11.3681428, 44.4844756],
          [11.3668296, 44.4849604],
        ],
      },
    },
    {
      id: "6",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3668296, 44.4849604],
          [11.3667275, 44.4849988],
          [11.3657674, 44.4853603],
          [11.3657289, 44.4853758],
          [11.3655843, 44.4854356],
        ],
      },
    },
    {
      id: "7",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3655843, 44.4854356],
          [11.3654398, 44.4854942],
          [11.3654041, 44.4855075],
          [11.3646638, 44.4858036],
          [11.3637684, 44.486166],
          [11.3636833, 44.4861999],
        ],
      },
    },
    {
      id: "8",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3636833, 44.4861999],
          [11.3635883, 44.4862404],
          [11.3629221, 44.4865089],
          [11.3626046, 44.4866368],
          [11.3625535, 44.4866574],
          [11.3622912, 44.4867634],
          [11.3621033, 44.4868391],
          [11.361812, 44.4869564],
          [11.3617396, 44.4870028],
        ],
      },
    },
    {
      id: "9",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3617396, 44.4870028],
          [11.3616297, 44.4870684],
        ],
      },
    },
    {
      id: "10",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3616297, 44.4870684],
          [11.3615073, 44.4871324],
          [11.3608027, 44.4874189],
          [11.3607084, 44.4874695],
        ],
      },
    },
    {
      id: "11",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3607084, 44.4874695],
          [11.3606103, 44.4875167],
        ],
      },
    },
    {
      id: "12",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3606103, 44.4875167],
          [11.3604615, 44.4875908],
        ],
      },
    },
    {
      id: "13",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3604615, 44.4875908],
          [11.3603611, 44.4876279],
          [11.3602586, 44.4876386],
          [11.3601395, 44.4876302],
          [11.3596536, 44.4875721],
          [11.359381, 44.4875405],
          [11.358669, 44.4874731],
          [11.3585504, 44.4874633],
          [11.3580092, 44.4874172],
          [11.3579321, 44.4874103],
        ],
      },
    },
    {
      id: "14",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3579321, 44.4874103],
          [11.3579222, 44.4874947],
          [11.3579194, 44.4875192],
          [11.3578852, 44.487813],
          [11.3578369, 44.4882343],
          [11.3578068, 44.4884713],
          [11.3577994, 44.4885292],
        ],
      },
    },
    {
      id: "15",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3577994, 44.4885292],
          [11.3577712, 44.4888278],
        ],
      },
    },
    {
      id: "16",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3577712, 44.4888278],
          [11.3577269, 44.4893578],
          [11.3576829, 44.4899091],
        ],
      },
    },
    {
      id: "17",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3576829, 44.4899091],
          [11.3576584, 44.4902],
        ],
      },
    },
    {
      id: "18",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3576584, 44.4902],
          [11.3576537, 44.4902461],
          [11.3576442, 44.4903275],
          [11.3575946, 44.490744],
          [11.3575822, 44.4908587],
          [11.3575546, 44.4910901],
          [11.357542, 44.4911963],
          [11.3575393, 44.4912188],
          [11.3574059, 44.492339],
          [11.3574048, 44.4923654],
          [11.3573971, 44.4924461],
          [11.3573959, 44.4924568],
          [11.3573941, 44.4924735],
          [11.3573381, 44.4929915],
          [11.357233, 44.4938547],
          [11.3572124, 44.4940025],
        ],
      },
    },
    {
      id: "19",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3572124, 44.4940025],
          [11.3570822, 44.4940514],
          [11.3569458, 44.4940883],
        ],
      },
    },
    {
      id: "20",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3569458, 44.4940883],
          [11.3568005, 44.4940785],
          [11.3567372, 44.4940675],
          [11.3566739, 44.4940471],
          [11.3566205, 44.4940162],
        ],
      },
    },
    {
      id: "21",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3566205, 44.4940162],
          [11.3565745, 44.4940169],
          [11.3565424, 44.4940188],
          [11.356522, 44.4940197],
          [11.356443, 44.4940326],
          [11.3563888, 44.4940392],
          [11.3558073, 44.494047],
        ],
      },
    },
    {
      id: "22",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3558073, 44.494047],
          [11.3557368, 44.4938687],
          [11.355655, 44.4936905],
          [11.3555446, 44.4934644],
          [11.3555339, 44.4934447],
          [11.3554064, 44.493211],
          [11.3549433, 44.492301],
          [11.3547555, 44.4920629],
          [11.3544942, 44.4916988],
          [11.3541347, 44.491246],
        ],
      },
    },
    {
      id: "23",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3541347, 44.491246],
          [11.3542338, 44.4912095],
          [11.3546687, 44.4910491],
          [11.3551234, 44.4908774],
        ],
      },
    },
    {
      id: "24",
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [11.3551234, 44.4908774],
          [11.3551614, 44.4908626],
          [11.3559208, 44.4905711],
          [11.3559576, 44.4905559],
        ],
      },
    },
  ],
};

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
      "http://127.0.0.1:8000/routing/",
      // "https://aira-deploy.onrender.com/routing/",
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
    // const geoJson = GEOJSON as any;

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
