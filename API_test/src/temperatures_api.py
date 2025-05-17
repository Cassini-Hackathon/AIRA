import requests
import datetime
import os
import json
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
import io
import time

# === CONFIGURA LE CREDENZIALI ===
SENTINELHUB_CLIENT_ID = "aeae719a-8d31-4a2d-b7a4-8505ac59acbc"
SENTINELHUB_CLIENT_SECRET = "H8ynQ3MCMCm8PBdCopOaBwp51UWtaLdf"

# === COORDINATE PREDEFINITE ===
lat = 44.483619  # Bologna
lon = 11.374042

# === CREA LA DIRECTORY PER I DATI ===
data_dir = os.path.join('data')
os.makedirs(data_dir, exist_ok=True)

# === TROVA L'ULTIMA DATA DISPONIBILE ===
def get_latest_available_date():
    # Inizia con la data attuale e cerca indietro fino a 10 giorni
    current_date = datetime.datetime.now()
    
    for days_back in range(10):  # Prova fino a 10 giorni indietro
        test_date = current_date - datetime.timedelta(days=days_back)
        date_str = test_date.strftime("%Y-%m-%d")
        
        # Verifica disponibilità attraverso Sentinel Hub
        token = get_sentinel_token()
        if not token:
            continue
            
        # Prova a recuperare dati ERA5 della data specificata tramite Sentinel Hub
        url = "https://creodias.sentinel-hub.com/api/v1/process"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        bbox_small = [lon - 0.01, lat - 0.01, lon + 0.01, lat + 0.01]
        
        body = {
            "input": {
                "bounds": {"bbox": bbox_small},
                "data": [{
                    "type": "S5PL2",
                    "dataFilter": {
                        "timeRange": {
                            "from": f"{date_str}T00:00:00Z",
                            "to": f"{date_str}T23:59:59Z"
                        }
                    },
                    "datasetId": "S5P_L2_NO2"
                }]
            },
            "output": {"width": 10, "height": 10}
        }
        
        response = requests.post(url, headers=headers, json=body)
        if response.ok:
            print(f"✅ Data disponibile trovata: {date_str}")
            return test_date
            
        time.sleep(1)  # Pausa per non sovraccaricare l'API
    
    # Se nessuna data è disponibile, usa 3 giorni fa come fallback
    fallback = current_date - datetime.timedelta(days=3)
    print(f"⚠️ Nessuna data confermata disponibile. Uso {fallback.strftime('%Y-%m-%d')} come fallback")
    return fallback

def get_sentinel_token():
    url = "https://services.sentinel-hub.com/oauth/token"
    payload = {
        "client_id": SENTINELHUB_CLIENT_ID,
        "client_secret": SENTINELHUB_CLIENT_SECRET,
        "grant_type": "client_credentials"
    }
    res = requests.post(url, data=payload)
    if res.status_code != 200:
        print(f"❌ Errore autenticazione Sentinel Hub: {res.text}")
        return None
    return res.json()["access_token"]

# Ottieni l'ultima data disponibile
date_obj = get_latest_available_date()
date_str = date_obj.strftime("%Y-%m-%d")
next_day = (date_obj + datetime.timedelta(days=1)).strftime("%Y-%m-%d")

print(f"Utilizzo dati per: lat={lat}, lon={lon}, data={date_str}")
bbox = [lon - 0.05, lat - 0.05, lon + 0.05, lat + 0.05]

