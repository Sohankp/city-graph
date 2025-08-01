import requests
import polyline
from google import genai
from google.genai.types import HttpOptions
from google.adk.agents import Agent
from app.core.utils.common_utils import call_api
import os
import googlemaps
import json

# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "D:\\city-graph\\city-graph-466517-5bdbc7e0c25e.json"
API_KEY = "AIzaSyAo1gro9w_hIvLkEeeJiH2TB7W0nB0oSQQ"

client = genai.Client(vertexai=True, project="city-graph-466517", location="global")

prompt ="""
You are an intelligent assistant tasked with interpreting raw data retrieved from a graph database to answer a specific user question about Bengaluru.

**Original User Query:**
{original_user_query}

**Retrieved Graph Data (Key-value pairs of UUIDs to facts, valid_at, invalid_at):**
{retrieved_data_from_graph}

**Instructions:**
1.  Analyze the "Retrieved Graph Data" thoroughly, focusing on the `fact` field for each entry.
2.  Identify and extract *only* the information that is directly relevant to answering the "Original User Query." Prioritize information from the most recent or top-ranked chunks if provided, as they are typically more relevant.
3.  Synthesize the relevant information into a clear, concise, and natural language answer.
4.  **Crucially, do NOT include any information from the "Retrieved Graph Data" that is not directly related to the "Original User Query."** Filter out extraneous details.
5.  If the retrieved data does not contain sufficient information to answer the query, state clearly that you could not find enough relevant information.
6.  Format any numerical values or scientific notation using LaTeX (e.g., `$2.5 \text{ km}$`, `$$10^6 \text{ people}$$`).

**Your Answer:**
"""

async def retrieve_from_graph(query:str, categories: list[str])-> str:
    """Retrieves data from the graph based on the provided query and optional node UUId"""
    print(f"Querying the graph with: {query}")

    # await graphiti.build_indices_and_constraints()
    response_dict ={}
    results =[]
    print("Retrieving data from the graph...")
    # if(node_uuid):
    #     reuslts = await graphiti.search(query, node_uuid)
    # else:
    print(categories,'categories')
    response = call_api(
        url="https://fastapi-city-graph-1081552206448.asia-south1.run.app/api/v1/get/graph",
        method="POST",
        headers={"Content-Type": "application/json", "accept": "application/json"},
        data={
            "user_query": query,
            "group_id": categories
        }
    )
    # Write response to a file for debugging
    # Fix: handle both dict and requests.Response
    # if hasattr(response, "json"):
    #     results = response.json()
    # else:
    #     results = response
    # print(results, 'results')
    # Handle API error responses (e.g., timeout)
    for res in response:
        res.pop("attributes", None)
    # with open("graph_response_debug.json", "w", encoding="utf-8") as f:
    #     json.dump(response, f, ensure_ascii=False, indent=2)
    # print(response,'resultssss')
    # time.sleep(10)
    # if isinstance(results, dict) and "error" in results:
    #     return f"Graph API error: {results['error']}"
    # if not results:
    #     return "No results found for the query."
    # else:
    #     for result in results:
    #         print(f'UUID: {result.uuid}')
    #         print(f'Fact: {result.fact}')
    #         if hasattr(result, 'valid_at') and result.valid_at:
    #             print(f'Valid from: {result.valid_at}')
    #         if hasattr(result, 'invalid_at') and result.invalid_at:
    #             print(f'Valid until: {result.invalid_at}')
    #         print('---')
    #         response_dict[result.uuid] = {
    #             "fact": result.fact,
    #             "valid_at": result.valid_at if hasattr(result, 'valid_at') else None,
    #             "invalid_at": result.invalid_at if hasattr(result, 'invalid_at') else None
    #         }
    #     print(response_dict,'response_dict')
    print(response, 'response from graph')
    prompt_filled = prompt.replace("{original_user_query}", query)
    prompt_filled = prompt_filled.replace("{retrieved_data_from_graph}", str(response))
    response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt_filled,
                )
    print(response.text.strip())
    return str(response.text.strip())
    


