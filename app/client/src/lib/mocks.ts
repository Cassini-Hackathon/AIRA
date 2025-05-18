import { Location, Guide, WeatherData } from './types';

// Mock location data
export const mockLocation: Location = {
  latitude: 45.4642,
  longitude: 9.1900,
  address: "Via Roma 123, Milano, IT",
  accuracy: 5
};

// Mock guides for offline use
export const mockGuides: Guide[] = [
  {
    id: 1,
    title: "RCP (Rianimazione Cardiopolmonare)",
    category: "Emergenze Cardiache",
    content: {
      description: "Procedure per adulti, bambini e neonati",
      steps: [
        {
          title: "Verifica la sicurezza della scena",
          description: "Assicurati che non ci siano pericoli per te e per la vittima."
        },
        {
          title: "Verifica lo stato di coscienza",
          description: "Chiama la persona e scuotila leggermente. Se non risponde, procedi al passo successivo."
        },
        {
          title: "Chiama aiuto",
          description: "Chiama il 118 o fai chiamare qualcuno mentre inizi le manovre di rianimazione."
        },
        {
          title: "Verifica il respiro",
          description: "Inclina la testa all'indietro e solleva il mento. Osserva, ascolta e senti per non più di 10 secondi."
        },
        {
          title: "Inizia le compressioni toraciche",
          description: "Posiziona le mani al centro del torace. Compressioni di 5-6 cm di profondità a un ritmo di 100-120 al minuto."
        }
      ],
      notes: [
        {
          title: "Importante",
          description: "Continua la RCP finché non arrivano i soccorsi o la persona non mostra segni di vita. Alterna 30 compressioni toraciche a 2 ventilazioni se sei addestrato, altrimenti esegui solo le compressioni."
        }
      ],
      daeSteps: [
        {
          title: "Accendi il DAE",
          description: "Premi il pulsante di accensione e segui le istruzioni vocali."
        },
        {
          title: "Collega gli elettrodi",
          description: "Posiziona gli elettrodi sul torace della vittima come indicato sulle immagini degli elettrodi stessi."
        },
        {
          title: "Analisi del ritmo",
          description: "Assicurati che nessuno tocchi la vittima durante l'analisi."
        },
        {
          title: "Erogazione dello shock",
          description: "Se indicato, assicurati che nessuno tocchi la vittima e premi il pulsante di shock."
        },
        {
          title: "Riprendi la RCP",
          description: "Riprendi immediatamente la RCP dopo lo shock o se non è stato consigliato uno shock."
        }
      ]
    },
    isOfflineAvailable: true,
    imageUrl: "https://pixabay.com/get/gff705815de4480c07c2a1558afe98941ce7ba56b6e445d511e78c89eb2a52114441e48ff996429548c3532cdea590422e1e6ef748a4f1adde35924d6751465cc_1280.jpg",
    videoUrl: "https://pixabay.com/get/ga8d5f030585e3f9fa1a84ca930258fe015300dcedc301c5fdd5fd7e2ec0ea8d77891fb7e18e89ccd221c55f7b8fb6f53d1c10f2f770a5317e1421ee5582ef237_1280.jpg"
  },
  {
    id: 2,
    title: "Controllo delle Emorragie",
    category: "Ferite e Traumi",
    content: {
      description: "Come fermare il sanguinamento e prevenire lo shock",
      steps: [
        {
          title: "Verifica la sicurezza",
          description: "Assicurati che non ci siano pericoli per te e per la vittima."
        },
        {
          title: "Esponi la ferita",
          description: "Rimuovi o taglia i vestiti se necessario per vedere chiaramente la ferita."
        },
        {
          title: "Applica pressione diretta",
          description: "Premi fermamente sulla ferita con un panno pulito o una garza sterile."
        },
        {
          title: "Solleva l'arto",
          description: "Se possibile, alza l'arto ferito sopra il livello del cuore."
        },
        {
          title: "Mantieni la pressione",
          description: "Continua a premere finché il sanguinamento non si ferma."
        }
      ]
    },
    isOfflineAvailable: true,
    imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  },
  {
    id: 3,
    title: "Manovra di Heimlich",
    category: "Soffocamento",
    content: {
      description: "Come intervenire in caso di soffocamento",
      steps: [
        {
          title: "Riconosci i segni",
          description: "La persona non può parlare, tossire o respirare, si afferra la gola."
        },
        {
          title: "Posizionati dietro la vittima",
          description: "Mettiti in piedi dietro la persona e abbracciala a livello della vita."
        },
        {
          title: "Posiziona le mani",
          description: "Fai un pugno con una mano e posizionalo sopra l'ombelico. Afferra il pugno con l'altra mano."
        },
        {
          title: "Spingi verso l'interno e verso l'alto",
          description: "Esegui rapide spinte verso l'interno e verso l'alto."
        },
        {
          title: "Ripeti se necessario",
          description: "Continua finché l'oggetto non viene espulso o la persona non perde conoscenza."
        }
      ]
    },
    isOfflineAvailable: true
  },
  {
    id: 4,
    title: "Ipotermia e Congelamento",
    category: "Emergenze Termiche",
    content: {
      description: "Riconoscimento e primo intervento",
      steps: [
        {
          title: "Riconosci i sintomi",
          description: "Brividi, confusione, sonnolenza, pelle pallida o bluastra."
        },
        {
          title: "Sposta la persona",
          description: "Porta la vittima in un luogo caldo e asciutto."
        },
        {
          title: "Rimuovi vestiti bagnati",
          description: "Togli gli indumenti bagnati e asciuga la persona."
        },
        {
          title: "Riscalda gradualmente",
          description: "Avvolgi la persona in coperte calde, concentrandoti su tronco, collo, testa."
        },
        {
          title: "Somministra bevande calde",
          description: "Se la persona è cosciente, offri bevande calde e zuccherate (non alcoliche)."
        }
      ]
    },
    isOfflineAvailable: true,
    imageUrl: "https://pixabay.com/get/gcd67b25eeb269c0a1718ae2459a17f0830b4cc29b83b399f3246454d7eb7eff0c2b3def62ef31630068662e06168fc8cd228074995ff4849e01d1a49b5af06c1_1280.jpg"
  }
];

