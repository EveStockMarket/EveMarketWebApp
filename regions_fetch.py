import pandas as pd
import requests
import json

df = pd.read_csv('./file_data/mapRegions.csv')

regions = df.iloc[:, 0].tolist()

type_id = 34  

market_data = []

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
    
print(check_item())

#fetching orders of item from all regions
for region_id in regions:
    url = f"https://esi.evetech.net/latest/markets/{region_id}/orders/?type_id={type_id}"

    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        if data:
            market_data.extend(data)
else:
    print(f"❌ Error {response.status_code}: {response.text}")

#sabing the data to a json file
with open(f"./generated_data/{type_id}_prices.json", "w", encoding="utf-8") as json_file:
    json.dump(market_data, json_file, indent=4, ensure_ascii=False)