import React, { useState } from "react";
import { Search, X, User, Calendar, Wrench, Battery, MapPin, ShieldAlert } from "lucide-react";
import { Vehicle, VehicleType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface VehicleListProps {
  vehicles: Vehicle[];
  filter: VehicleType | "all";
  setFilter: (filter: VehicleType | "all") => void;
}

interface VehicleDetailsProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
}

// Vehicle Details Component
const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicle, open, onClose }) => {
  if (!vehicle) return null;
  
  // Dati dettagliati per il veicolo
  const vehicleDetails = {
    lastMaintenance: "12/04/2023",
    nextMaintenance: "12/10/2023",
    crew: vehicle.type === "ground" 
      ? "Autista + 2 soccorritori" 
      : vehicle.type === "air" 
        ? "Pilota + Medico + Tecnico" 
        : "Controllo automatizzato + supervisore",
    fuel: vehicle.type === "drone" ? "96%" : "85%",
    equipment: vehicle.type === "ground" 
      ? ["Defibrillatore", "Kit Emergenza", "Ossigeno", "Barella"] 
      : vehicle.type === "air" 
        ? ["Defibrillatore", "Kit Emergenza Avanzato", "Ossigeno", "Barella", "Apparecchiature Chirurgiche"] 
        : vehicle.description.includes("Defibrillatore")
          ? ["Defibrillatore Automatico", "Kit Primo Soccorso", "Istruzioni Vocali"] 
          : ["Farmaci Emergenza", "Farmaci Salvavita", "Kit Iniezioni"],
    registrationDate: "15/06/2020",
    model: vehicle.type === "ground" 
      ? "Mercedes Sprinter 315" 
      : vehicle.type === "air" 
        ? "AgustaWestland AW139" 
        : "DJI Matrice 300 RTK",
    maxSpeed: vehicle.type === "ground" 
      ? "140 km/h" 
      : vehicle.type === "air" 
        ? "310 km/h" 
        : "72 km/h",
    range: vehicle.type === "ground" 
      ? "700 km" 
      : vehicle.type === "air" 
        ? "1000 km" 
        : "50 km",
    operatingHours: Math.floor(Math.random() * 5000) + 1000,
    lastInspection: "02/05/2023",
    medicalKit: vehicle.type === "drone" 
      ? vehicle.description.includes("Defibrillatore")
        ? {
            name: "Kit Defibrillatore di Emergenza",
            items: [
              "Defibrillatore DAE automatico",
              "Forbici per tagliare indumenti",
              "Rasoio per rimuovere peli dal torace",
              "Salviette disinfettanti",
              "Guanti monouso",
              "Istruzioni vocali automatiche"
            ]
          }
        : vehicle.description.includes("Emergenza")
          ? {
              name: "Kit Farmaci Emergenza",
              items: [
                "Adrenalina auto-iniettabile",
                "Naloxone (antidoto oppioidi)",
                "Amiodarone (antiaritmico)",
                "Atropina (per bradicardia)",
                "Diazepam (anti-convulsivo)",
                "Istruzioni per somministrazione"
              ]
            }
          : {
              name: "Kit Farmaci Salvavita",
              items: [
                "Insulina rapida",
                "EpiPen (adrenalina per shock anafilattici)",
                "Glucagone (per ipoglicemia severa)",
                "Aspirina (per sospette ischemie)",
                "Nitroglicerina (per angina)",
                "Ventolina (broncodilatatore)"
              ]
            }
      : null
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600 flex items-center gap-2">
            {vehicle.type === "ground" ? 
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg> :
              vehicle.type === "air" ?
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.5l5.5 4.5-1.5 1.5 3 3.5-2 2-3.5-3-1.5 1.5L7.5 22H4l1-6L2 13l2-2 3.5 3L9 12.5 4.5 7 6 4l6 1.5z"/></svg> :
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M15,5V7.5H17.15Q15.7,9.775 13.475,10.55L10.85,7.925L9.45,9.325L12.075,11.95Q11.3,14.175 9,15.6V13.5H6.5V19H12V16.5H9.85Q12.55,14.95 13.7,12.275L15.35,13.925L16.75,12.525L15.1,10.875Q16.275,8.5 17.5,7.325V9.5H20V4H15Z"/></svg>
            }
            {vehicle.id} - {vehicle.description}
          </DialogTitle>
          <DialogDescription>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${vehicle.status === "active" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
              {vehicle.status === "active" ? "In servizio" : "Disponibile"}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Wrench className="h-4 w-4 text-red-500" />
              <span className="font-medium">Ultima manutenzione:</span> {vehicleDetails.lastMaintenance}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-red-500" />
              <span className="font-medium">Prossima manutenzione:</span> {vehicleDetails.nextMaintenance}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-red-500" />
              <span className="font-medium">Equipaggio:</span> {vehicleDetails.crew}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Battery className="h-4 w-4 text-red-500" />
              <span className="font-medium">Carburante:</span> {vehicleDetails.fuel}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-red-500" />
              <span className="font-medium">Posizione:</span> {vehicle.status === "active" ? "In movimento" : "Ospedale"}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              <span className="font-medium">Modello:</span> {vehicleDetails.model}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Velocità max:</span> {vehicleDetails.maxSpeed}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Autonomia:</span> {vehicleDetails.range}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Ore operative:</span> {vehicleDetails.operatingHours}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Ultima ispezione:</span> {vehicleDetails.lastInspection}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <h4 className="text-sm font-medium text-red-600">Dotazione a bordo:</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {vehicleDetails.equipment.map((item, index) => (
              <Badge key={index} variant="outline" className="bg-gray-50">
                {item}
              </Badge>
            ))}
          </div>
        </div>
        
        {vehicle.type === "drone" && vehicleDetails.medicalKit && (
          <div className="border-t border-gray-200 pt-3 mt-3">
            <h4 className="text-sm font-bold text-red-600">{vehicleDetails.medicalKit.name}</h4>
            <p className="text-xs text-gray-500 mb-2">Farmaci e prodotti contenuti nel kit</p>
            <ul className="space-y-1 text-sm">
              {vehicleDetails.medicalKit.items.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Chiudi</Button>
          {vehicle.status === "available" && (
            <Button className="bg-red-600 hover:bg-red-700">Attiva Mezzo</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  filter,
  setFilter,
}) => {
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const filteredVehicles = vehicles.filter(v => {
    // Apply type filter
    if (filter !== "all" && v.type !== filter) return false;
    
    // Apply search filter
    if (vehicleSearch && !v.id.toLowerCase().includes(vehicleSearch.toLowerCase()) && 
        !v.description.toLowerCase().includes(vehicleSearch.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const handleDetailsClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailsOpen(true);
  };
  
  return (
    <div className="lg:col-span-3 bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-secondary-200">
        <h2 className="text-lg font-semibold text-red-600">Mezzi di Soccorso</h2>
        <p className="text-sm text-secondary-500">Lista dei mezzi disponibili e in servizio</p>
      </div>
      
      <div className="p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow max-w-xs">
          <Input
            type="text"
            placeholder="Cerca mezzo..."
            className="w-full pl-10 pr-4 py-2 border-red-200 focus:ring-red-500 focus:border-red-500"
            value={vehicleSearch}
            onChange={(e) => setVehicleSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-red-400" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-secondary-700">Filtro:</span>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className={filter === "all" ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-200" : ""}
            onClick={() => setFilter("all")}
          >
            Tutti
          </Button>
          <Button
            variant={filter === "ground" ? "default" : "outline"}
            size="sm"
            className={filter === "ground" ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-200" : ""}
            onClick={() => setFilter("ground")}
          >
            Via Terra
          </Button>
          <Button
            variant={filter === "air" ? "default" : "outline"}
            size="sm"
            className={filter === "air" ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-200" : ""}
            onClick={() => setFilter("air")}
          >
            Via Aria
          </Button>
        </div>
      </div>
      
      {filteredVehicles.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Nessun mezzo trovato con i filtri selezionati
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-red-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                  ID Mezzo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                  Descrizione
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                  Stato
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                  Posizione
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-red-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    {vehicle.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {vehicle.type === "ground" ? "Terra" : "Aria"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {vehicle.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        vehicle.status === "active"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {vehicle.status === "active" ? "In servizio" : "Disponibile"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {vehicle.status === "active" ? "In movimento" : "Ospedale"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      className="text-red-600 hover:text-red-900 font-medium"
                      onClick={() => handleDetailsClick(vehicle)}
                    >
                      Dettagli
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <VehicleDetails 
        vehicle={selectedVehicle} 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)} 
      />
    </div>
  );
};

export default VehicleList;