async def get_route_areas(origin: str, destination: str) -> str:
    """
    Computes a driving route between origin and destination, extracts distance, duration,
    and reverse-geocodes areas along the route (every 10th coordinate).
    Returns a plain string summary.

    Args:
        origin (str): Origin address.
        destination (str): Destination address.

    Returns:
        str: Summary of distance, duration, and areas passed.
    """
    route_url = f"https://routes.googleapis.com/directions/v2:computeRoutes?key={API_KEY}"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline"
    }
    payload = {
        "origin": {"address": origin},
        "destination": {"address": destination},
        "travelMode": "DRIVE",
        "routingPreference": "TRAFFIC_AWARE"
    }

    route_response = requests.post(route_url, headers=headers, json=payload)

    if route_response.status_code != 200:
        return f"Route API error: {route_response.status_code}, {route_response.text}"

    data = route_response.json()
    route = data["routes"][0]

    distance_km = route["distanceMeters"] / 1000
    duration = route["duration"]

    encoded_poly = route["polyline"]["encodedPolyline"]
    coordinates = polyline.decode(encoded_poly)

    visited_areas = set()
    areas_on_route = []

    for i, (lat, lng) in enumerate(coordinates[::10]):  # sample every 10th point
        geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={API_KEY}"
        geo_response = requests.get(geocode_url)

        if geo_response.status_code == 200:
            geo_data = geo_response.json()
            if geo_data["results"]:
                for component in geo_data["results"][0]["address_components"]:
                    if "sublocality" in component["types"] or "locality" in component["types"]:
                        area_name = component["long_name"]
                        if area_name not in visited_areas:
                            visited_areas.add(area_name)
                            areas_on_route.append(area_name)
                        break

    summary = (
        f"Route from {origin} to {destination}:\n"
        f"Distance: {round(distance_km, 2)} km\n"
        f"Duration: {duration}\n"
        f"Areas on route: {', '.join(areas_on_route) if areas_on_route else 'None found'}"
    )
    return summary

GOOGLE_MAPS_API_KEY = 'AIzaSyBqXRmYQJPiIUFXKt0Z125e4fgES-hszRg'
WEATHERAPI_KEY = 'a7b796a8885b4e78af3103559251907'

gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

def geocode_area(area_name):
    geocode_result = gmaps.geocode(f"{area_name}, Bangalore, India")
    if geocode_result:
        location = geocode_result[0]['geometry']['location']
        return location['lat'], location['lng']
    return None, None

def get_weather_by_coords(lat, lng):
    url = f"http://api.weatherapi.com/v1/current.json?key={WEATHERAPI_KEY}&q={lat},{lng}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return {
            'description': data['current']['condition']['text'],
            'temperature_C': data['current']['temp_c'],
            'humidity': data['current']['humidity'],
            'wind_speed_kph': data['current']['wind_kph'],
            'feelslike_C': data['current']['feelslike_c']
        }
    return None


def collect_weather_data(bangalore_areas: list[str]) -> str:
    """

    For each area in the list of Bangalore neighborhoods, this function:
        - Geocodes the area to obtain latitude and longitude.
        - Fetches current weather data for the coordinates.
        - Aggregates the weather information into a record.

    Returns:
        str: A JSON-formatted string containing a list of weather records. Each record includes:
            - area (str): Name of the area.
            - latitude (float): Latitude of the area.
            - longitude (float): Longitude of the area.
            - weather_description (str): Description of the current weather.
            - temperature_C (float): Temperature in Celsius.
            - humidity (float): Humidity percentage.
            - wind_speed_kph (float): Wind speed in kilometers per hour.
            - feelslike_C (float): 'Feels like' temperature in Celsius.

    Note:
        This function depends on the external functions `geocode_area` and `get_weather_by_coords`.
    """
    # bangalore_areas = ['Koramangala', 'Whitefield', 'Electronic City', 'Hebbal', 'Indiranagar', 'MG Road', 'Marathahalli']
    records = []
    for area in bangalore_areas:
        lat, lng = geocode_area(area)
        if lat and lng:
            weather = get_weather_by_coords(lat, lng)
            if weather:
                records.append({
                    'area': area,
                    'latitude': lat,
                    'longitude': lng,
                    'weather_description': weather['description'],
                    'temperature_C': weather['temperature_C'],
                    'humidity': weather['humidity'],
                    'wind_speed_kph': weather['wind_speed_kph'],
                    'feelslike_C': weather['feelslike_C']
                })
    return json.dumps(records)