import requests
import json

def get_location_coordinates(city):
    # Utilizzo di OpenStreetMap Nominatim per il geocoding
    url = f'https://nominatim.openstreetmap.org/search?q={city}&format=json'
    headers = {'User-Agent': 'Mozilla/5.0'}  # Aggiungi un User-Agent
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Solleva un'eccezione per errori HTTP
        data = response.json()
        if data:
            return float(data[0]['lat']), float(data[0]['lon'])
    except requests.exceptions.RequestException as e:
        print(f"Errore durante la richiesta: {e}")
    return None, None

def find_nearby_places(lat, lon, place_type):
    # Utilizzo di OpenStreetMap Overpass API per trovare luoghi nelle vicinanze
    query = f'[out:json][timeout:25];(node["amenity"="{place_type}"](around:5000,{lat},{lon}););out body;>;out skel qt;'
    url = 'https://overpass-api.de/api/interpreter'
    try:
        response = requests.post(url, data=query)
        response.raise_for_status()  # Solleva un'eccezione per errori HTTP
        data = response.json()
        return data['elements']
    except requests.exceptions.RequestException as e:
        print(f"Errore durante la richiesta: {e}")
    return []

def get_nearby_defibrillators_and_medical_centers(city):
    lat, lon = get_location_coordinates(city)
    if lat is None or lon is None:
        return json.dumps({"error": "Città non trovata."})
    
    defibrillators = find_nearby_places(lat, lon, 'defibrillator')
    medical_centers = find_nearby_places(lat, lon, 'clinic')
    
    # Formatta i risultati in JSON
    results = {
        'defibrillators': [{'name': d.get('tags', {}).get('name', 'Nome non disponibile'),
                            'lat': d.get('lat'),
                            'lon': d.get('lon'),
                            'phone': d.get('tags', {}).get('phone', 'Non disponibile'),
                            'address': d.get('tags', {}).get('addr:street', 'Non disponibile')} for d in defibrillators],
        'medical_centers': [{'name': m.get('tags', {}).get('name', 'Nome non disponibile'),
                             'lat': m.get('lat'),
                             'lon': m.get('lon'),
                             'phone': m.get('tags', {}).get('phone', 'Non disponibile'),
                             'address': m.get('tags', {}).get('addr:street', 'Non disponibile')} for m in medical_centers]
    }
    
    # Salva i risultati in un file JSON
    with open(f'{city}_results.json', 'w') as f:
        json.dump(results, f, indent=4)
    
    return f"Risultati salvati in {city}_results.json"

# Esempio di utilizzo
if __name__ == '__main__':
    city = 'Bologna'  # HARDOCODED
    results = get_nearby_defibrillators_and_medical_centers(city)
    print(results)
