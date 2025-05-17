import googlemaps
import json

# Sostituisci 'YOUR_API_KEY' con la tua API key di Google
gmaps = googlemaps.Client(key='AIzaSyBeyvrLKUvgIm9myVKXKLymgb-7mMyWIi4')

def get_nearby_defibrillators(city):
    # Geocoding della città
    geocode_result = gmaps.geocode(city)
    if not geocode_result:
        return json.dumps({"error": "Città non trovata."})
    
    location = geocode_result[0]['geometry']['location']
    lat, lon = location['lat'], location['lng']
    
    # Cerca defibrillatori nelle vicinanze
    places_result = gmaps.places_nearby(
        location=(lat, lon),
        radius=10000,  # Raggio in metri, aumentato a 10 km
        keyword='defibrillator'
    )
    
    # Formatta i risultati in JSON
    results = {
        'defibrillators': [{'name': place.get('name', 'Nome non disponibile'),
                            'lat': place['geometry']['location']['lat'],
                            'lon': place['geometry']['location']['lng'],
                            'address': place.get('vicinity', 'Non disponibile')} for place in places_result.get('results', [])]
    }
    
    # Salva i risultati in un file JSON
    with open(f'{city}_defibrillators.json', 'w') as f:
        json.dump(results, f, indent=4)
    
    return f"Risultati salvati in {city}_defibrillators.json"

# Esempio di utilizzo
if __name__ == '__main__':
    city = 'Bologna'  # HARDOCODED NOME CITTA' E RAGGIO PER 10KM
    results = get_nearby_defibrillators(city)
    print(results)