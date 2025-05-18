# functions to fetch the data from the satellites at startup
import os
import datetime
from dotenv import load_dotenv
import requests
import time
import json
import numpy as np
from datetime import timedelta

parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(parent_dir, '.env'))

SENTINELHUB_CLIENT_ID = os.getenv("SENTINELHUB_CLIENT_ID") 
SENTINELHUB_CLIENT_SECRET = os.getenv("SENTINELHUB_CLIENT_SECRET")

data_dir = os.path.join(os.getcwd(), '..', '..', 'copernicus_data')
os.makedirs(data_dir, exist_ok=True)

# === COORDINATE PREDEFINITE Bologna ===
lat = 44.483619
lon = 11.374042

bbox = [lon - 0.05, lat - 0.05, lon + 0.05, lat + 0.05]


def divide_coord_square_into_small_squares(box_coordinates, step=0.01):
    """
    Divide a square (or rectangle) defined by box_coordinates into smaller squares.
    
    Parameters:
        box_coordinates (list): List of four [lat, lon] points defining the square.
        step (float): Size of each small square in degrees (default 0.01).
        
    Returns:
        list: A list of smaller squares, each defined by four [lat, lon] corners.
    """
    # Get the bounding box lat/lon
    lats = [point[0] for point in box_coordinates]
    lons = [point[1] for point in box_coordinates]
    
    min_lat, max_lat = min(lats), max(lats)
    min_lon, max_lon = min(lons), max(lons)

    squares = []

    lat = min_lat
    while lat < max_lat:
        next_lat = min(lat + step, max_lat)
        lon = min_lon
        while lon < max_lon:
            next_lon = min(lon + step, max_lon)
            # Define square with 4 points (clockwise)
            square = [
                [lat, lon],
                [lat, next_lon],
                [next_lat, next_lon],
                [next_lat, lon]
            ]
            squares.append(square)
            lon += step
        lat += step
    
    return squares

# def get_latest_available_date(): #finds the latest available date for the satellite data
#     # Inizia con la data attuale e cerca indietro fino a 10 giorni
#     current_date = datetime.datetime.now()
    
#     for days_back in range(10):  # Prova fino a 10 giorni indietro
#         test_date = current_date - datetime.timedelta(days=days_back)
#         date_str = test_date.strftime("%Y-%m-%d")
        
#         # Verifica disponibilità attraverso Sentinel Hub
#         token = get_sentinel_token()
#         if not token:
#             continue
            
#         # Prova a recuperare dati ERA5 della data specificata tramite Sentinel Hub
#         url = "https://creodias.sentinel-hub.com/api/v1/process"
#         headers = {
#             "Authorization": f"Bearer {token}",
#             "Content-Type": "application/json"
#         }
        
#         bbox_small = [lon - 0.01, lat - 0.01, lon + 0.01, lat + 0.01]
        
#         body = {
#             "input": {
#                 "bounds": {"bbox": bbox_small},
#                 "data": [{
#                     "type": "S5PL2",
#                     "dataFilter": {
#                         "timeRange": {
#                             "from": f"{date_str}T00:00:00Z",
#                             "to": f"{date_str}T23:59:59Z"
#                         }
#                     },
#                     "datasetId": "S5P_L2_NO2"
#                 }]
#             },
#             "output": {"width": 10, "height": 10}
#         }
        
#         response = requests.post(url, headers=headers, json=body)
#         if response.ok:
#             print(f"✅ Data disponibile trovata: {date_str}")
#             return test_date
            
#         time.sleep(1)  # Pausa per non sovraccaricare l'API
    
#     # Se nessuna data è disponibile, usa 3 giorni fa come fallback
#     fallback = current_date - datetime.timedelta(days=3)
#     print(f"⚠️ Nessuna data confermata disponibile. Uso {fallback.strftime('%Y-%m-%d')} come fallback")
#     return fallback

def get_sentinel_token():
    url = "https://services.sentinel-hub.com/oauth/token"
    payload = {
        "client_id": SENTINELHUB_CLIENT_ID,
        "client_secret": SENTINELHUB_CLIENT_SECRET,
        "grant_type": "client_credentials"
    }
    res = requests.post(url, data=payload)
    if res.status_code != 200:
        print(f"Errore autenticazione Sentinel Hub: {res.text}")
        return None
    return res.json()["access_token"]


