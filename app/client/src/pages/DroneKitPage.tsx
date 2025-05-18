import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAppContext } from '@/context/AppContext';
import { apiRequest } from '@/lib/queryClient';
import AppHeader from '@/components/AppHeader';
import MapComponent from '@/components/MapComponent';
import { useToast } from '@/hooks/use-toast';

const DroneKitPage = () => {
  const { state } = useAppContext();
  const { location: userLocation } = state;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [kitType, setKitType] = useState<string>('basic');
  const [notes, setNotes] = useState<string>('');

  const droneDeliveryMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/drone-delivery', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Richiesta inviata",
        description: "La tua richiesta di consegna via drone è stata inviata con successo.",
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
      console.error("Error submitting drone delivery request:", error);
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

    const data = {
      kitType,
      notes,
      location: userLocation,
      status: 'pending',
      estimatedArrival: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    };

    droneDeliveryMutation.mutate(data);
  };

  if (!userLocation) {
    return (
      <div className="px-4 py-6">
        <AppHeader title="Kit Medico via Drone" showBackButton />
        <div className="flex items-center justify-center h-64">
          <p>Caricamento posizione...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-20">
      <AppHeader title="Kit Medico via Drone" showBackButton showProfile={false} showWeather={false} />
      
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">La tua posizione</h2>
        
        <MapComponent location={userLocation} />
        
        <div className="mb-4">
          <p className="font-medium">Indirizzo rilevato:</p>
          <p className="text-gray-700">{userLocation.address || 'Indirizzo non disponibile'}</p>
        </div>
        
        <div className="flex items-center mb-1">
          <span className="material-icons text-success mr-2">check_circle</span>
          <p className="text-gray-700">Area raggiungibile via drone</p>
        </div>
        <p className="text-xs text-gray-500 mb-4 ml-6">Tempo stimato di consegna: 8-12 minuti</p>
        
        <button className="w-full bg-gray-200 text-dark font-medium py-2 px-4 rounded-lg flex items-center justify-center">
          <span className="material-icons mr-2">edit_location</span>
          Modifica posizione
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Seleziona Kit Medico</h2>
        
        <div className="space-y-3 mb-4">
          <label className="block border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-gray-50">
            <div className="flex items-start">
              <input 
                type="radio" 
                name="kit-type" 
                className="mt-1 mr-3" 
                value="basic" 
                checked={kitType === 'basic'}
                onChange={() => setKitType('basic')}
              />
              <div>
                <h3 className="font-bold">Kit Base</h3>
                <p className="text-sm text-gray-600">Contiene medicinali di base, strumenti per fasciatura, analgesici e guanti sterili.</p>
                <div className="flex items-center mt-1 text-xs text-success">
                  <span className="material-icons text-xs mr-1">check_circle</span>
                  Disponibile per consegna immediata
                </div>
              </div>
            </div>
          </label>
          
          <label className="block border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-gray-50">
            <div className="flex items-start">
              <input 
                type="radio" 
                name="kit-type" 
                className="mt-1 mr-3" 
                value="advanced" 
                checked={kitType === 'advanced'}
                onChange={() => setKitType('advanced')}
              />
              <div>
                <h3 className="font-bold">Kit Avanzato</h3>
                <p className="text-sm text-gray-600">Include kit base più attrezzature per monitoraggio parametri vitali, defibrillatore portatile e dispositivi per immobilizzazione.</p>
                <div className="flex items-center mt-1 text-xs text-success">
                  <span className="material-icons text-xs mr-1">check_circle</span>
                  Disponibile per consegna immediata
                </div>
              </div>
            </div>
          </label>
          
          <label className="block border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-gray-50">
            <div className="flex items-start">
              <input 
                type="radio" 
                name="kit-type" 
                className="mt-1 mr-3" 
                value="specialized" 
                checked={kitType === 'specialized'}
                onChange={() => setKitType('specialized')}
              />
              <div>
                <h3 className="font-bold">Kit Specializzato</h3>
                <p className="text-sm text-gray-600">Kit personalizzato con farmaci specifici o strumenti medici avanzati in base alle necessità.</p>
                <div className="flex items-center mt-1 text-xs text-info">
                  <span className="material-icons text-xs mr-1">info</span>
                  Richiede approvazione medica
                </div>
              </div>
            </div>
          </label>
        </div>
        
        <div className="mb-4">
          <label htmlFor="drone-request-note" className="block font-medium mb-2">Note aggiuntive</label>
          <textarea 
            id="drone-request-note" 
            rows={2} 
            className="w-full border border-gray-300 rounded-lg p-3" 
            placeholder="Specifica esigenze particolari..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Istruzioni per la consegna</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="material-icons text-warning mr-3 mt-1">lightbulb</span>
            <p className="text-sm">Assicurati di avere uno spazio aperto di almeno 2x2 metri per l'atterraggio sicuro del drone.</p>
          </div>
          
          <div className="flex items-start">
            <span className="material-icons text-warning mr-3 mt-1">lightbulb</span>
            <p className="text-sm">Utilizza il flash della torcia del tuo telefono verso l'alto per aiutare il drone a individuarti in condizioni di scarsa illuminazione.</p>
          </div>
          
          <div className="flex items-start">
            <span className="material-icons text-warning mr-3 mt-1">lightbulb</span>
            <p className="text-sm">Non toccare il drone prima che si sia completamente arrestato e le eliche abbiano smesso di girare.</p>
          </div>
        </div>
        
        <div className="mt-4 rounded-xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1598620617148-c9e8ddee6711?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500" 
            alt="Drone di consegna medica" 
            className="w-full h-auto" 
          />
        </div>
      </div>
      
      <button 
        onClick={handleSubmit}
        disabled={droneDeliveryMutation.isPending}
        className="w-full bg-medical text-white font-bold py-4 px-6 rounded-xl text-lg flex items-center justify-center shadow-md mb-4 disabled:opacity-50"
      >
        {droneDeliveryMutation.isPending ? (
          <span className="animate-spin mr-2">◌</span>
        ) : (
          <span className="material-icons mr-2">send</span>
        )}
        Richiedi Consegna via Drone
      </button>
      
      <p className="text-center text-sm text-gray-500">
        Il servizio di consegna via drone è operato da personale medico qualificato. Riceverai istruzioni su come utilizzare il kit una volta confermata la consegna.
      </p>
    </div>
  );
};

export default DroneKitPage;