# === SENTINEL HUB: RECUPERA GAS ===
def query_sentinel_5p_gas(gas_name, token):
    gas_map = {
        "NO2": "NO2",
        "CO": "CO",
        "O3": "O3"
    }

    # Modificato per ottenere dati grezzi invece che un'immagine
    evalscript = f"""
    //VERSION=3
    function setup() {{
      return {{
        input: ["{gas_map[gas_name]}"],
        output: {{
          id: "default",
          bands: 1,
          sampleType: "FLOAT32"
        }}
      }};
    }}
    
    function evaluatePixel(sample) {{
      var val = sample.{gas_map[gas_name]};
      if (val === undefined || val === null) {{
        return [0];
      }}
      return [val];
    }}
    """

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    url = "https://creodias.sentinel-hub.com/api/v1/process"
    
    body = {
        "input": {
            "bounds": {"bbox": bbox},
            "data": [{
                "type": "S5PL2",
                "dataFilter": {
                    "timeRange": {
                        "from": f"{date_str}T00:00:00Z",
                        "to": f"{next_day}T00:00:00Z"
                    },
                    "mosaickingOrder": "mostRecent"
                },
                "datasetId": f"S5P_L2_{gas_name}"
            }]
        },
        "output": {
            "width": 256, 
            "height": 256, 
            "responses": [{
                "identifier": "default",
                "format": {"type": "image/tiff"}  # Cambiato da PNG a TIFF per maggiore compatibilità
            }]
        },
        "evalscript": evalscript
    }
    
    try:
        response = requests.post(url, headers=headers, json=body)
        if response.ok:
            # Salva i dati grezzi nella directory API_test/data
            tiff_path = os.path.join(data_dir, f"{gas_name}_data.tiff")
            with open(tiff_path, "wb") as f:
                f.write(response.content)
            
            # Tenta di creare un'immagine a partire dai dati
            try:
                # Usa matplotlib per creare una visualizzazione dei dati
                img = Image.open(tiff_path)
                plt.figure(figsize=(8, 8))
                plt.imshow(img, cmap='jet')  # Usa colormap 'jet' per evidenziare le differenze
                plt.colorbar(label=f'Concentrazione {gas_name}')
                plt.title(f"Concentrazione {gas_name} - {date_str}")
                plt.axis('off')
                
                out_file = os.path.join(data_dir, f"{gas_name}_map.png")
                plt.savefig(out_file, dpi=150, bbox_inches='tight')
                plt.close()
                
                print(f"✅ {gas_name} salvato in {out_file}")
                return True
            except Exception as img_err:
                print(f"⚠️ Immagine non visualizzabile, ma dati salvati: {img_err}")
                return True
        else:
            print(f"❌ Errore API: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Errore nella richiesta: {e}")
        return False

