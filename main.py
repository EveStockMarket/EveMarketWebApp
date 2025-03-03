from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.icon_controller import router as icon_router
from controllers.market_controller import router as market_router 

app = FastAPI()

# 🔹 Dodajemy obsługę CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Możesz podać konkretny frontend, np. ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],  # Zezwalamy na wszystkie metody (GET, POST, PUT, DELETE itd.)
    allow_headers=["*"],  # Zezwalamy na wszystkie nagłówki
)

# 🔹 Dodajemy routery
app.include_router(icon_router)
app.include_router(market_router)

@app.get("/")
async def root():
    return {"message": "EVE Stock Market API is running!"}
