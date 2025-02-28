import pandas as pd
import requests
import json


type_id = 34  

market_data = []

items_df = pd.read_csv('./file_data/invTypes.csv')

regions_df = pd.read_csv('./file_data/mapRegions.csv')
regions_dict = dict(zip(regions_df['regionID'], regions_df['regionName']))
regions_id_list = regions_df.iloc[:, 0].tolist()

locations_df = pd.read_csv('./file_data/staStations.csv')
locations_dict = dict(zip(locations_df['stationID'], locations_df['stationName']))

stations_df = pd.read_csv('./file_data/mapSolarSystems.csv')
stations_dict = dict(zip(stations_df['solarSystemID'], stations_df['solarSystemName']))

items_base_volume = dict(zip(items_df['typeID'], items_df['volume']))

item_id_base_volume = items_base_volume.get(type_id)

print(item_id_base_volume)

#function for converting location id to name
def convert_location_id_to_name(location_id):
    return locations_dict.get(location_id, f"Unknown Station {location_id}") 

#function for converting system id to name
def convert_system_id_to_name(system_id):   
    return stations_dict.get(system_id, f"Unknown System {system_id}")

#function for checking if if the item exists in the game
def check_item():
    url = f"https://esi.evetech.net/latest/universe/types/{type_id}/"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data:
            return True
    else:
        return False
    
if check_item():
    #fetching orders of item from all regions
    for region_id in regions_id_list:
        url = f"https://esi.evetech.net/latest/markets/{region_id}/orders/?type_id={type_id}"

        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()

            if data != []:
                for order in data:
                    order['region'] = regions_dict[region_id]
                market_data.extend(data)
        elif response.status_code == 200 and data != []:
            print(f"❌ Error 404: {response.text}")
else:
    print(f"❌ Item with type_id {type_id} does not exist in the game")

for order in market_data:
    order['location'] = convert_location_id_to_name(order['location_id'])
    order['system'] = convert_system_id_to_name(order['system_id'])

#sabing the data to a json file
with open(f"./generated_data/{type_id}_prices.json", "w", encoding="utf-8") as json_file:
    json.dump(market_data, json_file, indent=4, ensure_ascii=False) 