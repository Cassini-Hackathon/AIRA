import { useState, useEffect } from "react";
import { useLocation } from "wouter";

// Tipi per i dati di emergenza
type EmergencyVehicle = {
  id: string;
  type: string;
  status: string;
  eta?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  destination?: {
    latitude: number;
    longitude: number;
  };
  crew: string[];
  speed?: string;
};

type EmergencyRequest = {
  id: string;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  requestType: string;
  priority: "alta" | "media" | "bassa";
  status: "in attesa" | "assegnata" | "in corso" | "completata" | "annullata";
  assignedVehicles: string[];
  patientInfo?: {
    name?: string;
    age?: number;
    gender?: string;
    condition?: string;
  };
  description: string;
};

// Dati mock per la dimostrazione
const mockEmergencyVehicles: EmergencyVehicle[] = [
  {
    id: "AMB-1234",
    type: "ambulanza",
    status: "in servizio",
    location: { latitude: 44.3650, longitude: 11.7122 },
    destination: { latitude: 44.3547648, longitude: 11.7014528 },
    crew: ["Dr. Rossi", "Inf. Bianchi", "Soccorritore Verdi"],
    eta: "5 minuti",
    speed: "65 km/h"
  },
  {
    id: "AMB-5678",
    type: "automedica",
    status: "disponibile",
    location: { latitude: 44.3701, longitude: 11.7245 },
    crew: ["Dr. Ferrari", "Inf. Romano"],
    speed: "0 km/h"
  },
  {
    id: "ELI-9012",
    type: "elisoccorso",
    status: "in servizio",
    location: { latitude: 44.3589, longitude: 11.7299 },
    destination: { latitude: 44.3784, longitude: 11.7310 },
    crew: ["Dr. Martini", "Inf. Costa", "Pilota Ricci", "Tecnico Esposito"],
    eta: "2 minuti",
    speed: "230 km/h"
  },
  {
    id: "DRONE-7891",
    type: "drone medico",
    status: "in servizio",
    location: { latitude: 44.3620, longitude: 11.7180 },
    destination: { latitude: 44.3600, longitude: 11.7150 },
    crew: [],
    eta: "1 minuto",
    speed: "45 km/h"
  },
  {
    id: "AMB-2345",
    type: "ambulanza",
    status: "disponibile",
    location: { latitude: 44.3602, longitude: 11.7050 },
    crew: ["Inf. Moretti", "Soccorritore Neri", "Autista Grandi"],
    speed: "0 km/h"
  }
];

const mockEmergencyRequests: EmergencyRequest[] = [
  {
    id: "ER-001",
    timestamp: Date.now() - 1000 * 60 * 15, // 15 minuti fa
    location: {
      latitude: 44.3547648, 
      longitude: 11.7014528,
      address: "Via Roma 123, Imola"
    },
    requestType: "arresto cardiaco",
    priority: "alta",
    status: "in corso",
    assignedVehicles: ["AMB-1234", "ELI-9012"],
    patientInfo: {
      age: 67,
      gender: "M",
      condition: "critica"
    },
    description: "Paziente anziano incosciente, respiro irregolare, segnalato da familiare"
  },
  {
    id: "ER-002",
    timestamp: Date.now() - 1000 * 60 * 5, // 5 minuti fa
    location: {
      latitude: 44.3784, 
      longitude: 11.7310,
      address: "Via Emilia 56, Imola"
    },
    requestType: "incidente stradale",
    priority: "alta",
    status: "assegnata",
    assignedVehicles: ["ELI-9012"],
    patientInfo: {
      condition: "multipli feriti"
    },
    description: "Collisione frontale tra due veicoli, almeno 3 persone coinvolte, una incastrata"
  },
  {
    id: "ER-003",
    timestamp: Date.now() - 1000 * 60 * 2, // 2 minuti fa
    location: {
      latitude: 44.3600, 
      longitude: 11.7150,
      address: "Piazza Matteotti 8, Imola"
    },
    requestType: "consegna farmaci",
    priority: "media",
    status: "in corso",
    assignedVehicles: ["DRONE-7891"],
    patientInfo: {
      name: "Maria Rossi",
      age: 78,
      gender: "F"
    },
    description: "Richiesta farmaci salvavita, paziente non può muoversi dall'abitazione"
  }
];

