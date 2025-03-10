import asyncio
import aiohttp
import os
import httpx
import pandas as pd
import requests
import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
import logging
from datetime import datetime, timedelta, UTC

from starlette.responses import JSONResponse

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent

logging.basicConfig(level=logging.INFO)

items_df = pd.read_csv('./file_data/invTypes.csv')
regions_df = pd.read_csv('./file_data/mapRegions.csv')
locations_df = pd.read_csv('./file_data/staStations.csv')
stations_df = pd.read_csv('./file_data/mapSolarSystems.csv')
security_df = pd.read_json('./generated_data/system_sec_data/security_status.json')

regions_dict = dict(zip(regions_df['regionID'], regions_df['regionName']))
regions_id_list = regions_df['regionID'].tolist()
locations_dict = dict(zip(locations_df['stationID'], locations_df['stationName']))
systems_dict = dict(zip(stations_df['solarSystemID'], stations_df['solarSystemName']))
items_base_volume = dict(zip(items_df['typeID'], items_df['volume']))
items_id = items_df['typeID'].tolist()
systems_ids = stations_df["solarSystemID"].astype(str).tolist()
sec_systems_dict = dict(zip(security_df['system_id'], security_df['security_status']))

def convert_location_id_to_name(location_id):
    return locations_dict.get(location_id, f"Unknown Station {location_id}")

def convert_system_id_to_name(system_id):
    return systems_dict.get(system_id, f"Unknown System {system_id}")

def check_item(type_id):
    url = f"https://esi.evetech.net/latest/universe/types/{type_id}/"
    response = requests.get(url)
    return response.status_code == 200

def time_until_expiry(issued, duration):
    issued_dt = datetime.strptime(issued, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=UTC)
    expiry_dt = issued_dt + timedelta(days=duration)
    now = datetime.now(UTC)

    remaining_time = expiry_dt - now
    days = remaining_time.days
    hours = remaining_time.seconds // 3600

    return days, hours

def analyze_market_data(market_data):
    df = pd.DataFrame(market_data)
    buy_orders = df[df['is_buy_order']]
    sell_orders = df[~df['is_buy_order']]

    avg_buy_price = buy_orders['price'].mean()
    avg_sell_price = sell_orders['price'].mean()
    avg_margin = avg_sell_price - avg_buy_price

    avg_quantity = df['quantity'].mean()
    avg_volume = df['quantity'].mean() 

    median_buy_price = buy_orders['price'].median()
    median_sell_price = sell_orders['price'].median()

    return {
        "avg_buy_price": avg_buy_price,
        "avg_sell_price": avg_sell_price,
        "avg_margin": avg_margin,
        "avg_quantity": avg_quantity,
        "avg_volume": avg_volume,
        "median_buy_price": median_buy_price,
        "median_sell_price": median_sell_price
    }

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

async def fetch_all_security_status():
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_security_status(session, system_id) for system_id in systems_ids]
        security_status_data = await asyncio.gather(*tasks)

    output_dir = "./generated_data/system_sec_data/"
    output_file = os.path.join(output_dir, "security_status.json")

    os.makedirs(output_dir, exist_ok=True)

    with open(output_file, "w") as f:
        json.dump(security_status_data, f, indent=4)

    print(f"Plik został zapisany: {output_file}")

async def fetch_market_data_for_region(client, region_id, type_id, item_id_base_volume):
    url = f"https://esi.evetech.net/latest/markets/{region_id}/orders/?type_id={type_id}"
    try:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()
        if data:
            for order in data:
                order['region'] = regions_dict[region_id]
                order['quantity'] = order['volume_remain'] / item_id_base_volume
            return data
    except httpx.HTTPStatusError as e:
        print(f"❌ Error {e.response.status_code} for region {region_id}: {e.response.text}")
    except Exception as e:
        print(f"❌ Unexpected error for region {region_id}: {e}")
    return []


async def fetch_market_data_all_regions(type_id):
    market_data = []

    item_id_base_volume = items_base_volume.get(type_id, None)

    if item_id_base_volume is None:
        print(f"⚠️ Item ID {type_id} not found in database.")
        return []

    async with httpx.AsyncClient() as client:
        tasks = [fetch_market_data_for_region(client, region_id, type_id, item_id_base_volume) for region_id in
                 regions_id_list]
        results = await asyncio.gather(*tasks)
        for data in results:
            market_data.extend(data)

    for order in market_data:
        order['location'] = convert_location_id_to_name(order['location_id'])
        order['system'] = convert_system_id_to_name(order['system_id'])
        order['remaining_time'] = time_until_expiry(order['issued'], order['duration'])
        order['security_status'] = sec_systems_dict.get(order['system_id'], None)
        del order['duration']
        del order['issued']
        del order['location_id']
        del order['system_id']
        del order['range']
        del order['order_id']
        del order['type_id']
        del order['volume_total']

    output_path = BASE_DIR / "generated_data" / f"{type_id}_prices.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)  
    analysis = analyze_market_data(market_data)
    result = {"orders": market_data, "analysis": analysis}

    with open(output_path, "w", encoding="utf-8") as json_file:
        json.dump(result, json_file, indent=4, ensure_ascii=False)

    return result

@router.get("/market_orders/{item_id}")
async def get_market_data(item_id: int):
    json_file = BASE_DIR / "generated_data" / f"{item_id}_prices.json"
    if json_file.exists():
        return FileResponse(json_file)
    else:
        market_data = await fetch_market_data_all_regions(item_id)
        if not market_data:
            raise HTTPException(status_code=404, detail=f"Item {item_id} not found or no market data available")
        return FileResponse(json_file)


@router.get("/all_market_orders")
async def get_all_market_data():
    results = {}
    for item in items_id:
        try:
            response = await get_market_data(item)
            results[item] = response.body
        except HTTPException as e:
            results[item] = {"error": e.detail}
        except Exception as e:
            results[item] = {"error":str(e)}
    return JSONResponse(results)

if __name__ == "__main__":
    asyncio.run(fetch_all_security_status())