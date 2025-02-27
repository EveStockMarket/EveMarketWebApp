from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
import logging

router = APIRouter()

# Znalezienie katalogu głównego projektu (EVEStockMarketBackend)
BASE_DIR = Path(__file__).resolve().parent.parent  # Przesunięcie o jeden katalog w górę

# Prawidłowe ścieżki do folderów z ikonami
icon_32_folder = BASE_DIR / "icons_data" / "icons_32"
icon_64_folder = BASE_DIR / "icons_data" / "icons_64"

logging.basicConfig(level=logging.INFO)

@router.get("/icon_32/{icon_id}")
async def get_icon_32(icon_id: int):
    icon_path = icon_32_folder / f"{icon_id}_32.webp"
    
    logging.info(f"Looking for icon at path: {icon_path}")

    if icon_path.exists():
        logging.info(f"Icon found at path: {icon_path}")
        return FileResponse(str(icon_path))

    logging.error(f"Icon not found at path: {icon_path}")
    raise HTTPException(status_code=404, detail="Icon not found")

@router.get("/icon_64/{icon_id}")
async def get_icon_32(icon_id: int):
    icon_path = icon_32_folder / f"{icon_id}_64.webp"
    
    logging.info(f"Looking for icon at path: {icon_path}")

    if icon_path.exists():
        logging.info(f"Icon found at path: {icon_path}")
        return FileResponse(str(icon_path))

    logging.error(f"Icon not found at path: {icon_path}")
    raise HTTPException(status_code=404, detail="Icon not found")