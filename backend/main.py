from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from routers.router import main_router
from maps_utils.maps_init import load_maps, reweight_map
from models.routing import Coordinates
from satellite_utils.satellite_data_init import load_data as load_copernicus_data
from data_store import set_chunks 

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8000", "http://127.0.0.1:8000"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

maps = load_maps()

app.include_router(main_router)

def get_city_map(user_coordinates: Coordinates):
    #TODO implement this to get the map of the city based on the user location
    return maps[0]

satellite_data_divided_by_chunks_of_land = load_copernicus_data()
set_chunks(satellite_data_divided_by_chunks_of_land)


maps[0] = {
            "name": "Bologna",
            "coordinates": (44.4949, 11.3426), # TODO boh
            "map": reweight_map(maps[0], satellite_data_divided_by_chunks_of_land)
        }





# # Add this at the end of the file
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
# else:
#     # This is the ASGI application to be used by uvicorn
#     application = app



