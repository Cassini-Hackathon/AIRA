import { Search, Clock, Ambulance, Users, MapPin, AlertTriangle } from "lucide-react";
import { Emergency } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface EmergencyListProps {
  emergencies: Emergency[];
  filter: string;
  setFilter: (filter: string) => void;
}

const EmergencyList: React.FC<EmergencyListProps> = ({
  emergencies,
  filter,
  setFilter,
}) => {
  // Generate a random emergency code (e.g., "Codice Rosso 1")
  const getEmergencyCode = () => {
    const codes = ["Rosso", "Giallo", "Verde"];
    // Prioritize Rosso for more urgency in the UI
    const codeIndex = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;
    return `Codice ${codes[codeIndex]} ${Math.floor(Math.random() * 5) + 1}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-secondary-200">
        <h2 className="text-lg font-semibold text-red-600 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
          Emergenze Attive
        </h2>
        <p className="text-sm text-secondary-500">Lista delle emergenze in corso</p>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Cerca emergenza..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-red-200 focus:ring-red-500 focus:border-red-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-red-400" />
          </div>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[400px]">
        {emergencies.length === 0 ? (
          <div className="p-4 text-center text-secondary-500">
            Nessuna emergenza trovata
          </div>
        ) : (
          emergencies.map((emergency) => {
            const emergencyCode = getEmergencyCode();
            return (
              <div 
                key={emergency.id} 
                className="p-4 border-b border-secondary-200 hover:bg-red-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-medium text-red-600">
                      {emergency.name} {emergency.surname}
                    </h3>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 text-red-500 mr-1" />
                      <p className="text-xs text-secondary-500">
                        {emergency.coords[0].toFixed(4)}, {emergency.coords[1].toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge className="bg-red-100 text-red-800 border-red-200 mb-1">
                      {emergencyCode}
                    </Badge>
                    <span className="flex items-center text-xs font-medium text-amber-700">
                      <Clock className="h-3 w-3 mr-1" />
                      ETA: {emergency.eta}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center text-sm text-secondary-700">
                    <Ambulance className="h-4 w-4 text-red-500 mr-1" />
                    <span className="font-medium mr-1">Mezzo:</span> 
                    <span className="text-red-600">{emergency.vehicle}</span>
                  </div>
                  <div className="flex items-center text-sm text-secondary-700">
                    <Users className="h-4 w-4 text-red-500 mr-1" />
                    <span className="font-medium mr-1">Soccorritori:</span> 
                    <span>{emergency.rescuers}</span>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <button className="text-xs text-red-600 hover:text-red-900 font-medium">
                    Dettagli →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EmergencyList;
