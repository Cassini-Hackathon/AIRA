from fastapi import APIRouter
from routes.routing import router as routing_router


main_router = APIRouter()

main_router.include_router(routing_router)

