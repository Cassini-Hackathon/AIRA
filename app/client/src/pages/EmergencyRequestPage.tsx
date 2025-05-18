import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAppContext } from "@/context/AppContext";
import { apiRequest } from "@/lib/queryClient";
import AppHeader from "@/components/AppHeader";
import MapComponent from "@/components/MapComponent";
import { useToast } from "@/hooks/use-toast";
import CameraCapture from "@/components/CameraCapture";
import { AudioRecorder } from "@/components/AudioRecorder";

const EmergencyRequestPage = () => {
  const { state } = useAppContext();
  const { location: userLocation } = state;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [photo, setPhoto] = useState<string>();
  const [emergencyType, setEmergencyType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [victimCount, setVictimCount] = useState<string>("1");

  const handleAudioRecorded = (audio: { base64: string; mimeType: string }) => {
    console.log("Audio ricevuto:", audio);
  };

  const emergencyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/emergency", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Richiesta inviata",
        description:
          "La tua richiesta di soccorso è stata inviata con successo.",
        variant: "success",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description:
          "Si è verificato un errore nell'invio della richiesta. Riprova.",
        variant: "destructive",
      });
      console.error("Error submitting emergency request:", error);
    },
  });

  const handleSubmit = () => {
    setLocation("/geo-map");
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
      <AppHeader
        title="Richiesta Soccorso"
        showBackButton
        showProfile={false}
        showWeather={false}
      />

      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">
          La tua posizione {userLocation.longitude}, {userLocation.latitude}
        </h2>
      </div>

      {/* Tipo di emergenza */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Tipo di emergenza
        </label>
        <select
          className="w-full p-3 bg-darkSurface border border-medicalPrimary/30 rounded-lg"
          value={emergencyType}
          onChange={(e) => setEmergencyType(e.target.value)}
        >
          <option value="">Seleziona tipo...</option>
          <option value="trauma">Trauma/Ferita</option>
          <option value="cardiac">Problema cardiaco</option>
          <option value="breathing">Difficoltà respiratorie</option>
          <option value="unconscious">Persona incosciente</option>
          <option value="burn">Ustione</option>
          <option value="other">Altro</option>
        </select>
      </div>

      <div className="md-4">
        <label className="block text-sm font-medium mb-2">
          Foto della situazione
        </label>
        <CameraCapture onPhotoTaken={(img) => setPhoto(img)} />

        {photo && (
          <div className="mt-6 text-center">
            <p className="mb-2 font-medium">Immagine della sitauzione</p>
            <img
              src={photo}
              alt="Foto"
              className="w-48 h-auto rounded-lg mx-auto"
            />
          </div>
        )}
      </div>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <AudioRecorder
          onAudioRecorded={({ blob, url, mimeType }) => {
            console.log("🎧 Audio blob:", blob);
            console.log("📎 URL:", url);
            console.log("🧾 MIME:", mimeType);

            const link = document.createElement("a");
            link.href = url;
            link.download = "registrazione.mp3";
            link.click();
          }}
        />
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
        Premendo "Invia" accetti di condividere la tua posizione con i servizi
        di emergenza e confermi che le informazioni fornite sono accurate al
        meglio delle tue conoscenze.
      </p>
    </div>
  );
};

export default EmergencyRequestPage;
