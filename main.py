from fastapi import FastAPI
from controllers.icon_controller import router as icon_router

app = FastAPI()

app.include_router(icon_router)

@app.get("/")
async def root():
    return {"message": "EVE Stock Market API is running!"}
