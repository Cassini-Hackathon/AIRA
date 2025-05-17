# SETUP
creazione ambiente virtuale python:
- python -m venv "nome_venv"
- cd nome_venv
- Scripts\activate
- cd "your_project"
- git clone "https...."
- cd AIRA
- cd backend
- pip install -r requirements.txt

# AIRA+ - Guida al Progetto

AIRA+ (Advanced Integrated Response & Aid Assistant) è una piattaforma mobile-first con funzionalità offline progettata per aiutare i cittadini a fornire primo soccorso in aree critiche. L'applicazione coordina la consegna intelligente di medicinali o kit di primo soccorso tramite droni, supportata da dati spaziali e intelligenza artificiale.

## Requisiti

- Node.js 18+ (consigliato Node.js 20)
- npm 8+

## Tecnologie Utilizzate

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Drizzle ORM
- **Mobile**: Capacitor
- **Database**: PostgreSQL (in fase di sviluppo è utilizzato un database in-memory)

## Setup del Progetto

### 1. Installazione delle Dipendenze

```bash
# Clona il repository
git clone https://github.com/tuo-username/airaplus.git
cd airaplus

# Installa le dipendenze
npm install
```

### 2. Avvio in Modalità Sviluppo

```bash
# Avvia il server di sviluppo
npm run dev
```

Questo comando avvierà:
- Il server backend Express sulla porta 5000
- Il frontend Vite con Hot Module Replacement

### 3. Build per la Produzione

```bash
# Crea una build ottimizzata per la produzione
npm run build
```

Questo comando:
1. Builderà il frontend React con Vite
2. Ottimizzerà i bundle per la produzione
3. Genererà gli assets nella cartella `dist`

### 4. Avvio in Produzione

```bash
# Avvia l'applicazione in modalità produzione
npm start
```

## Integrazione Capacitor (App Mobile)

Per creare build native per iOS e Android:

### 1. Setup Iniziale di Capacitor

```bash
# Aggiungi le piattaforme desiderate
npx cap add android
npx cap add ios
```

### 2. Sincronizza le Build con Capacitor

```bash
# Prima crea una build
npm run build

# Poi sincronizza le modifiche con le piattaforme native
npx cap sync
```

### 3. Apri i Progetti Nativi

```bash
# Apri il progetto Android Studio
npx cap open android

# Apri il progetto Xcode
npx cap open ios
```

## Struttura del Progetto

```
├── client/             # Codice frontend
│   ├── src/            # Sorgenti React
│   │   ├── components/ # Componenti UI riutilizzabili
│   │   ├── context/    # Gestione dello stato globale
│   │   ├── hooks/      # Custom hooks
│   │   ├── lib/        # Utility e helpers
│   │   ├── pages/      # Componenti pagina
│   │   └── App.tsx     # Componente principale
├── server/             # Codice backend
│   ├── index.ts        # Entry point del server
│   ├── routes.ts       # Definizione delle API routes
│   ├── storage.ts      # Interfaccia per lo storage dati
│   └── vite.ts         # Configurazione di Vite in dev
├── shared/             # Codice condiviso
│   └── schema.ts       # Schema del database e tipi
├── capacitor.config.ts # Configurazione di Capacitor
└── ...                 # Altri file di configurazione
```

## API Disponibili

### Autenticazione
- `POST /api/auth/login` - Login utente
- `POST /api/auth/register` - Registrazione utente

### Emergenze
- `POST /api/emergency` - Crea richiesta di emergenza
- `GET /api/emergency` - Lista richieste emergenza
- `GET /api/emergency/:id` - Dettaglio richiesta emergenza

### Droni
- `POST /api/drone-delivery` - Richiedi kit medico via drone
- `GET /api/drone-delivery` - Lista consegne drone
- `GET /api/drone-delivery/:id` - Dettaglio consegna drone

### Guide Primo Soccorso
- `GET /api/guides` - Lista guide primo soccorso
- `GET /api/guides/:id` - Dettaglio guida primo soccorso

### Meteo
- `POST /api/weather` - Dati meteo in base alla posizione

## Feature API Native (Capacitor)

AIRA+ utilizza Capacitor per accedere alle funzionalità native del dispositivo:

- **Geolocation**: Per ottenere la posizione precisa dell'utente
- **Network**: Per monitorare lo stato di connessione
- **Device**: Per ottenere informazioni sul dispositivo
- **App**: Per gestire il ciclo di vita dell'app

## Nota sullo Sviluppo

Durante lo sviluppo, il database è simulato in memoria con `MemStorage`. In produzione, è possibile configurare un database PostgreSQL modificando le variabili d'ambiente.

## Variabili d'Ambiente

Crea un file `.env` nella root del progetto con le seguenti variabili:

```
# Server
PORT=5000
NODE_ENV=development

# Database (per produzione)
DATABASE_URL=postgresql://username:password@localhost:5432/airaplus

# Sicurezza
SESSION_SECRET=il_tuo_secret_sicuro
```

## Comandi Utili

- `npm run dev` - Avvia in modalità sviluppo
- `npm run build` - Crea build per produzione
- `npm start` - Avvia in produzione
- `npm run lint` - Esegue il linting del codice
- `npm run test` - Esegue i test
- `npx drizzle-kit generate` - Genera migrazioni del DB
- `npx drizzle-kit push` - Applica migrazioni al DB

## Contribuire al Progetto

1. Effettua il fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/amazing-feature`)
3. Committa le tue modifiche (`git commit -m 'Add some amazing feature'`)
4. Pusha sul branch (`git push origin feature/amazing-feature`)
5. Apri una Pull Request

## Licenza

Questo progetto è sotto licenza MIT - vedi il file LICENSE per i dettagli.
