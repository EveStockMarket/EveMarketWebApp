import asyncio
import os

import aiofiles
import httpx
import pandas as pd
import requests
import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
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

regions_dict = dict(zip(regions_df['regionID'], regions_df['regionName']))
regions_id_list = regions_df['regionID'].tolist()
locations_dict = dict(zip(locations_df['stationID'], locations_df['stationName']))
stations_dict = dict(zip(stations_df['solarSystemID'], stations_df['solarSystemName']))
items_base_volume = dict(zip(items_df['typeID'], items_df['volume']))
items_id = items_df['typeID'].tolist()


def convert_location_id_to_name(location_id):
    return locations_dict.get(location_id, f"Unknown Station {location_id}")


def convert_system_id_to_name(system_id):
    return stations_dict.get(system_id, f"Unknown System {system_id}")


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

    avg_quantity = int(df['quantity'].mean())
    avg_volume = int(df['quantity'].mean()) 

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
        return JSONResponse(str(json_file))
    else:
        market_data = await fetch_market_data_all_regions(item_id)
        if not market_data:
            raise HTTPException(status_code=404, detail="Item not found or no market data available")
        return JSONResponse(str(json_file))
