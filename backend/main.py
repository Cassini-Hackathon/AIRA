from fastapi import FastAPI, APIRouter
from routers.router import main_router
from maps_utils.maps_init import load_maps
from models.routing import Coordinates


app = FastAPI()

maps = load_maps()


app.include_router(main_router)

def get_city_map(user_coordinates: Coordinates):
    #TODO implement this to get the map of the city based on the user location
    return maps[0]




