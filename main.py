from fastapi import FastAPI
from controllers.icon_controller import router as icon_router

app = FastAPI()

# Registering the icon controller
app.include_router(icon_router)

# API home page
@app.get("/")
async def root():
    return {"message": "EVE Stock Market API is running!"}
