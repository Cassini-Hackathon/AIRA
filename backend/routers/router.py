from fastapi import APIRouter
from routes.routing import router as routing_router
from routes.speech_to_text import router as speech_to_text_router


main_router = APIRouter()

main_router.include_router(routing_router)
main_router.include_router(speech_to_text_router)

