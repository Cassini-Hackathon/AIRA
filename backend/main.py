from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from routers.router import main_router
from maps_utils.maps_init import load_maps
from models.routing import Coordinates

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

maps = load_maps()

app.include_router(main_router)

def get_city_map(user_coordinates: Coordinates):
    #TODO implement this to get the map of the city based on the user location
    return maps[0]


# # Add this at the end of the file
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
# else:
#     # This is the ASGI application to be used by uvicorn
#     application = app



