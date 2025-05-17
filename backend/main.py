from fastapi import FastAPI, APIRouter
from routers.router import main_router

app = FastAPI()

app.include_router(main_router)




