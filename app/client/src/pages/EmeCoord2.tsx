import { useAppContext } from "@/context/AppContext";
import { mockGuides } from "@/lib/mocks";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import EmergencyCoordinationScreen from "./EmergencyCoordinationScreen";

export default function EmeCoord2() {
  const [_, setLocation] = useLocation();
  const { state } = useAppContext();
  const { location } = state;

  // Stato per tracciare il processo di coordinamento
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [emergencyServices, setEmergencyServices] = useState<{
    dispatched: boolean;
    vehicleType: string;
    personnel: string[];
    eta: string;
    route: string;
  }>({
    dispatched: false,
    vehicleType: "",
    personnel: [],
    eta: "",
    route: "",
  });
  const [medicationDelivery, setMedicationDelivery] = useState<{
    dispatched: boolean;
    medications: { name: string; purpose: string }[];
    eta: string;
  }>({
    dispatched: false,
    medications: [],
    eta: "",
  });
  const [firstAidInstructions, setFirstAidInstructions] = useState<{
    condition: string;
    steps: { title: string; description: string }[];
  }>({
    condition: "",
    steps: [],
  });

  // Simula il processo di coordinamento
  useEffect(() => {
    // Step 1: Analisi della situazione
    setTimeout(() => {
      // Step 2: Invio dei servizi di emergenza
      setCurrentStep(2);
      setEmergencyServices({
        dispatched: true,
        vehicleType: "Ambulanza Medicalizzata",
        personnel: [
          "Medico di emergenza",
          "Paramedico specializzato",
          "Autista",
        ],
        eta: "12 minuti",
        route: "Percorso ottimizzato tramite Via Roma",
      });

      // Step 3: Invio medicinali via drone
      setTimeout(() => {
        setCurrentStep(3);
        setMedicationDelivery({
          dispatched: true,
          medications: [
            { name: "Aspirina 325mg", purpose: "Antitrombotico preventivo" },
            {
              name: "Nitroglicerina sublinguale",
              purpose: "Vasodilatatore per dolore cardiaco",
            },
            {
              name: "Kit emergenza cardiaca",
              purpose: "Attrezzatura per primo soccorso",
            },
          ],
          eta: "4 minuti",
        });

        // Step 4: Istruzioni di primo soccorso
        setTimeout(() => {
          setCurrentStep(4);

          // Utilizzo dei dati di primo soccorso esistenti
          const cardiacGuide = mockGuides.find(
            (guide: { title: string }) =>
              guide.title.toLowerCase().includes("RCP")
            // guide.title.toLowerCase().includes("cpr")
          );

          if (cardiacGuide) {
            setFirstAidInstructions({
              condition: cardiacGuide.title,
              steps: cardiacGuide.content.steps,
            });
          } else {
            // Fallback se non trova le guide specifiche
            setFirstAidInstructions({
              condition: "Sospetto attacco cardiaco",
              steps: [
                {
                  title: "Mantieni la calma",
                  description:
                    "Aiuta il paziente a rimanere calmo e rassicuralo.",
                },
                {
                  title: "Posizione comoda",
                  description:
                    "Aiuta il paziente a sedersi in posizione comoda, leggermente inclinata.",
                },
                {
                  title: "Allenta gli indumenti",
                  description: "Slaccia cinture, colletti o indumenti stretti.",
                },
                {
                  title: "Prepara l'aspirina",
                  description:
                    "Se disponibile, offri al paziente un'aspirina da masticare (non ingoiare).",
                },
              ],
            });
          }
        }, 4000);
      }, 3000);
    }, 2000);
  }, []);

  // Gestisce l'annullamento della richiesta di emergenza
  const handleCancelEmergency = () => {
    if (confirm("Sei sicuro di voler annullare la richiesta di emergenza?")) {
      setLocation("/");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-emergency p-4 flex items-center">
        <h1 className="text-xl font-bold text-white flex-1 text-center">
          Emergenza in corso
        </h1>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-gradient-to-b from-darkBg to-darkSurface">
        {/* Pannello di stato dell'emergenza */}
        <div className="bg-emergency/10 border border-emergency rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg text-emergency">
              Richiesta attiva
            </h2>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-emergency animate-pulse mr-2"></span>
              <span className="text-emergency text-sm">SOS</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-textSecondary mb-1">
            <span className="material-icons text-xs mr-1">location_on</span>
            <span>Posizione: {location?.latitude}, {location?.longitude}</span>
          </div>
          <div className="flex items-center text-sm text-textSecondary">
            <span className="material-icons text-xs mr-1">info</span>
            <span>
              Identificata come:{" "}
              <span className="text-warning">Sospetta emergenza cardiaca</span>
            </span>
          </div>
        </div>

        {/* Progress tracker */}
        <div className="relative mb-6 px-4">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-600"></div>

          {/* Step 1: Analisi della situazione */}
          <div className="flex mb-4 relative">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                currentStep >= 1 ? "bg-medicalPrimary" : "bg-gray-600"
              }`}
            >
              <span className="material-icons text-sm text-white">
                {currentStep > 1 ? "check" : "search"}
              </span>
            </div>
            <div className="ml-4">
              <h3
                className={`font-semibold ${
                  currentStep >= 1 ? "text-medicalPrimary" : "text-gray-500"
                }`}
              >
                Analisi della situazione
              </h3>
              <p className="text-sm text-textSecondary mt-1">
                {currentStep > 1
                  ? "Analisi completata: Paziente con sintomi di emergenza cardiaca"
                  : "Valutazione dei sintomi e prioritizzazione dell'intervento..."}
              </p>
            </div>
          </div>

          {/* Step 2: Invio dei servizi di emergenza */}
          <div className="flex mb-4 relative">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                currentStep >= 2 ? "bg-medicalPrimary" : "bg-gray-600"
              }`}
            >
              <span className="material-icons text-sm text-white">
                {currentStep > 2 ? "check" : "local_hospital"}
              </span>
            </div>
            <div className="ml-4">
              <h3
                className={`font-semibold ${
                  currentStep >= 2 ? "text-medicalPrimary" : "text-gray-500"
                }`}
              >
                Servizi di emergenza
              </h3>
              {emergencyServices.dispatched ? (
                <div className="text-sm mt-1 w-full">
                  <div className="w-full bg-darkSurface p-2 rounded-lg mb-2 border border-medicalPrimary/30">
                    {/* <div className="flex justify-between text-textSecondary">
                      <span>Veicolo:</span>
                      <span className="text-white">
                        {emergencyServices.vehicleType}
                      </span>
                    </div> */}
                    <div className="flex justify-between text-textSecondary">
                      <span>ETA:</span>
                      <span className="text-warning">
                        {emergencyServices.eta}
                      </span>
                    </div>
                    {/* <div className="flex justify-between text-textSecondary">
                      <span>Personale:</span>
                      <span className="text-white">
                        {emergencyServices.personnel.join(", ")}
                      </span>
                    </div> */}
                    <div className="flex justify-between text-textSecondary">
                      {/* <span>Percorso:</span> */}
                      {/* <span className="text-white">
                        {emergencyServices.route}
                      </span> */}
                      <EmergencyCoordinationScreen />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-textSecondary mt-1">
                  Selezione e invio dei mezzi di soccorso appropriati...
                </p>
              )}
            </div>
          </div>

          {/* Step 3: Invio medicinali via drone */}
          <div className="flex mb-4 relative">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                currentStep >= 3 ? "bg-medicalPrimary" : "bg-gray-600"
              }`}
            >
              <span className="material-icons text-sm text-white">
                {currentStep > 3 ? "check" : "flight_takeoff"}
              </span>
            </div>
            <div className="ml-4">
              <h3
                className={`font-semibold ${
                  currentStep >= 3 ? "text-medicalPrimary" : "text-gray-500"
                }`}
              >
                Consegna medicinali
              </h3>
              {medicationDelivery.dispatched ? (
                <div className="text-sm mt-1">
                  <div className="bg-darkSurface p-3 rounded-lg mb-2 border border-medicalPrimary/30">
                    <div className="flex justify-between mb-2 text-textSecondary">
                      <span>ETA drone:</span>
                      <span className="text-success">
                        {medicationDelivery.eta}
                      </span>
                    </div>

                    <h4 className="text-xs uppercase text-textSecondary mb-1">
                      Medicinali in arrivo:
                    </h4>
                    {medicationDelivery.medications.map((med, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-medicalSecondary pl-2 mb-2"
                      >
                        <p className="text-white">{med.name}</p>
                        <p className="text-xs text-textSecondary">
                          {med.purpose}
                        </p>
                      </div>
                    ))}

                    {/* <button
                      className="w-full mt-2 p-2 bg-medicalSecondary/20 border border-medicalSecondary rounded-lg text-medicalSecondary flex items-center justify-center"
                      onClick={() => setLocation("/drone-tracking")}
                    >
                      <span className="material-icons text-sm mr-1">
                        flight
                      </span>
                      Traccia consegna drone
                    </button> */}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-textSecondary mt-1">
                  Preparazione medicinali di emergenza per consegna immediata...
                </p>
              )}
            </div>
          </div>

          {/* Step 4: Istruzioni di primo soccorso */}
          <div className="flex relative">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                currentStep >= 4 ? "bg-medicalPrimary" : "bg-gray-600"
              }`}
            >
              <span className="material-icons text-sm text-white">
                {currentStep > 4 ? "check" : "healing"}
              </span>
            </div>
            <div className="ml-4">
              <h3
                className={`font-semibold ${
                  currentStep >= 4 ? "text-medicalPrimary" : "text-gray-500"
                }`}
              >
                Istruzioni di primo soccorso
              </h3>
              {firstAidInstructions.steps.length > 0 ? (
                <div className="text-sm mt-1">
                  <div className="bg-darkSurface p-3 rounded-lg mb-2 border border-medicalPrimary/30">
                    <h4 className="font-medium mb-2">
                      Istruzioni per:{" "}
                      <span className="text-warning">
                        {firstAidInstructions.condition}
                      </span>
                    </h4>

                    <div className="space-y-3">
                      {firstAidInstructions.steps.map((step, index) => (
                        <div key={index} className="flex">
                          <div className="mr-2 mt-1 bg-medicalSecondary h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-white">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {step.title}
                            </p>
                            <p className="text-xs text-textSecondary">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="w-full mt-3 p-2 bg-medicalSecondary/20 border border-medicalSecondary rounded-lg text-medicalSecondary flex items-center justify-center"
                      onClick={() => setLocation("/guides")}
                    >
                      <span className="material-icons text-sm mr-1">
                        medical_services
                      </span>
                      Vedi guide complete di primo soccorso
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-textSecondary mt-1">
                  Preparazione istruzioni specifiche per l'emergenza...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Assistente AI e Annulla */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            className="bg-darkSurface border border-emergency p-3 rounded-lg flex flex-col items-center justify-center text-emergency"
            onClick={handleCancelEmergency}
          >
            <span className="material-icons text-2xl mb-1">cancel</span>
            <span className="text-sm">Annulla SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
