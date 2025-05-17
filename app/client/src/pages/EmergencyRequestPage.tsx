import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAppContext } from '@/context/AppContext';
import { apiRequest } from '@/lib/queryClient';
import AppHeader from '@/components/AppHeader';
import MapComponent from '@/components/MapComponent';
import { useToast } from '@/hooks/use-toast';

const EmergencyRequestPage = () => {
  const { state } = useAppContext();
  const { location: userLocation } = state;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [victimCount, setVictimCount] = useState<string>('1');

  const emergencyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/emergency', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Richiesta inviata",
        description: "La tua richiesta di soccorso è stata inviata con successo.",
        variant: "success"
      });
      setLocation('/');
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'invio della richiesta. Riprova.",
        variant: "destructive"
      });
      console.error("Error submitting emergency request:", error);
    }
  });

  const handleSubmit = () => {
    if (!userLocation) {
      toast({
        title: "Errore",
        description: "Impossibile determinare la tua posizione. Riprova.",
        variant: "destructive"
      });
      return;
    }

    if (!emergencyType) {
      toast({
        title: "Tipo di emergenza richiesto",
        description: "Seleziona il tipo di emergenza prima di procedere.",
        variant: "destructive"
      });
      return;
    }

    const data = {
      type: emergencyType,
      description,
      victimCount,
      location: userLocation,
      status: 'pending'
    };

    emergencyMutation.mutate(data);
  };

  if (!userLocation) {
    return (
      <div className="px-4 py-6">
        <AppHeader title="Richiesta Soccorso" showBackButton />
        <div className="flex items-center justify-center h-64">
          <p>Caricamento posizione...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-20">
      <AppHeader title="Richiesta Soccorso" showBackButton showProfile={false} showWeather={false} />
      
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">La tua posizione</h2>
        
        <MapComponent location={userLocation} />
        
        <div className="mb-4">
          <p className="font-medium">Indirizzo rilevato:</p>
          <p className="text-gray-700">{userLocation.address || 'Indirizzo non disponibile'}</p>
        </div>
        
        <div className="flex items-center mb-4">
          <span className="material-icons text-success mr-2">check_circle</span>
          <p className="text-gray-700">GPS attivo e funzionante</p>
        </div>
        
        <button className="w-full bg-gray-200 text-dark font-medium py-2 px-4 rounded-lg flex items-center justify-center">
          <span className="material-icons mr-2">edit_location</span>
          Modifica posizione
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Tipo di emergenza</h2>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button 
            className={`${emergencyType === 'medical' ? 'bg-gray-200' : 'bg-gray-100'} hover:bg-gray-200 text-dark rounded-xl py-3 px-4 flex flex-col items-center`}
            onClick={() => setEmergencyType('medical')}
          >
            <span className="material-icons text-emergency mb-2">medical_services</span>
            <span className="font-medium">Medica</span>
          </button>
          <button 
            className={`${emergencyType === 'fire' ? 'bg-gray-200' : 'bg-gray-100'} hover:bg-gray-200 text-dark rounded-xl py-3 px-4 flex flex-col items-center`}
            onClick={() => setEmergencyType('fire')}
          >
            <span className="material-icons text-emergency mb-2">local_fire_department</span>
            <span className="font-medium">Incendio</span>
          </button>
          <button 
            className={`${emergencyType === 'accident' ? 'bg-gray-200' : 'bg-gray-100'} hover:bg-gray-200 text-dark rounded-xl py-3 px-4 flex flex-col items-center`}
            onClick={() => setEmergencyType('accident')}
          >
            <span className="material-icons text-emergency mb-2">car_crash</span>
            <span className="font-medium">Incidente</span>
          </button>
          <button 
            className={`${emergencyType === 'other' ? 'bg-gray-200' : 'bg-gray-100'} hover:bg-gray-200 text-dark rounded-xl py-3 px-4 flex flex-col items-center`}
            onClick={() => setEmergencyType('other')}
          >
            <span className="material-icons text-emergency mb-2">more_horiz</span>
            <span className="font-medium">Altro</span>
          </button>
        </div>
        
        <div className="mb-4">
          <label htmlFor="emergency-description" className="block font-medium mb-2">Descrivi l'emergenza</label>
          <textarea 
            id="emergency-description" 
            rows={3} 
            className="w-full border border-gray-300 rounded-lg p-3" 
            placeholder="Fornisci più dettagli possibili..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label htmlFor="victim-count" className="block font-medium mb-2">Numero di persone coinvolte</label>
          <select 
            id="victim-count" 
            className="w-full border border-gray-300 rounded-lg p-3 bg-white"
            value={victimCount}
            onChange={(e) => setVictimCount(e.target.value)}
          >
            <option value="1">1 persona</option>
            <option value="2">2 persone</option>
            <option value="3">3 persone</option>
            <option value="4+">4 o più persone</option>
            <option value="unknown">Non so</option>
          </select>
        </div>
      </div>
      
      <button 
        onClick={handleSubmit}
        disabled={emergencyMutation.isPending || !emergencyType}
        className="w-full bg-emergency text-white font-bold py-4 px-6 rounded-xl text-lg flex items-center justify-center shadow-md mb-4 disabled:opacity-50"
      >
        {emergencyMutation.isPending ? (
          <span className="animate-spin mr-2">◌</span>
        ) : (
          <span className="material-icons mr-2">send</span>
        )}
        Invia Richiesta di Soccorso
      </button>
      
      <p className="text-center text-sm text-gray-500">
        Premendo "Invia" accetti di condividere la tua posizione con i servizi di emergenza e confermi che le informazioni fornite sono accurate al meglio delle tue conoscenze.
      </p>
    </div>
  );
};

export default EmergencyRequestPage;
