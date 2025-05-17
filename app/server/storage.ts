import { 
  users, type User, type InsertUser,
  emergencyRequests, type EmergencyRequest, type InsertEmergencyRequest,
  droneDeliveries, type DroneDelivery, type InsertDroneDelivery,
  firstAidGuides, type FirstAidGuide, type InsertFirstAidGuide,
  type Location, type WeatherData
} from "@shared/schema";

// Interface for the storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Emergency request operations
  createEmergencyRequest(request: InsertEmergencyRequest): Promise<EmergencyRequest>;
  getEmergencyRequests(): Promise<EmergencyRequest[]>;
  getEmergencyRequestById(id: number): Promise<EmergencyRequest | undefined>;
  updateEmergencyRequestStatus(id: number, status: string): Promise<EmergencyRequest | undefined>;
  
  // Drone delivery operations
  createDroneDelivery(delivery: InsertDroneDelivery): Promise<DroneDelivery>;
  getDroneDeliveries(): Promise<DroneDelivery[]>;
  getDroneDeliveryById(id: number): Promise<DroneDelivery | undefined>;
  updateDroneDeliveryStatus(id: number, status: string): Promise<DroneDelivery | undefined>;
  
  // First aid guides operations
  getFirstAidGuides(): Promise<FirstAidGuide[]>;
  getFirstAidGuideById(id: number): Promise<FirstAidGuide | undefined>;
  getFirstAidGuidesByCategory(category: string): Promise<FirstAidGuide[]>;
  createFirstAidGuide(guide: InsertFirstAidGuide): Promise<FirstAidGuide>;
  
  // Weather data operations
  getWeatherData(location: Location): Promise<WeatherData>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private emergencyRequests: Map<number, EmergencyRequest>;
  private droneDeliveries: Map<number, DroneDelivery>;
  private firstAidGuides: Map<number, FirstAidGuide>;
  private currentUserId: number;
  private currentEmergencyId: number;
  private currentDeliveryId: number;
  private currentGuideId: number;

  constructor() {
    this.users = new Map();
    this.emergencyRequests = new Map();
    this.droneDeliveries = new Map();
    this.firstAidGuides = new Map();
    this.currentUserId = 1;
    this.currentEmergencyId = 1;
    this.currentDeliveryId = 1;
    this.currentGuideId = 1;
    
    // Seed with some initial data
    this.seedUsers();
    this.seedFirstAidGuides();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Emergency request operations
  async createEmergencyRequest(request: InsertEmergencyRequest): Promise<EmergencyRequest> {
    const id = this.currentEmergencyId++;
    const emergencyRequest: EmergencyRequest = { 
      ...request, 
      id, 
      createdAt: new Date() 
    };
    this.emergencyRequests.set(id, emergencyRequest);
    return emergencyRequest;
  }

  async getEmergencyRequests(): Promise<EmergencyRequest[]> {
    return Array.from(this.emergencyRequests.values());
  }

  async getEmergencyRequestById(id: number): Promise<EmergencyRequest | undefined> {
    return this.emergencyRequests.get(id);
  }

  async updateEmergencyRequestStatus(id: number, status: string): Promise<EmergencyRequest | undefined> {
    const request = this.emergencyRequests.get(id);
    if (request) {
      const updatedRequest = { ...request, status };
      this.emergencyRequests.set(id, updatedRequest);
      return updatedRequest;
    }
    return undefined;
  }

  // Drone delivery operations
  async createDroneDelivery(delivery: InsertDroneDelivery): Promise<DroneDelivery> {
    const id = this.currentDeliveryId++;
    const droneDelivery: DroneDelivery = { 
      ...delivery, 
      id, 
      createdAt: new Date() 
    };
    this.droneDeliveries.set(id, droneDelivery);
    return droneDelivery;
  }

  async getDroneDeliveries(): Promise<DroneDelivery[]> {
    return Array.from(this.droneDeliveries.values());
  }

  async getDroneDeliveryById(id: number): Promise<DroneDelivery | undefined> {
    return this.droneDeliveries.get(id);
  }

  async updateDroneDeliveryStatus(id: number, status: string): Promise<DroneDelivery | undefined> {
    const delivery = this.droneDeliveries.get(id);
    if (delivery) {
      const updatedDelivery = { ...delivery, status };
      this.droneDeliveries.set(id, updatedDelivery);
      return updatedDelivery;
    }
    return undefined;
  }

  // First aid guides operations
  async getFirstAidGuides(): Promise<FirstAidGuide[]> {
    return Array.from(this.firstAidGuides.values());
  }

  async getFirstAidGuideById(id: number): Promise<FirstAidGuide | undefined> {
    return this.firstAidGuides.get(id);
  }

  async getFirstAidGuidesByCategory(category: string): Promise<FirstAidGuide[]> {
    return Array.from(this.firstAidGuides.values()).filter(
      (guide) => guide.category === category
    );
  }

  async createFirstAidGuide(guide: InsertFirstAidGuide): Promise<FirstAidGuide> {
    const id = this.currentGuideId++;
    const firstAidGuide: FirstAidGuide = { 
      ...guide, 
      id, 
      createdAt: new Date() 
    };
    this.firstAidGuides.set(id, firstAidGuide);
    return firstAidGuide;
  }

  // Weather data operations
  async getWeatherData(location: Location): Promise<WeatherData> {
    // Mocked weather data
    return {
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
  }

  // Seed methods for initial data
  private seedUsers() {
    // Admin user
    this.users.set(1, {
      id: 1,
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      email: "admin@airaplus.it",
      fullName: "Admin User",
      phone: "",
      address: "",
      bloodType: "",
      allergies: "",
      medicalConditions: "",
      emergencyContact: "",
      isAdmin: true,
      createdAt: new Date()
    });

    // Normal user
    this.users.set(2, {
      id: 2,
      username: "mario",
      password: "password123", // In a real app, this would be hashed
      email: "mario.rossi@example.com",
      fullName: "Mario Rossi",
      phone: "+39 123 456 7890",
      address: "Via Roma 123, Milano, IT",
      bloodType: "B+",
      allergies: "",
      medicalConditions: "",
      emergencyContact: "",
      isAdmin: false,
      createdAt: new Date()
    });
  }

  private seedFirstAidGuides() {
    // RCP Guide
    this.firstAidGuides.set(1, {
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
      videoUrl: "https://pixabay.com/get/ga8d5f030585e3f9fa1a84ca930258fe015300dcedc301c5fdd5fd7e2ec0ea8d77891fb7e18e89ccd221c55f7b8fb6f53d1c10f2f770a5317e1421ee5582ef237_1280.jpg",
      createdAt: new Date()
    });

    // Emorragie Guide
    this.firstAidGuides.set(2, {
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
      imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      videoUrl: "",
      createdAt: new Date()
    });

    // Heimlich Guide
    this.firstAidGuides.set(3, {
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
      isOfflineAvailable: true,
      imageUrl: "",
      videoUrl: "",
      createdAt: new Date()
    });

    // Ipotermia Guide
    this.firstAidGuides.set(4, {
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
      imageUrl: "https://pixabay.com/get/gcd67b25eeb269c0a1718ae2459a17f0830b4cc29b83b399f3246454d7eb7eff0c2b3def62ef31630068662e06168fc8cd228074995ff4849e01d1a49b5af06c1_1280.jpg",
      videoUrl: "",
      createdAt: new Date()
    });
  }
}

export const storage = new MemStorage();
