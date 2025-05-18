import { useCallback } from "react";
import L from "leaflet";
import { Emergency } from "@/types";
import { geoJsonData, hospitalCoords } from "@/lib/mockData";

const useMapAnimation = () => {
  const initializeMap = useCallback((mapElement: HTMLElement, emergencies: Emergency[]) => {
    // Create map with a darker theme
    const map = L.map(mapElement, {
      zoomControl: false // Hide default zoom control
    }).setView(hospitalCoords, 11);
    
    // Add custom dark tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);
    
    // Add custom zoom control in the bottom right instead of top left
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);
    
    // Create hospital marker with a red cross icon
    const hospitalIcon = L.divIcon({
      className: "vehicle-marker hospital-marker",
      html: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>',
      iconSize: [40, 40] as [number, number]
    });
    
    const hospitalMarker = L.marker(hospitalCoords, { icon: hospitalIcon }).addTo(map);
    hospitalMarker.bindPopup(`
      <div class="hospital-popup">
        <h3 class="text-red-600 font-bold">Ospedale San Raffaele</h3>
        <p class="text-gray-700">Centro Emergenze</p>
        <hr class="my-2">
        <p><b>Direttore:</b> Dott. Alberto Bianchi</p>
        <p><b>Telefono:</b> +39 06 1234567</p>
        <p><b>Mezzi disponibili:</b> 8</p>
        <p><b>Personale in servizio:</b> 24</p>
      </div>
    `).openPopup();
    
    // Add CSS for markers
    if (!document.getElementById("leaflet-custom-styles")) {
      const style = document.createElement("style");
      style.id = "leaflet-custom-styles";
      style.innerHTML = `
        .vehicle-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          border: 2px solid white;
        }
        .ground-vehicle {
          background-color: #DC2626;
        }
        .air-vehicle {
          background-color: #EF4444;
        }
        .drone-vehicle {
          background-color: #BE123C;
        }
        .hospital-marker {
          background-color: #991B1B;
          width: 40px;
          height: 40px;
        }
        .leaflet-div-icon {
          background: transparent;
          border: none;
        }
        .emergency-pulse {
          border-radius: 50%;
          box-shadow: 0 0 0 rgba(220, 38, 38, 0.4);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Add emergency markers and animate vehicles
    const markers: L.Marker[] = [];
    const vehicleMarkers: L.Marker[] = [];
    const intervals: NodeJS.Timeout[] = [];
    
    emergencies.forEach(emergency => {
      // Create emergency location marker with pulsing effect
      const emergencyIcon = L.divIcon({
        className: 'emergency-pulse',
        html: `<div style="background-color: #DC2626; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      const emergencyMarker = L.marker(emergency.coords, { icon: emergencyIcon }).addTo(map);
      emergencyMarker.bindPopup(`
        <div class="emergency-popup p-2">
          <h3 class="text-red-600 font-bold">${emergency.name} ${emergency.surname}</h3>
          <p class="text-gray-700">ETA: ${emergency.eta}</p>
          <hr class="my-2">
          <p><b>Coordinate:</b> ${emergency.coords[0].toFixed(4)}, ${emergency.coords[1].toFixed(4)}</p>
          <p><b>Tipo di emergenza:</b> Codice Rosso</p>
          <p><b>Richiesto:</b> ${new Date().toLocaleDateString('it-IT')}</p>
        </div>
      `);
      markers.push(emergencyMarker);
      
      // Create vehicle marker with appropriate icon
      let vehicleIconClass, vehicleIconContent;
      
      if (emergency.type === 'air') {
        vehicleIconClass = 'air-vehicle';
        vehicleIconContent = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2.5l5.5 4.5-1.5 1.5 3 3.5-2 2-3.5-3-1.5 1.5L7.5 22H4l1-6L2 13l2-2 3.5 3L9 12.5 4.5 7 6 4l6 1.5z"/></svg>';
      } else if (emergency.type === 'drone') {
        vehicleIconClass = 'drone-vehicle';
        vehicleIconContent = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M15,5V7.5H17.15Q15.7,9.775 13.475,10.55L10.85,7.925L9.45,9.325L12.075,11.95Q11.3,14.175 9,15.6V13.5H6.5V19H12V16.5H9.85Q12.55,14.95 13.7,12.275L15.35,13.925L16.75,12.525L15.1,10.875Q16.275,8.5 17.5,7.325V9.5H20V4H15Z"/></svg>';
      } else {
        vehicleIconClass = 'ground-vehicle';
        vehicleIconContent = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>';
      }
      
      const vehicleIcon = L.divIcon({
        className: `vehicle-marker ${vehicleIconClass}`,
        html: vehicleIconContent,
        iconSize: [30, 30] as [number, number]
      });
      
      // Animation: move from hospital to emergency location
      const vehicleMarker = L.marker(hospitalCoords, { icon: vehicleIcon }).addTo(map);
      vehicleMarker.bindPopup(`
        <div class="vehicle-popup p-2">
          <h3 class="text-red-600 font-bold">${emergency.vehicleId}</h3>
          <p class="text-gray-700">${emergency.type === 'air' ? 'Elicottero' : 'Ambulanza'}</p>
          <hr class="my-2">
          <p><b>Equipaggio:</b> ${emergency.rescuers}</p>
          <p><b>Stato:</b> In movimento</p>
          <p><b>Velocità:</b> ${emergency.type === 'air' ? '240' : '85'} km/h</p>
          <p><b>ETA:</b> ${emergency.eta}</p>
        </div>
      `);
      vehicleMarkers.push(vehicleMarker);
      
      // Calculate intermediate points for animation
      const numPoints = 100;
      const deltaLat = (emergency.coords[0] - hospitalCoords[0]) / numPoints;
      const deltaLng = (emergency.coords[1] - hospitalCoords[1]) / numPoints;
      
      let currentPoint = 0;
      
      // Start the animation
      const interval = setInterval(() => {
        currentPoint++;
        if (currentPoint > numPoints) {
          clearInterval(interval);
          return;
        }
        
        const newLat = hospitalCoords[0] + deltaLat * currentPoint;
        const newLng = hospitalCoords[1] + deltaLng * currentPoint;
        vehicleMarker.setLatLng([newLat, newLng]);
      }, 100);
      
      intervals.push(interval);
    });
    
    // Add GeoJSON to map with styling
    L.geoJSON(geoJsonData, {
      style: function(feature) {
        if (feature?.geometry.type === 'Polygon') {
          return { 
            color: "#991B1B", 
            weight: 2, 
            opacity: 0.6, 
            fillColor: "#FEE2E2", 
            fillOpacity: 0.2 
          };
        } else if (feature?.geometry.type === 'LineString') {
          return { 
            color: "#DC2626", 
            weight: 3, 
            opacity: 0.7, 
            dashArray: "5, 10",
            lineCap: "round"
          };
        }
        return {};
      },
      onEachFeature: function(feature, layer) {
        if (feature.properties && feature.properties.name) {
          if (feature.geometry.type === 'Polygon') {
            layer.bindPopup(`
              <div class="area-popup p-2">
                <h3 class="text-red-600 font-bold">${feature.properties.name}</h3>
                <p class="text-gray-700">Area operativa</p>
                <hr class="my-2">
                <p><b>Stato:</b> Attivo</p>
                <p><b>Personale:</b> 24</p>
                <p><b>Mezzi disponibili:</b> 8</p>
              </div>
            `);
          } else {
            layer.bindPopup(`
              <div class="route-popup p-2">
                <h3 class="text-red-600 font-bold">${feature.properties.name}</h3>
                <p class="text-gray-700">Percorso di emergenza</p>
                <hr class="my-2">
                <p><b>Stato:</b> Attivo</p>
                <p><b>Distanza:</b> ${Math.floor(Math.random() * 10) + 3} km</p>
                <p><b>Tempo stimato:</b> ${Math.floor(Math.random() * 20) + 5} min</p>
              </div>
            `);
          }
        }
      }
    }).addTo(map);
    
    // Cleanup function
    return () => {
      map.remove();
      intervals.forEach(interval => clearInterval(interval));
    };
  }, []);
  
  return { initializeMap };
};

export default useMapAnimation;
