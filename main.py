from fastapi import FastAPI
import asyncio
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from controllers.icon_controller import router as icon_router
from controllers.market_controller import router as market_router 
from controllers.market_controller import fetch_all_security_status

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting security status updater...")
    asyncio.create_task(fetch_all_security_status())  # Uruchamiamy w tle
    yield 

app = FastAPI(lifespan=lifespan)
app.include_router(icon_router)
app.include_router(market_router)

@app.get("/")
async def root():
    return {"message": "EVE Stock Market API is running!"}


    