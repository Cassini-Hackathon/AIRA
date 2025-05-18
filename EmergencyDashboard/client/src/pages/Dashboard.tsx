import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import EmergencyList from "@/components/EmergencyList";
import VehicleList from "@/components/VehicleList";
import MapContainer from "@/components/MapContainer";
import { emergencies, vehicles } from "@/lib/mockData";
import { VehicleType } from "@/types";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emergencyFilter, setEmergencyFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState<VehicleType | "all">("all");

  const filteredEmergencies = emergencies.filter(
    (emergency) =>
      emergency.name.toLowerCase().includes(emergencyFilter.toLowerCase()) ||
      emergency.surname.toLowerCase().includes(emergencyFilter.toLowerCase())
  );

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (vehicleFilter === "all") return true;
    return vehicle.type === vehicleFilter;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-red-700">Dashboard Emergenze</h1>
              <p className="text-secondary-500">Ospedale San Raffaele - Centro Emergenze</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-secondary-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-red-600">Mappa delle Emergenze</h2>
                    <p className="text-sm text-secondary-500">Visualizzazione dei mezzi e delle emergenze attive</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-600"></div>
                      <span className="text-xs text-secondary-600">Mezzi</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-100"></div>
                      <span className="text-xs text-secondary-600">Emergenze</span>
                    </div>
                  </div>
                </div>
                
                <MapContainer emergencies={emergencies} />
              </div>
              
              <EmergencyList 
                emergencies={filteredEmergencies} 
                filter={emergencyFilter} 
                setFilter={setEmergencyFilter} 
              />
              
              <VehicleList 
                vehicles={filteredVehicles} 
                filter={vehicleFilter} 
                setFilter={setVehicleFilter} 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
