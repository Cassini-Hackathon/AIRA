import osmnx as ox
from typing import List, Tuple
from data_store import get_chunks

def load_maps():
    #TODO do it by retreiving the maps specified in a file
    map = ox.graph_from_place("Bologna, Italia", network_type="drive")
    return [
        {
            "name": "Bologna",
            "coordinates": (44.4949, 11.3426), # TODO boh
            "map": map,
        }
    ]

def get_pertinent_map(user_coordinates):
    #TODO implement this to get the map of the city based on the user location
    return load_maps()[0]

def are_coords_in_box(box, coords) -> bool:
    min_lat = min(p[0] for p in box)
    max_lat = max(p[0] for p in box)
    min_lon = min(p[1] for p in box)
    max_lon = max(p[1] for p in box)
    return min_lat <= coords[0] <= max_lat and min_lon <= coords[1] <= max_lon

def get_precipitation_on_street(coords: List[Tuple[float, float]]) -> float:
    # returns the avg precipitation value on the street, if not covered => 1
    # get the map chunks
    chunks = get_chunks()
    for key, chunk in chunks.items():
        #if coords are in the chunk
        box = chunk['coords']
        if are_coords_in_box(box, coords):
            return chunk['precipitation_value_avg']
    return 1

def reweight_map(map_data, chunks):
    # changes the weights of each street based on the weather data
    # map = ox.graph_from_place("Bologna, Italia", network_type="drive")
    print(f"Processing map of {map_data['name']}...\n\n")
    map = map_data['map']
    for u, v, k, data in map.edges(keys=True, data=True):
        start_node = map.nodes[u]
        end_node = map.nodes[v]
        
        start_coords = (start_node['x'], start_node['y'])
        end_coords = (end_node['x'], end_node['y'])

        street_coords = ((start_coords[1] + end_coords[1]) / 2, (start_coords[0] + end_coords[0]) / 2)
        

        # Get the length and use it as base weight * precipitation presence value
        data['custom_weight'] = data.get('length', 1) * get_precipitation_on_street(street_coords)


def reweight_maps(maps):
    for map in maps:
        reweight_map(map)