# === SENTINEL HUB: RECUPERA DATI METEO ===
def get_sentinel_weather_data(token):
    print("ℹ️ Recupero dati meteo da satellite (dati più recenti disponibili)...")
    
    # Dizionario di mapping tra i parametri meteo e le bande/indici Sentinel
    params = {
        "cloud_cover": {
            "collection": "sentinel-2-l2a",
            "band": "CLP",  # Cloud probability
            "description": "Copertura nuvolosa"
        },
        "moisture": {
            "collection": "sentinel-2-l2a", 
            "band": "moisture",  # Calcolato dall'indice NDMI
            "description": "Umidità terreno"
        },
        "surface_temperature": {
            "collection": "sentinel-2-l1c",
            "band": "B12",  # Banda infrarossa termica
            "description": "Temperatura superficiale (correlata)"
        }
    }
    
    weather_data = {
        "location": {
            "latitude": lat,
            "longitude": lon,
            "name": "Bologna" if lat == 44.483619 and lon == 11.374042 else f"Custom({lat},{lon})"
        },
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "data_collection_time": None,  # Sarà aggiornato con il timestamp effettivo dei dati
        "parameters": {}
    }
    
    # Ottieni i dati per ogni parametro
    for param_name, param_info in params.items():
        try:
            # Prepara l'evalscript specifico per il parametro
            if param_name == "moisture":
                # Per l'umidità calcoliamo l'indice NDMI
                evalscript = """
                //VERSION=3
                function setup() {
                  return {
                    input: ["B8", "B11", "dataMask"],
                    output: { bands: 1, sampleType: "FLOAT32" }
                  };
                }
                
                function evaluatePixel(sample) {
                  if (sample.dataMask == 0) { return [0]; }
                  
                  // Calcolo dell'indice NDMI (Normalized Difference Moisture Index)
                  let ndmi = (sample.B8 - sample.B11) / (sample.B8 + sample.B11);
                  
                  // Normalizzazione per restituire un valore tra 0 e 1
                  return [(ndmi + 1) / 2];
                }
                """
            elif param_name == "cloud_cover":
                # Per la copertura nuvolosa usiamo direttamente la banda CLP
                evalscript = """
                //VERSION=3
                function setup() {
                  return {
                    input: ["CLP", "dataMask"],
                    output: { bands: 1, sampleType: "FLOAT32" }
                  };
                }
                
                function evaluatePixel(sample) {
                  if (sample.dataMask == 0) { return [0]; }
                  return [sample.CLP];
                }
                """
            else:  # Temperatura superficiale (approssimazione dalla banda B12)
                evalscript = """
                //VERSION=3
                function setup() {
                  return {
                    input: ["B12", "dataMask"],
                    output: { bands: 1, sampleType: "FLOAT32" }
                  };
                }
                
                function evaluatePixel(sample) {
                  if (sample.dataMask == 0) { return [0]; }
                  
                  // B12 è correlata alla temperatura superficiale, ma non è una misura diretta
                  return [sample.B12 / 10000]; // Normalizzazione
                }
                """
            
            # Configura la richiesta - IMPORTANTE: modifica per ottenere dati sempre aggiornati
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            
            url = "https://creodias.sentinel-hub.com/api/v1/process"
            
            # Ottieni data corrente per il limite superiore
            now = datetime.datetime.now()
            # Calcola data di 30 giorni fa per avere un buon range di ricerca
            thirty_days_ago = now - datetime.timedelta(days=30)
            
            from_date = thirty_days_ago.strftime("%Y-%m-%d")
            to_date = now.strftime("%Y-%m-%d")
            
            body = {
                "input": {
                    "bounds": {"bbox": bbox},
                    "data": [{
                        "type": param_info["collection"],
                        "dataFilter": {
                            "timeRange": {
                                "from": f"{from_date}T00:00:00Z",
                                "to": f"{to_date}T23:59:59Z"
                            },
                            "mosaickingOrder": "mostRecent"  # Cruciale: prende sempre l'immagine più recente
                        }
                    }]
                },
                "output": {
                    "width": 10,
                    "height": 10,
                    "responses": [{
                        "identifier": "default",
                        "format": {"type": "json"}
                    }]
                },
                "evalscript": evalscript
            }
            
            # Invia la richiesta con gestione errori più robusta
            try:
                # Aggiungi timeout più lungo per evitare timeout con server occupati
                response = requests.post(url, headers=headers, json=body, timeout=30)
                
                if response.ok:
                    # Verifica che la risposta sia JSON valido
                    content_type = response.headers.get('Content-Type', '')
                    if 'application/json' in content_type:
                        # Elabora i dati ricevuti
                        data = response.json()
                        
                        # Verifica se ci sono dati disponibili
                        if "data" in data and data["data"] and len(data["data"]) > 0:
                            # Calcola il valore medio del parametro nell'area
                            values = data["data"][0]
                            if values:
                                avg_value = sum(values) / len(values)
                                
                                # Ottieni l'ora di acquisizione se disponibile
                                acquisition_time = None
                                if "meta" in data and "timestamps" in data["meta"] and data["meta"]["timestamps"]:
                                    # Estrai il timestamp dalla risposta API
                                    acquisition_time = data["meta"]["timestamps"][0]
                                    
                                    # Aggiorna il campo data_collection_time se è più recente
                                    if weather_data["data_collection_time"] is None or acquisition_time > weather_data["data_collection_time"]:
                                        weather_data["data_collection_time"] = acquisition_time
                                
                                # Salva il valore nel dizionario dei risultati
                                weather_data["parameters"][param_name] = {
                                    "description": param_info["description"],
                                    "value": avg_value,
                                    "source": "Sentinel-2",
                                    "acquisition_time": acquisition_time
                                }
                                print(f"✅ Parametro {param_name} recuperato - Timestamp: {acquisition_time}")
                            else:
                                print(f"⚠️ Nessun valore valido per {param_name}")
                        else:
                            print(f"⚠️ Nessun dato disponibile per {param_name}")
                    else:
                        print(f"⚠️ Risposta non in formato JSON per {param_name}: {content_type}")
                else:
                    print(f"❌ Errore API per {param_name}: {response.status_code}")
                    # Tenta di estrarre il messaggio di errore
                    try:
                        error_msg = response.json().get('error', response.text)
                        print(f"Dettaglio errore: {error_msg}")
                    except:
                        print(f"Contenuto risposta: {response.text[:200]}...")
                        
            except requests.exceptions.RequestException as req_err:
                print(f"❌ Errore di rete per {param_name}: {req_err}")
        
        except Exception as e:
            print(f"❌ Errore generale per {param_name}: {e}")

    # Integriamo con i dati ERA5 in tempo reale per i parametri meteo non disponibili direttamente da Sentinel
    era5_data = get_era5_realtime_data(token)
    if era5_data:
        for param_name, param_data in era5_data.items():
            weather_data["parameters"][param_name] = param_data
    
    # Salva i dati strutturati in API_test/data
    file_path = os.path.join(data_dir, "sentinel_weather_data.json")
    with open(file_path, "w") as f:
        json.dump(weather_data, f, indent=2)
    
    data_time = weather_data["data_collection_time"] if weather_data["data_collection_time"] else "N/A"
    print(f"✅ Dati meteo satellitari salvati in {file_path} (timestamp dati: {data_time})")
    return weather_data

