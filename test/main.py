from fastapi import FastAPI
from fastapi.responses import FileResponse
import os
from pathlib import Path
from PIL import Image
import io

app = FastAPI()

# Endpoint główny
@app.get("/")
async def root():
    return {"message": "Witaj w serwerze FastAPI zwracającym obraz .webp"}

# Endpoint zwracający obraz .webp
@app.get("/image")
async def get_image():
    try:
        # Przykładowa ścieżka do istniejącego obrazu lub generowanie nowego
        image_path = "example_image.webp"
        
        # Jeśli plik nie istnieje, stwórz przykładowy obraz
        if not os.path.exists(image_path):
            # Tworzenie prostego obrazu za pomocą PIL
            img = Image.new('RGB', (200, 200), color = (73, 109, 137))
            img.save(image_path, 'WEBP')
        
        # Zwrócenie pliku .webp
        return FileResponse(
            path=image_path,
            filename="generated_image.webp",
            media_type="image/webp",
            headers={"Content-Disposition": "attachment; filename=generated_image.webp"}
        )
    
    except Exception as e:
        return {"error": f"Wystąpił błąd: {str(e)}"}

# Endpoint z dynamicznym generowaniem obrazu
@app.get("/image/{width}/{height}")
async def get_dynamic_image(width: int, height: int):
    try:
        # Generowanie obrazu o zadanych wymiarach
        img = Image.new('RGB', (width, height), color = (73, 109, 137))
        
        # Zapisywanie do pamięci zamiast pliku
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='WEBP')
        img_byte_arr.seek(0)
        
        # Zwrócenie obrazu bez zapisywania na dysk
        return FileResponse(
            img_byte_arr,
            filename="dynamic_image.webp",
            media_type="image/webp",
            headers={"Content-Disposition": "attachment; filename=dynamic_image.webp"}
        )
    
    except Exception as e:
        return {"error": f"Wystąpił błąd: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)