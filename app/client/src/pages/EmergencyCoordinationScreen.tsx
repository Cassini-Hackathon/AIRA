import AppHeader from "@/components/AppHeader";
import GeoMap from "@/components/GeoMap";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";

const steps = [
  { label: "ETA: 12 minuti", icon: "🚑" },
  { label: "Consegna medicinali - ETA drone: 4 minuti", icon: "🚁" },
  {
    label:
      "Medicinali in arrivo: \n     • Aspirina 325mg\n• Antitrombotico preventivo\n• Nitroglicerina sublinguale\n• Kit emergenza cardiaca",
    icon: "💊",
  },
];

const EmergencyCoordinationScreen = () => {
  const [, setLocation] = useLocation();
  const { state } = useAppContext();
  const { ambulance } = state;

  const [stepIndex, setStepIndex] = useState(0);

  const handleCancelEmergency = () => {
    if (confirm("Sei sicuro di voler annullare la richiesta di emergenza?")) {
      setLocation("/");
    }
  };

  useEffect(() => {
    if (stepIndex < steps.length - 1) {
      const timer = setTimeout(() => setStepIndex(stepIndex + 1), 2000);
      return () => clearTimeout(timer);
    }
  }, [stepIndex]);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-emergency p-4 flex items-center">
        <h1 className="text-xl font-bold text-white flex-1 text-center">
          Emergenza in corso
        </h1>
      </div>

      {/* Ambulance path rendering */}
      {ambulance?.path === undefined && (
        <div className="flex flex-col items-center justify-center h-[6rem] border rounded-2xl shadow-md animate-pulse bg-gray-50">
          <svg
            className="w-12 h-12 text-gray-400 animate-spin mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-gray-500 text-lg font-medium">
            Caricamento percorso ambulanza...
          </p>
        </div>
      )}

      {ambulance?.path === null && (
        <div className="flex flex-col items-center justify-center h-[10rem] border rounded-2xl shadow-md bg-red-50 text-red-700">
          <svg
            className="w-12 h-12 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
            />
          </svg>
          <p className="text-lg font-semibold">
            Errore nel caricamento del percorso
          </p>
        </div>
      )}
      {ambulance?.path && (
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-bold text-emergency">
            🚑 Ambulanza in arrivo
          </h2>
          <div className="h-[300px] shadow-md rounded-2xl overflow-hidden border">
            <GeoMap geoJsonData={ambulance.path} bounds={ambulance.bounds} />
          </div>
        </div>
      )}

      {/* Step-by-step emergency status */}
      <div className="space-y-4">
        {steps.slice(0, stepIndex + 1).map((step, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-lg border border-gray-200"
          >
            <div className="text-3xl">{step.icon}</div>
            <p className="text-xl md:text-lg font-medium text-gray-800 whitespace-pre-line">
              {step.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 place-items-center mb-4 w-full">
        <button
          className="w-full bg-darkSurface border border-emergency p-3 rounded-lg flex flex-col items-center justify-center text-emergency"
          onClick={handleCancelEmergency}
        >
          <span className="material-icons text-2xl mb-1">cancel</span>
          <span className="text-lg">Annulla SOS</span>
        </button>
      </div>
    </div>
  );
};

export default EmergencyCoordinationScreen;
