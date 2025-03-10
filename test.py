import os
import asyncio
import aiohttp
import json
import pandas as pd

# Wczytanie pliku CSV
stations_df = pd.read_csv('./file_data/mapSolarSystems.csv')

# Pobranie unikalnych ID systemów
system_ids = stations_df["solarSystemID"].astype(str).tolist()

# Funkcja do pobierania security status dla pojedynczego systemu
async def fetch_security_status(session, system_id):
    url = f"https://esi.evetech.net/latest/universe/systems/{system_id}"
    try:
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                return {"system_id": system_id, "security_status": data.get("security_status", None)}
            else:
                return {"system_id": system_id, "error": response.status}
    except Exception as e:
        return {"system_id": system_id, "error": str(e)}

# Funkcja do pobierania wszystkich systemów asynchronicznie
async def fetch_all_security_status(system_ids):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_security_status(session, system_id) for system_id in system_ids]
        return await asyncio.gather(*tasks)

# Pobranie danych
security_status_data = asyncio.run(fetch_all_security_status(system_ids))

# Ścieżka do pliku
output_dir = "./generated_data/system_sec_data/"
output_file = os.path.join(output_dir, "security_status.json")

# Tworzenie folderów, jeśli nie istnieją
os.makedirs(output_dir, exist_ok=True)

# Zapisanie do pliku JSON
with open(output_file, "w") as f:
    json.dump(security_status_data, f, indent=4)

print(f"Plik został zapisany: {output_file}")