export default function AdminPanelPage2() {
  const [_, setLocation] = useLocation();
  const [isAdmin, setIsAdmin] = useState(true);
  const [vehicles, setVehicles] = useState<EmergencyVehicle[]>(mockEmergencyVehicles);
  const [requests, setRequests] = useState<EmergencyRequest[]>(mockEmergencyRequests);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'emergenze' | 'veicoli' | 'mappa'>('emergenze');

  // Funzione per aggiornare la posizione dei veicoli in movimento
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => {
          if (vehicle.status === "in servizio" && vehicle.destination) {
            // Simula un movimento verso la destinazione
            const latDiff = vehicle.destination.latitude - vehicle.location.latitude;
            const lngDiff = vehicle.destination.longitude - vehicle.location.longitude;
            
            return {
              ...vehicle,
              location: {
                latitude: vehicle.location.latitude + (latDiff * 0.05),
                longitude: vehicle.location.longitude + (lngDiff * 0.05)
              },
              // Aggiorna ETA in base al progresso
              eta: latDiff === 0 && lngDiff === 0 
                ? "arrivato" 
                : `${Math.max(1, Math.round(Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 1000))} minuti`
            };
          }
          return vehicle;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSwitchRole = () => {
    setIsAdmin(!isAdmin);
    
    // Se non è più admin, torna alla home
    if (isAdmin) {
      setLocation('/');
    }
  };

  const handleBack = () => {
    setLocation('/');
  };
  
  const handleAssignVehicle = (requestId: string, vehicleId: string) => {
    // Aggiorna la richiesta di emergenza
    setRequests(prevRequests => 
      prevRequests.map(request => {
        if (request.id === requestId) {
          return {
            ...request,
            assignedVehicles: [...request.assignedVehicles, vehicleId],
            status: "assegnata" as const
          };
        }
        return request;
      })
    );
    
    // Aggiorna lo stato del veicolo
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => {
        if (vehicle.id === vehicleId) {
          const targetRequest = requests.find(r => r.id === requestId);
          return {
            ...vehicle,
            status: "in servizio",
            destination: targetRequest?.location,
            eta: "calcolo in corso..."
          };
        }
        return vehicle;
      })
    );
  };

  const getRequestDetails = (requestId: string) => {
    return requests.find(r => r.id === requestId);
  };

  const getVehicleDetails = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const getPriorityColor = (priority: "alta" | "media" | "bassa") => {
    switch(priority) {
      case "alta": return "text-emergency";
      case "media": return "text-warning";
      case "bassa": return "text-info";
      default: return "text-white";
    }
  };

  const getStatusBadge = (status: string) => {
    let bgColor = "bg-gray-500";
    switch(status) {
      case "in attesa": bgColor = "bg-warning"; break;
      case "assegnata": bgColor = "bg-info"; break;
      case "in corso": bgColor = "bg-medicalPrimary"; break;
      case "completata": bgColor = "bg-success"; break;
      case "annullata": bgColor = "bg-gray-500"; break;
      case "in servizio": bgColor = "bg-medicalPrimary"; break;
      case "disponibile": bgColor = "bg-success"; break;
    }
    
    return (
      <span className={`${bgColor} text-xs px-2 py-1 rounded-full`}>
        {status}
      </span>
    );
  };

  // Se non è admin, reindirizza alla homepage
  if (!isAdmin) {
    setLocation('/');
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-darkBg">
      {/* Header */}
      <header className="bg-darkSurface p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="mr-3 text-textSecondary"
          >
            <span className="material-icons">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold">Pannello Amministrativo</h1>
            <p className="text-xs text-textSecondary">Gestione Emergenze e Veicoli</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-4 text-right">
            <p className="text-sm font-medium">test</p>
            <p className="text-xs text-textSecondary">Admin</p>
          </div>
          <button 
            onClick={handleSwitchRole}
            className="bg-darkBg p-2 rounded-md border border-gray-700"
          >
            <span className="material-icons text-warning">switch_account</span>
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800">
        <button 
          className={`py-3 px-4 ${activeTab === 'emergenze' ? 'border-b-2 border-medicalPrimary text-white' : 'text-textSecondary'}`}
          onClick={() => setActiveTab('emergenze')}
        >
          <span className="flex items-center">
            <span className="material-icons mr-1 text-sm">emergency</span>
            Emergenze
          </span>
        </button>
        <button 
          className={`py-3 px-4 ${activeTab === 'veicoli' ? 'border-b-2 border-medicalPrimary text-white' : 'text-textSecondary'}`}
          onClick={() => setActiveTab('veicoli')}
        >
          <span className="flex items-center">
            <span className="material-icons mr-1 text-sm">local_shipping</span>
            Veicoli
          </span>
        </button>
        <button 
          className={`py-3 px-4 ${activeTab === 'mappa' ? 'border-b-2 border-medicalPrimary text-white' : 'text-textSecondary'}`}
          onClick={() => setActiveTab('mappa')}
        >
          <span className="flex items-center">
            <span className="material-icons mr-1 text-sm">map</span>
            Mappa
          </span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Emergenze */}
        {activeTab === 'emergenze' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Richieste di Emergenza</h2>
              <div className="text-sm text-textSecondary">
                {requests.filter(r => r.status !== 'completata' && r.status !== 'annullata').length} attive
              </div>
            </div>
            
            {requests.filter(r => r.status !== 'completata' && r.status !== 'annullata').map(request => (
              <div 
                key={request.id} 
                className={`bg-darkSurface rounded-lg p-4 border ${selectedRequest === request.id ? 'border-medicalPrimary' : 'border-gray-800'}`}
                onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className={`font-bold ${getPriorityColor(request.priority)}`}>{request.requestType.toUpperCase()}</span>
                      <span className="mx-2 text-textSecondary">•</span>
                      <span className="text-sm">{request.id}</span>
                    </div>
                    <p className="text-sm text-textSecondary mb-2">{request.location.address}</p>
                    <div className="flex items-center text-xs text-textSecondary">
                      <span className="material-icons text-xs mr-1">schedule</span>
                      {new Date(request.timestamp).toLocaleTimeString()}
                      <span className="mx-1">•</span>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                  <div className="flex">
                    {request.assignedVehicles.map(vehicleId => {
                      const vehicle = getVehicleDetails(vehicleId);
                      return (
                        <div key={vehicleId} className="ml-1 p-1 rounded bg-darkBg flex items-center">
                          <span className="material-icons text-xs mr-1">
                            {vehicle?.type === 'ambulanza' ? 'emergency' : 
                             vehicle?.type === 'elisoccorso' ? 'helicopter' : 
                             vehicle?.type === 'drone medico' ? 'flight_takeoff' : 'directions_car'}
                          </span>
                          <span className="text-xs">{vehicleId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {selectedRequest === request.id && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-textSecondary">Condizione Paziente</p>
                        <p className="text-sm">{request.patientInfo?.condition || 'Non specificata'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-textSecondary">Informazioni Paziente</p>
                        <p className="text-sm">
                          {request.patientInfo?.name ? request.patientInfo.name + ', ' : ''}
                          {request.patientInfo?.age ? request.patientInfo.age + ' anni, ' : ''}
                          {request.patientInfo?.gender || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-textSecondary mb-1">Descrizione</p>
                    <p className="text-sm mb-4">{request.description}</p>
                    
                    {/* Veicoli disponibili da assegnare */}
                    <div className="mt-4">
                      <p className="text-xs text-textSecondary mb-2">Assegna Veicolo</p>
                      <div className="grid grid-cols-2 gap-2">
                        {vehicles
                          .filter(v => v.status === 'disponibile')
                          .map(vehicle => (
                            <button 
                              key={vehicle.id}
                              className="bg-darkBg border border-gray-800 rounded p-2 flex items-center justify-between text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignVehicle(request.id, vehicle.id);
                              }}
                            >
                              <div className="flex items-center">
                                <span className="material-icons text-medicalPrimary mr-2">
                                  {vehicle.type === 'ambulanza' ? 'emergency' : 
                                   vehicle.type === 'elisoccorso' ? 'helicopter' : 
                                   vehicle.type === 'drone medico' ? 'flight_takeoff' : 'directions_car'}
                                </span>
                                <div>
                                  <p>{vehicle.id}</p>
                                  <p className="text-xs text-textSecondary capitalize">{vehicle.type}</p>
                                </div>
                              </div>
                              <span className="material-icons text-medicalPrimary">add_circle</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Veicoli */}
        {activeTab === 'veicoli' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Flotta Veicoli</h2>
              <div className="text-sm text-textSecondary">
                {vehicles.filter(v => v.status === 'disponibile').length} disponibili
              </div>
            </div>
            
            {vehicles.map(vehicle => (
              <div 
                key={vehicle.id} 
                className={`bg-darkSurface rounded-lg p-4 border ${selectedVehicle === vehicle.id ? 'border-medicalPrimary' : 'border-gray-800'}`}
                onClick={() => setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="material-icons text-medicalPrimary mr-2">
                        {vehicle.type === 'ambulanza' ? 'emergency' : 
                         vehicle.type === 'elisoccorso' ? 'helicopter' : 
                         vehicle.type === 'drone medico' ? 'flight_takeoff' : 'directions_car'}
                      </span>
                      <span className="font-bold">{vehicle.id}</span>
                      <span className="mx-2 text-textSecondary">•</span>
                      <span className="text-sm capitalize">{vehicle.type}</span>
                    </div>
                    <div className="flex items-center text-sm text-textSecondary mb-1">
                      <span className="material-icons text-xs mr-1">person</span>
                      Equipaggio: {vehicle.crew.length > 0 ? vehicle.crew.join(', ') : 'Nessuno'}
                    </div>
                    <div className="flex items-center text-xs">
                      {getStatusBadge(vehicle.status)}
                      {vehicle.eta && (
                        <>
                          <span className="mx-2 text-textSecondary">•</span>
                          <span className="flex items-center">
                            <span className="material-icons text-xs mr-1">schedule</span>
                            ETA: {vehicle.eta}
                          </span>
                        </>
                      )}
                      {vehicle.speed && (
                        <>
                          <span className="mx-2 text-textSecondary">•</span>
                          <span className="flex items-center">
                            <span className="material-icons text-xs mr-1">speed</span>
                            {vehicle.speed}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedVehicle === vehicle.id && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-textSecondary">Posizione attuale</p>
                        <p className="text-sm">{vehicle.location.latitude.toFixed(4)}, {vehicle.location.longitude.toFixed(4)}</p>
                      </div>
                      {vehicle.destination && (
                        <div>
                          <p className="text-xs text-textSecondary">Destinazione</p>
                          <p className="text-sm">{vehicle.destination.latitude.toFixed(4)}, {vehicle.destination.longitude.toFixed(4)}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Controlli veicolo */}
                    <div className="mt-4 flex space-x-2">
                      <button className="bg-darkBg border border-gray-800 rounded py-2 px-4 text-sm flex items-center">
                        <span className="material-icons text-xs mr-1">call</span>
                        Contatta
                      </button>
                      <button className="bg-darkBg border border-gray-800 rounded py-2 px-4 text-sm flex items-center">
                        <span className="material-icons text-xs mr-1">route</span>
                        Dettagli rotta
                      </button>
                      <button className="bg-darkBg border border-warning/30 text-warning rounded py-2 px-4 text-sm flex items-center">
                        <span className="material-icons text-xs mr-1">cancel</span>
                        Richiama
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Mappa */}
        {activeTab === 'mappa' && (
          <div className="space-y-4">
            <div className="h-80 bg-darkSurface rounded-lg relative overflow-hidden">
              {/* Mappa semplificata */}
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'linear-gradient(to right, rgba(100, 100, 100, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(100, 100, 100, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                backgroundColor: '#1A1A1A' 
              }}>
                {/* Marker per le richieste di emergenza */}
                {requests.filter(r => r.status !== 'completata' && r.status !== 'annullata').map(request => (
                  <div 
                    key={request.id} 
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ 
                      left: `${(request.location.longitude - 11.695) / 0.07 * 100}%`,
                      top: `${100 - ((request.location.latitude - 44.34) / 0.07 * 100)}%`
                    }}
                  >
                    <div className={`
                      w-4 h-4 rounded-full 
                      ${request.priority === 'alta' ? 'bg-emergency' : 
                        request.priority === 'media' ? 'bg-warning' : 'bg-info'}
                      animate-ping absolute
                    `}></div>
                    <div className={`
                      w-4 h-4 rounded-full 
                      ${request.priority === 'alta' ? 'bg-emergency' : 
                        request.priority === 'media' ? 'bg-warning' : 'bg-info'}
                      flex items-center justify-center relative
                    `}>
                      <span className="text-[8px] text-white font-bold">{requests.indexOf(request) + 1}</span>
                    </div>
                  </div>
                ))}
                
                {/* Marker per i veicoli */}
                {vehicles.map(vehicle => (
                  <div 
                    key={vehicle.id} 
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-3000"
                    style={{ 
                      left: `${(vehicle.location.longitude - 11.695) / 0.07 * 100}%`,
                      top: `${100 - ((vehicle.location.latitude - 44.34) / 0.07 * 100)}%`
                    }}
                  >
                    <div className={`
                      w-5 h-5 rounded-full bg-darkBg border-2
                      ${vehicle.status === 'disponibile' ? 'border-success' : 'border-medicalPrimary'}
                      flex items-center justify-center
                    `}>
                      <span className="material-icons text-[12px] text-white">
                        {vehicle.type === 'ambulanza' ? 'emergency' : 
                         vehicle.type === 'elisoccorso' ? 'helicopter' : 
                         vehicle.type === 'drone medico' ? 'flight_takeoff' : 'directions_car'}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Percorsi tra veicoli e destinazioni */}
                <svg className="absolute inset-0 w-full h-full">
                  {vehicles
                    .filter(v => v.status === 'in servizio' && v.destination)
                    .map(vehicle => {
                      const startX = ((vehicle.location.longitude - 11.695) / 0.07 * 100);
                      const startY = (100 - ((vehicle.location.latitude - 44.34) / 0.07 * 100));
                      const endX = ((vehicle.destination!.longitude - 11.695) / 0.07 * 100);
                      const endY = (100 - ((vehicle.destination!.latitude - 44.34) / 0.07 * 100));

                      return (
                        <line 
                          key={vehicle.id}
                          x1={`${startX}%`} 
                          y1={`${startY}%`} 
                          x2={`${endX}%`} 
                          y2={`${endY}%`} 
                          stroke={vehicle.type === 'elisoccorso' ? '#ff5722' : '#2196f3'}
                          strokeWidth="1"
                          strokeDasharray={vehicle.type === 'elisoccorso' ? "5,2" : ""}
                        />
                      );
                    })}
                </svg>
              </div>
              
              {/* Legenda */}
              <div className="absolute bottom-3 left-3 bg-darkBg/80 p-2 rounded text-xs space-y-1">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-emergency mr-1"></span>
                  <span>Emergenza alta priorità</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-warning mr-1"></span>
                  <span>Emergenza media priorità</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-success mr-1"></span>
                  <span>Veicolo disponibile</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-medicalPrimary mr-1"></span>
                  <span>Veicolo in servizio</span>
                </div>
              </div>
              
              {/* Controlli mappa */}
              <div className="absolute top-3 right-3 bg-darkBg/80 p-2 rounded flex flex-col space-y-2">
                <button className="bg-darkSurface w-8 h-8 flex items-center justify-center rounded">
                  <span className="material-icons">add</span>
                </button>
                <button className="bg-darkSurface w-8 h-8 flex items-center justify-center rounded">
                  <span className="material-icons">remove</span>
                </button>
                <button className="bg-darkSurface w-8 h-8 flex items-center justify-center rounded">
                  <span className="material-icons">layers</span>
                </button>
              </div>
            </div>
            
            {/* Riepilogo sotto la mappa */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-darkSurface rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2 flex items-center">
                  <span className="material-icons text-sm mr-1 text-emergency">emergency</span>
                  Emergenze Attive
                </h3>
                <div className="space-y-2">
                  {requests
                    .filter(r => r.status !== 'completata' && r.status !== 'annullata')
                    .map((request, index) => (
                      <div key={request.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <span className="w-5 h-5 rounded-full bg-darkBg flex items-center justify-center mr-2">
                            <span className="text-xs">{index + 1}</span>
                          </span>
                          <span>{request.requestType}</span>
                        </div>
                        <div className="flex items-center">
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="bg-darkSurface rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2 flex items-center">
                  <span className="material-icons text-sm mr-1 text-medicalPrimary">directions_car</span>
                  Veicoli In Servizio
                </h3>
                <div className="space-y-2">
                  {vehicles
                    .filter(v => v.status === 'in servizio')
                    .map(vehicle => (
                      <div key={vehicle.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <span className="material-icons text-sm mr-2">
                            {vehicle.type === 'ambulanza' ? 'emergency' : 
                             vehicle.type === 'elisoccorso' ? 'helicopter' : 
                             vehicle.type === 'drone medico' ? 'flight_takeoff' : 'directions_car'}
                          </span>
                          <span>{vehicle.id}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="material-icons text-xs mr-1">schedule</span>
                          <span className="text-xs">{vehicle.eta}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Actions */}
      <div className="p-4 bg-darkSurface border-t border-gray-800">
        <button className="w-full bg-medicalPrimary text-white font-semibold py-3 rounded-lg flex items-center justify-center">
          <span className="material-icons mr-2">add_circle</span>
          Crea Nuova Richiesta di Emergenza
        </button>
      </div>
    </div>
  );
}