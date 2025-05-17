from fastapi import APIRouter
from models.routing import Coordinates
from maps_utils.maps_init import get_pertinent_map

#routing stuff
import osmnx as ox
import networkx as nx

# geojson conversion stuff
import geopandas as gpd
from shapely.geometry import LineString, Point
import json

#to start the server: uvicorn main:app --reload

router = APIRouter(
    prefix="/routing",
    tags=["Routing"],
    # responses={404: {"description": "Not found"}},
)

def route_to_geojson(G, route):
    """
    Convert a route to GeoJSON format.
    
    Parameters:
    -----------
    G : networkx.MultiDiGraph
        The road network graph
    route : list
        List of node IDs representing the route
    
    Returns:
    --------
    geojson_dict : dict
        Route in GeoJSON format as a Python dictionary
    """
    # Extract the edges (road segments) of the route
    edge_nodes = list(zip(route[:-1], route[1:]))
    
    # Get the geometry of each edge
    lines = []
    for u, v in edge_nodes:
        # There might be multiple edges between two nodes, get the one with lowest key
        edge_data = min(G.get_edge_data(u, v).values(), key=lambda x: x.get('custom_weight', float('inf')))
        
        # If the edge has a geometry attribute with LineString coordinates
        if 'geometry' in edge_data and edge_data['geometry']:
            # Some edges already have a geometry attribute with coordinates
            lines.append(edge_data['geometry'])
        else:
            # If not, create a straight line between the nodes
            u_x, u_y = G.nodes[u]['x'], G.nodes[u]['y']
            v_x, v_y = G.nodes[v]['x'], G.nodes[v]['y']
            line = LineString([(u_x, u_y), (v_x, v_y)])
            lines.append(line)
    
    # Create a GeoDataFrame with the line segments
    gdf = gpd.GeoDataFrame({'geometry': lines})
    
    # Set the coordinate reference system to WGS84 (standard for web maps)
    gdf.crs = "EPSG:4326"
    
    # Convert to GeoJSON
    geojson_dict = json.loads(gdf.to_json())
    
    return geojson_dict


@router.post("/")
async def map_routing(start_coordinates: Coordinates, end_coordinates: Coordinates):
    #get the map the user is in
    map_data = get_pertinent_map(start_coordinates)
    map = map_data['map']

    # Use only the length of the road as weight
    print(f"Chosen map: {map_data['name']}")
    for u, v, k, data in map.edges(keys=True, data=True):
    # Get the length and use it directly as the weight without modifications
        data['custom_weight'] = data.get('length', 1)

    # Calculate route with the custom weight (which is just the length)
    orig_node = ox.nearest_nodes(map, start_coordinates.longitude, start_coordinates.latitude)
    dest_node = ox.nearest_nodes(map, end_coordinates.longitude, end_coordinates.latitude)
    route = nx.shortest_path(map, orig_node, dest_node, weight='custom_weight')

    return route_to_geojson(map, route)

@router.get("/test")
async def test_cors():
    return {"message": "CORS is working!"}