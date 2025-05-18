# 🚑 AIRA+ (Advanced Integrated Response & Aid Assistant)

## 🚨 Overview

**AIRA+** is an AI-powered, satellite-enhanced emergency response system designed to revolutionize the way critical medical help is requested, dispatched, and managed.  
When every second counts, AIRA+ ensures rapid coordination between users, healthcare providers, and emergency vehicles—both manned and unmanned—through intelligent automation and satellite connectivity.

---

## 🧠 Core Features

### ✅ Smart Emergency Request Initiation
Users can trigger a distress signal in two intuitive ways:
- 📞 Traditional voice call to emergency services (e.g. 118)
- 🤖 AI-assisted reporting: Describe the situation using voice notes, text, or photos.

**Technologies used:**
- 🗣️ Speech-to-text: Transcription powered by [OpenAI Whisper](https://github.com/openai/whisper)
- 🖼️ Image captioning: Situation inferred via [BLIP (Bootstrapping Language Image Pretraining)](https://huggingface.co/Salesforce/blip-image-captioning-base)

---

### 🚑 Autonomous Dispatch Algorithm
AIRA+ intelligently assesses the emergency type and orchestrates the most effective response by:
- Analyzing resource availability
- Calculating real-time proximity via satellite geolocalization
- Initiating autonomous dispatch of appropriate assets (ambulances, helicopters, or drones equipped with first aid kits, AEDs, and life-saving medications)

---

### ✈️ Satellite-Enhanced Routing
Our routing engine dynamically optimizes both aerial and ground paths, considering:
- Real-time weather conditions
- Terrain morphology and accessibility
- Airspace and road traffic data

---

### 🏥 Hospital Control Panel
Every healthcare facility is equipped with a powerful admin dashboard that includes:
- Real-time asset tracking map (vehicles, drones, etc.)
- Emergency history with patient and medical details
- Inventory of operational assets with data on:
  - Battery/fuel levels
  - Maintenance logs
  - Availability status

---

## 🛠️ Tech Stack

- **Frontend:** TypeScript + React  
- **Mobile Stack:** Capacitor (cross-platform compatibility)  
- **Backend:** Python, Firebase (Authentication + Realtime DB), FastAPI  
- **AI/ML Models:**
  - [Whisper](https://github.com/openai/whisper) for speech-to-text  
  - [BLIP](https://huggingface.co/Salesforce/blip-image-captioning-base) for image-to-text

---

## 🌍 Use of Space Technologies

- **Copernicus CDS** for weather data  
- **Satellite GNSS** for accurate user geolocation and routing

---

## 🎯 Impact

AIRA+ aims to **shorten emergency response time**, especially in **remote, rural, or disaster-affected areas**, where infrastructure is scarce or overwhelmed.  
With AI-driven triage and satellite-based logistics, we empower emergency responders to act **smarter**, **faster**, and more **efficiently**, ultimately **saving more lives**.

---

## 👥 Participants

- **Nicola Ricci Maccarini**  
  BSc student in Computer Science at University of Ferrara  
  *AI/ML Engineer*

- **Alessio Ganzarolli**  
  BSc student in Computer Science at University of Ferrara  
  *Full-Stack Web Developer*

- **Alessio Prato**  
  BSc student in Computer Science at Alma Mater Studiorum Bologna  
  *UNIBO Motorsport Team Member, Software Engineer*

- **Leonardo Pinna**  
  BSc student in Computer Science at Alma Mater Studiorum Bologna  
  *YouTube Content Creator, Software Engineer*

- **Alessandro Marcellini**  
  BSc student in Computer Engineering at Alma Mater Studiorum Bologna  
  *UNIBO Motorsport Team Member, Backend Developer*
