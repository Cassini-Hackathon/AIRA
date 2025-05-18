import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { EmergencyRequest, DroneDelivery } from '@/lib/types';
import { mockEmergencyRequests, mockDroneDeliveries } from '@/lib/mocks';
import { useToast } from '@/hooks/use-toast';

const AdminPanelPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState('emergencies');

  // In a real app, we would fetch these from the API
  const { data: emergencyRequests, isLoading: loadingEmergencies } = useQuery<EmergencyRequest[]>({
    queryKey: ['/api/emergency'],
    initialData: mockEmergencyRequests as unknown as EmergencyRequest[]
  });

  const { data: droneDeliveries, isLoading: loadingDeliveries } = useQuery<DroneDelivery[]>({
    queryKey: ['/api/drone-delivery'],
    initialData: mockDroneDeliveries as unknown as DroneDelivery[]
  });

  const handleLogout = () => {
    toast({
      title: "Logout effettuato",
      description: "Hai effettuato il logout con successo.",
      variant: "default"
    });
    setLocation('/login');
  };

  const handleShowDetails = (id: string) => {
    toast({
      title: "Dettagli",
      description: `Visualizzazione dettagli per ID: ${id}`,
      variant: "default"
    });
  };

  const handleMonitorDrone = (id: string) => {
    toast({
      title: "Monitoraggio Drone",
      description: `Monitoraggio del drone ${id} avviato`,
      variant: "default"
    });
  };

  const handleRecallDrone = (id: string) => {
    toast({
      title: "Richiamo Drone",
      description: `Richiamo del drone ${id} avviato`,
      variant: "destructive"
    });
  };

  return (
    <div className="px-4 py-6 pb-20">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pannello Admin</h1>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-3">Admin</span>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200"
          >
            <span className="material-icons text-dark text-sm">person</span>
          </button>
        </div>
      </header>
      
      {/* Dashboard Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-500">Emergenze Attive</h3>
            <span className="material-icons text-emergency">emergency</span>
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-xs text-gray-500">+3 nell'ultima ora</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-500">Consegne Drone</h3>
            <span className="material-icons text-medical">medication</span>
          </div>
          <p className="text-3xl font-bold">5</p>
          <p className="text-xs text-gray-500">2 in corso</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-500">Mezzi Operativi</h3>
            <span className="material-icons text-success">local_shipping</span>
          </div>
          <p className="text-3xl font-bold">28</p>
          <p className="text-xs text-gray-500">85% disponibili</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-500">Tempo Risposta</h3>
            <span className="material-icons text-info">timer</span>
          </div>
          <p className="text-3xl font-bold">8m</p>
          <p className="text-xs text-gray-500">-2m rispetto a ieri</p>
        </div>
      </div>
      
      {/* Operational Map */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Mappa Operativa</h2>
        
        <div className="relative bg-gray-200 rounded-xl w-full h-80 mb-4 overflow-hidden">
          {/* Map Component - In a real app would use Leaflet or similar */}
          <img 
            src="https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500" 
            alt="Mappa operativa" 
            className="w-full h-full object-cover" 
          />
          
          {/* Map Controls */}
          <div className="absolute top-3 right-3 bg-white rounded-lg shadow-md p-2 flex flex-col space-y-2">
            <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="material-icons">add</span>
            </button>
            <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="material-icons">remove</span>
            </button>
            <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="material-icons">layers</span>
            </button>
          </div>
        </div>
        
        {/* Map Legend */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-emergency">
              <span className="material-icons text-white text-sm">emergency</span>
            </div>
            <span className="text-sm">Emergenze</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-success">
              <span className="material-icons text-white text-sm">local_shipping</span>
            </div>
            <span className="text-sm">Ambulanze</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-medical">
              <span className="material-icons text-white text-sm">medication</span>
            </div>
            <span className="text-sm">Droni</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-info">
              <span className="material-icons text-white text-sm">local_hospital</span>
            </div>
            <span className="text-sm">Ospedali</span>
          </div>
        </div>
        
        {/* Map Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button 
            className={`${activeFilter === 'emergencies' ? 'bg-emergency text-white' : 'bg-gray-200 text-dark'} text-sm py-1 px-3 rounded-full flex items-center`}
            onClick={() => setActiveFilter('emergencies')}
          >
            <span className="material-icons text-sm mr-1">emergency</span>
            Emergenze
          </button>
          <button 
            className={`${activeFilter === 'ambulances' ? 'bg-emergency text-white' : 'bg-gray-200 text-dark'} text-sm py-1 px-3 rounded-full flex items-center`}
            onClick={() => setActiveFilter('ambulances')}
          >
            <span className="material-icons text-sm mr-1">local_shipping</span>
            Ambulanze
          </button>
          <button 
            className={`${activeFilter === 'drones' ? 'bg-emergency text-white' : 'bg-gray-200 text-dark'} text-sm py-1 px-3 rounded-full flex items-center`}
            onClick={() => setActiveFilter('drones')}
          >
            <span className="material-icons text-sm mr-1">medication</span>
            Droni
          </button>
          <button 
            className={`${activeFilter === 'hospitals' ? 'bg-emergency text-white' : 'bg-gray-200 text-dark'} text-sm py-1 px-3 rounded-full flex items-center`}
            onClick={() => setActiveFilter('hospitals')}
          >
            <span className="material-icons text-sm mr-1">local_hospital</span>
            Ospedali
          </button>
          <button 
            className={`${activeFilter === 'alerts' ? 'bg-emergency text-white' : 'bg-gray-200 text-dark'} text-sm py-1 px-3 rounded-full flex items-center`}
            onClick={() => setActiveFilter('alerts')}
          >
            <span className="material-icons text-sm mr-1">warning</span>
            Allerte
          </button>
        </div>
      </div>
      
      {/* Recent Emergencies */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Emergenze Recenti</h2>
          <button className="text-medical text-sm">Vedi Tutte</button>
        </div>
        
        {loadingEmergencies ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 border-l-4 border-gray-200 animate-pulse h-24"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {mockEmergencyRequests.map((request) => (
              <div 
                key={request.id} 
                className={`bg-gray-50 rounded-xl p-3 border-l-4 ${
                  request.severity === 'Critico' ? 'border-emergency' : 
                  request.severity === 'Medio' ? 'border-warning' : 'border-success'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{request.type}</h3>
                    <p className="text-sm text-gray-600">{request.address}</p>
                    <div className="flex items-center mt-1">
                      <div className={`${
                        request.severity === 'Critico' ? 'bg-emergency/20 text-emergency' : 
                        request.severity === 'Medio' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                      } text-xs py-0.5 px-2 rounded-full mr-2`}>
                        {request.severity}
                      </div>
                      <span className="text-xs text-gray-500">ID: #{request.id}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{request.time}</p>
                    <button 
                      onClick={() => handleShowDetails(request.id)}
                      className="mt-2 bg-gray-200 text-dark text-xs py-1 px-2 rounded-lg"
                    >
                      Dettagli
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Active Drone Deliveries */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Consegne Drone Attive</h2>
          <button className="text-medical text-sm">Gestisci Flotta</button>
        </div>
        
        {loadingDeliveries ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 animate-pulse h-24"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {mockDroneDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-gray-50 rounded-xl p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{delivery.kitType}</h3>
                    <p className="text-sm text-gray-600">{delivery.location}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">Drone ID: {delivery.id} • </span>
                      <span className={`text-xs ${delivery.status === 'In volo' ? 'text-success' : 'text-warning'} ml-1`}>
                        {delivery.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-xs text-gray-500 justify-end">
                      <span className="material-icons text-xs mr-1">timer</span>
                      ETA: {delivery.eta}
                    </div>
                    <div className="mt-2 flex space-x-2 justify-end">
                      <button 
                        onClick={() => handleMonitorDrone(delivery.id)}
                        className="bg-medical text-white text-xs py-1 px-2 rounded-lg"
                      >
                        Monitora
                      </button>
                      <button 
                        onClick={() => handleRecallDrone(delivery.id)}
                        className="bg-gray-200 text-dark text-xs py-1 px-2 rounded-lg"
                      >
                        Richiama
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelPage;