// Mock weather data
export const mockWeatherData: WeatherData = {
  temperature: 24,
  condition: "Soleggiato",
  icon: "wb_sunny",
  minTemp: 18,
  maxTemp: 27,
  feelsLike: 26,
  wind: 15,
  humidity: 65,
  visibility: "Buona",
  pressure: 1013,
  alerts: [
    {
      title: "Allerta Temporali",
      description: "Possibili temporali previsti per questa sera. Fare attenzione durante attività all'aperto.",
      validUntil: "martedì, 23:00",
      severity: "warning"
    }
  ],
  forecast: [
    { day: "Oggi", icon: "wb_sunny", condition: "Soleggiato", maxTemp: 24, minTemp: 18 },
    { day: "Mar", icon: "cloud", condition: "Nuvoloso", maxTemp: 22, minTemp: 17 },
    { day: "Mer", icon: "thunderstorm", condition: "Temporali", maxTemp: 20, minTemp: 16 },
    { day: "Gio", icon: "cloudy_snowing", condition: "Pioggia", maxTemp: 19, minTemp: 15 },
    { day: "Ven", icon: "wb_sunny", condition: "Soleggiato", maxTemp: 23, minTemp: 18 }
  ]
};

// Categories for first aid guides
export const guideCategories = [
  { name: "Emergenze Cardiache", icon: "favorite" },
  { name: "Ferite e Traumi", icon: "healing" },
  { name: "Emergenze Termiche", icon: "thermostat" },
  { name: "Soffocamento", icon: "sentiment_very_dissatisfied" }
];

// Mock emergency requests for admin panel
export const mockEmergencyRequests = [
  {
    id: "EM-10293",
    type: "Emergenza Medica",
    address: "Via Torino 45, Milano",
    severity: "Critico",
    time: "10 min fa",
    status: "active"
  },
  {
    id: "EM-10292",
    type: "Incidente Stradale",
    address: "Viale Monza 120, Milano",
    severity: "Medio",
    time: "25 min fa",
    status: "active"
  },
  {
    id: "EM-10291",
    type: "Caduta",
    address: "Via Padova 82, Milano",
    severity: "Basso",
    time: "42 min fa",
    status: "active"
  }
];

// Mock drone deliveries for admin panel
export const mockDroneDeliveries = [
  {
    id: "DRN-05",
    kitType: "Kit Avanzato",
    location: "Parco Sempione, Milano",
    status: "In volo",
    eta: "3 min"
  },
  {
    id: "DRN-12",
    kitType: "Kit Base",
    location: "Via Melchiorre Gioia 8, Milano",
    status: "Preparazione",
    eta: "8 min"
  }
];