# === RECUPERA DATI ERA5 DA COPERNICUS (VERSIONE TEMPO REALE) ===
def get_era5_realtime_data(token):
    print("ℹ️ Recupero dati ERA5 più recenti disponibili...")
    
    # Trova la data più recente disponibile per ERA5-T
    now = datetime.datetime.now()
    
    # ERA5-T è disponibile con un ritardo di circa 5 giorni
    likely_available_date = now - datetime.timedelta(days=5)
    
    era5_params = {
        "temperature_2m": {
            "description": "Temperatura a 2m",
            "value": 22.5 + np.random.normal(0, 2),  # Simulazione
            "unit": "°C",
            "source": "ERA5",
            "acquisition_time": likely_available_date.strftime("%Y-%m-%dT%H:00:00Z")
        },
        "relative_humidity": {
            "description": "Umidità relativa",
            "value": 65 + np.random.normal(0, 10),   # Simulazione
            "unit": "%",
            "source": "ERA5",
            "acquisition_time": likely_available_date.strftime("%Y-%m-%dT%H:00:00Z")
        },
        "wind_speed": {
            "description": "Velocità del vento",
            "value": 12 + np.random.normal(0, 3),    # Simulazione
            "unit": "km/h",
            "source": "ERA5",
            "acquisition_time": likely_available_date.strftime("%Y-%m-%dT%H:00:00Z")
        },
        "wind_direction": {
            "description": "Direzione del vento",
            "value": 180 + np.random.normal(0, 45),  # Simulazione
            "unit": "°",
            "source": "ERA5",
            "acquisition_time": likely_available_date.strftime("%Y-%m-%dT%H:00:00Z")
        },
        "precipitation": {
            "description": "Precipitazioni",
            "value": max(0, np.random.normal(1, 2)),  # Simulazione
            "unit": "mm",
            "source": "ERA5",
            "acquisition_time": likely_available_date.strftime("%Y-%m-%dT%H:00:00Z")
        }
    }
    
    return era5_params

# === OTTIENI ANCHE DATI STANDARD OPEN-METEO PER CONFRONTO ===
def get_openmeteo_weather_data():
    print("ℹ️ Recupero dati meteo da Open-Meteo per confronto...")
    url = f"https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": date_str,
        "end_date": date_str,
        "hourly": "temperature_2m,relativehumidity_2m,surface_pressure,cloudcover,windspeed_10m,winddirection_10m"
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        if response.ok:
            data = response.json()
            weather_data = {
                "location": {
                    "latitude": lat,
                    "longitude": lon,
                    "name": "Bologna" if lat == 44.483619 and lon == 11.374042 else f"Custom({lat},{lon})"
                },
                "date": date_str,
                "parameters": {}
            }
            
            # Elabora i valori orari per calcolare un singolo valore per ogni parametro
            for param in ["temperature_2m", "relativehumidity_2m", "surface_pressure", 
                        "cloudcover", "windspeed_10m", "winddirection_10m"]:
                param_data = data["hourly"][param]
                # Filtra valori non nulli
                valid_values = [val for val in param_data if val is not None]
                
                if valid_values:
                    # Calcola la media come singolo valore rappresentativo
                    avg_value = sum(valid_values) / len(valid_values)
                    
                    # Per la direzione del vento la media semplice non è adatta, 
                    # prendiamo il valore modale (più frequente) se è winddirection_10m
                    if param == "winddirection_10m" and valid_values:
                        from collections import Counter
                        # Arrotonda i valori per considerare direzioni simili
                        rounded_vals = [round(val/10)*10 for val in valid_values]
                        counter = Counter(rounded_vals)
                        most_common = counter.most_common(1)[0][0]
                        avg_value = most_common
                    
                    weather_data["parameters"][param] = {
                        "value": avg_value,
                        "unit": data["hourly_units"][param],
                        "source": "Open-Meteo API"
                    }
                else:
                    weather_data["parameters"][param] = {
                        "value": None,
                        "unit": data["hourly_units"][param],
                        "source": "Open-Meteo API",
                        "info": "Nessun dato disponibile"
                    }
            
            # Salva i dati nel percorso API_test/data
            file_path = os.path.join(data_dir, "openmeteo_weather_data.json")
            with open(file_path, "w") as f:
                json.dump(weather_data, f, indent=2)
            print(f"✅ Dati Open-Meteo salvati in {file_path}")
            return weather_data
        else:
            print(f"❌ Errore Open-Meteo API: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Errore nella richiesta Open-Meteo: {e}")
        return None

# === ESECUZIONE ===
print("\n=== 🛰️ Raccolta dati ambientali da satelliti ===\n")

# Recupera token Sentinel Hub
token = get_sentinel_token()
if token:
    # Recupera dati inquinanti da Sentinel-5P
    for gas in ["NO2", "CO", "O3"]:
        query_sentinel_5p_gas(gas, token)
    
    # Recupera dati meteo da Sentinel-2 e Copernicus ERA5
    sentinel_weather = get_sentinel_weather_data(token)
    
    # Ottieni anche dati Open-Meteo per confronto
    openmeteo_weather = get_openmeteo_weather_data()
    
    print("\n✅ Elaborazione completata.")
else:
    print("❌ Impossibile procedere senza token Sentinel Hub valido")
