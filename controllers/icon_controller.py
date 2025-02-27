from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
import logging

router = APIRouter()

icon_32_folder = "./icons_data/icons_32"
icon_64_folder = "./icons_data/icons_64"

logging.basicConfig(level=logging.INFO)

# Getting icon 32
@router.get("/icon_32/{icon_id}")
async def get_icon_32(icon_id: int):
    icon_path = os.path.join(icon_32_folder, f"{icon_id}_32.webp")
    logging.info(f"Looking for icon at path: {icon_path}")
    if os.path.exists(icon_path):
        logging.info(f"Icon found at path: {icon_path}")
        return FileResponse(icon_path)
    logging.error(f"Icon not found at path: {icon_path}")
    logging.debug(f"Checked path: {icon_path}, exists: {os.path.exists(icon_path)}")
    raise HTTPException(status_code=404, detail="Icon not found")

# Getting icon 64
@router.get("/icon_64/{icon_id}")
async def get_icon_64(icon_id: int):
    icon_path = os.path.join(icon_64_folder, f"{icon_id}_64.webp")
    logging.info(f"Looking for icon at path: {icon_path}")
    if os.path.exists(icon_path):
        logging.info(f"Icon found at path: {icon_path}")
        return FileResponse(icon_path)
    logging.error(f"Icon not found at path: {icon_path}")
    logging.debug(f"Checked path: {icon_path}, exists: {os.path.exists(icon_path)}")
    raise HTTPException(status_code=404, detail="Icon not found")
