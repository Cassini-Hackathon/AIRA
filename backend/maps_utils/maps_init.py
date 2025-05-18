import osmnx as ox

def load_maps():
    #TODO do it by retreiving the maps specified in a file
    return [
        {
            "name": "Bologna",
            "coordinates": (44.4949, 11.3426), # TODO boh
            "map": ox.graph_from_place("Bologna, Italia", network_type="drive")
        }
    ]

def get_pertinent_map(user_coordinates):
    #TODO implement this to get the map of the city based on the user location
    return load_maps()[0]