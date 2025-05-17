from fastapi import APIRouter
from models.routing import Coordinates


#to start the server: uvicorn main:app --reload

router = APIRouter(
    prefix="/routing",
    tags=["Routing"],
    # responses={404: {"description": "Not found"}},
)


@router.post("/")
async def map_routing_test(start_coordinates: Coordinates, end_coordinates: Coordinates):
    return {
        "start_coordinates": start_coordinates,
        "end_coordinates": end_coordinates,
    }