# === SENTINEL HUB: RECUPERA DATI METEO ===
def get_sentinel_weather_data(token):
    print("Recupero dati meteo da satellite (dati più recenti disponibili)...")
    
    # Dizionario di mapping tra i parametri meteo e le bande/indici Sentinel
    # params = {
    #     "cloud_cover": {
    #         "collection": "sentinel-2-l2a",
    #         "band": "CLP",  # Cloud probability
    #         "description": "Copertura nuvolosa"
    #     },
    #     "moisture": {
    #         "collection": "sentinel-2-l2a", 
    #         "band": "moisture",  # Calcolato dall'indice NDMI
    #         "description": "Umidità terreno"
    #     },
    #     "surface_temperature": {
    #         "collection": "sentinel-2-l1c",
    #         "band": "B12",  # Banda infrarossa termica
    #         "description": "Temperatura superficiale (correlata)"
    #     }
    # }
    
    weather_data = {
        "location": {
            "latitude": lat, #TODO complete lat
            "longitude": lon, #TODO complete lon
            "name": "Bologna" if lat == 44.483619 and lon == 11.374042 else f"Custom({lat},{lon})"
        },
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "data_collection_time": None,  # Sarà aggiornato con il timestamp effettivo dei dati
        "parameters": {}
    }
    
    # # Ottieni i dati per ogni parametro
    # for param_name, param_info in params.items():
    #     try:
    #         # Prepara l'evalscript specifico per il parametro
    #         if param_name == "moisture":
    #             # Per l'umidità calcoliamo l'indice NDMI
    #             evalscript = """
    #             //VERSION=3
    #             function setup() {
    #               return {
    #                 input: ["B8", "B11", "dataMask"],
    #                 output: { bands: 1, sampleType: "FLOAT32" }
    #               };
    #             }
                
    #             function evaluatePixel(sample) {
    #               if (sample.dataMask == 0) { return [0]; }
                  
    #               // Calcolo dell'indice NDMI (Normalized Difference Moisture Index)
    #               let ndmi = (sample.B8 - sample.B11) / (sample.B8 + sample.B11);
                  
    #               // Normalizzazione per restituire un valore tra 0 e 1
    #               return [(ndmi + 1) / 2];
    #             }
    #             """
    #         elif param_name == "cloud_cover":
    #             # Per la copertura nuvolosa usiamo direttamente la banda CLP
    #             evalscript = """
    #             //VERSION=3
    #             function setup() {
    #               return {
    #                 input: ["CLP", "dataMask"],
    #                 output: { bands: 1, sampleType: "FLOAT32" }
    #               };
    #             }
                
    #             function evaluatePixel(sample) {
    #               if (sample.dataMask == 0) { return [0]; }
    #               return [sample.CLP];
    #             }
    #             """
    #         else:  # Temperatura superficiale (approssimazione dalla banda B12)
    #             evalscript = """
    #             //VERSION=3
    #             function setup() {
    #               return {
    #                 input: ["B12", "dataMask"],
    #                 output: { bands: 1, sampleType: "FLOAT32" }
    #               };
    #             }
                
    #             function evaluatePixel(sample) {
    #               if (sample.dataMask == 0) { return [0]; }
                  
    #               // B12 è correlata alla temperatura superficiale, ma non è una misura diretta
    #               return [sample.B12 / 10000]; // Normalizzazione
    #             }
    #             """
            
    #         # Configura la richiesta - IMPORTANTE: modifica per ottenere dati sempre aggiornati
    #         headers = {
    #             "Authorization": f"Bearer {token}",
    #             "Content-Type": "application/json"
    #         }
            
    #         url = "https://creodias.sentinel-hub.com/api/v1/process"
            
    #         # Ottieni data corrente
    #         now = datetime.datetime.now()

    #         one_hour_ago = now - datetime.timedelta(hours=1)

    #         from_timestamp = one_hour_ago.strftime("%Y-%m-%dT%H:%M:%SZ")
    #         to_timestamp = now.strftime("%Y-%m-%dT%H:%M:%SZ")

    #         from_timestamp = one_hour_ago.strftime("%Y-%m-%dT%H:%M:%SZ")
    #         to_timestamp = now.strftime("%Y-%m-%dT%H:%M:%SZ")
            
    #         body = {
    #             "input": {
    #                 "bounds": {"bbox": bbox},
    #                 "data": [{
    #                     "type": param_info["collection"],
    #                     "dataFilter": {
    #                         "timeRange": {
    #                             "from": from_timestamp,
    #                             "to": to_timestamp
    #                         },
    #                         "mosaickingOrder": "mostRecent"  # Cruciale: prende sempre l'immagine più recente
    #                     }
    #                 }]
    #             },
    #             "output": {
    #                 "width": 10,
    #                 "height": 10,
    #                 "responses": [{
    #                     "identifier": "default",
    #                     "format": {"type": "json"}
    #                 }]
    #             },
    #             "evalscript": evalscript
    #         }
            
    #         # Invia la richiesta con gestione errori più robusta
    #         try:
    #             # Aggiungi timeout più lungo per evitare timeout con server occupati
    #             response = requests.post(url, headers=headers, json=body, timeout=30)
                
    #             if response.ok:
    #                 # Verifica che la risposta sia JSON valido
    #                 content_type = response.headers.get('Content-Type', '')
    #                 if 'application/json' in content_type:
    #                     # Elabora i dati ricevuti
    #                     data = response.json()
    #                     return data
    #                 else:
    #                     raise Exception("Non ci sono dati")
    #             else:
    #                 print(f"❌ Errore API per {param_name}: {response.status_code}")
    #                 # Tenta di estrarre il messaggio di errore
    #                 try:
    #                     error_msg = response.json().get('error', response.text)
    #                     print(f"Dettaglio errore: {error_msg}")
    #                 except:
    #                     print(f"Contenuto risposta: {response.text[:200]}...")
                        
    #         except requests.exceptions.RequestException as req_err:
    #             print(f"❌ Errore di rete per {param_name}: {req_err}")
        
    #     except Exception as e:
    #         print(f"❌ Errore generale per {param_name}: {e}")


    # Integriamo con i dati ERA5 in tempo reale per i parametri meteo non disponibili direttamente da Sentinel
    era5_data = get_era5_realtime_data(token)
    if era5_data:
        for param_name, param_data in era5_data.items():
            weather_data["parameters"][param_name] = param_data
    return weather_data

