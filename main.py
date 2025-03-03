from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.icon_controller import router as icon_router
from controllers.market_controller import router as market_router 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(icon_router)
app.include_router(market_router)

@app.get("/")
async def root():
    return {"message": "EVE Stock Market API is running!"}