def get_era5_realtime_data(token):
    print("Recupero dati ERA5 più recenti disponibili...")
    
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


def calc_avg_of_data_in_chunk(complete_data):
    # Verifica se ci sono dati disponibili
    if "data" in data and data["data"] and len(data["data"]) > 0:
        # Calcola il valore medio del parametro nell'area
        values = data["data"][0]
        if values:
            avg_value = sum(values) / len(values) #TODO, non lo voglio avg, voglio i dati per zona, magari divido la mappa in blocchi e faccio avg per blocco
            
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

def save_to_file(weather_data):
    # svuota la cartella di destinazione
    for filename in os.listdir(data_dir):
        file_path = os.path.join(data_dir, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)

    # Salva i dati strutturati in API_test/data
    file_path = os.path.join(data_dir, f'sentinel_weather_data{datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")}.json')
    with open(file_path, "w") as f:
        json.dump(weather_data, f, indent=2)
    
    print(f"Dati meteo satellitari salvati in {file_path}")
    return weather_data


def load_data():
    # Recupera token Sentinel Hub
    token = get_sentinel_token()
    if token:    
        # Recupera dati meteo da Sentinel-2 e Copernicus ERA5
        # complete_data = get_sentinel_weather_data(token)
        # print("\n\nDATI\n\n")
        # print(f"\n\n{complete_data}\n\n")

        box_coordinates = [
            [44.5400, 11.2500],
            [44.5400, 11.4200],
            [44.4600, 11.4200],
            [44.4600, 11.2500]
        ]

        # divide the map in chunks
        squares = divide_coord_square_into_small_squares(box_coordinates)
        print(f"numero quadrati mappa: {len(squares) * len(squares[0])}")
        i = 0
        chunks_with_data = {}
        # for each chunk associate precipitation value
        for square in squares:
            chunks_with_data[i] = {
                    "coords": square,
                    "precipitation_value_avg": np.random.uniform(1, 2), # generate number between 1 and 2
                }
            i += 1
        print(chunks_with_data[0])

        #save data to file
        save_to_file(chunks_with_data)

        print("\nElaborazione completata.")
        return chunks_with_data
    else:
        print("Impossibile procedere senza token Sentinel Hub valido")
