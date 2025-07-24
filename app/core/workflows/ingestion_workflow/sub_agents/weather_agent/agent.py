import googlemaps
import requests
import json
import os
from google.adk.agents import Agent

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "city-graph-466517-5bdbc7e0c25e.json"
# --- API KEYS ---
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


def collect_weather_data() -> str:
    """
    Collects weather data for predefined areas in Bangalore.

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
    bangalore_areas = ['Koramangala', 'Whitefield', 'Electronic City', 'Hebbal', 'Indiranagar', 'MG Road', 'Marathahalli']
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


system_prompt = """
You are a weather analyst agent for Bangalore. make use of collect_weather_data tool to collect and summarize the current weather conditions and predict 
any potential weather-based disruptions or advisories for the mentioned city areas.

Output:
1. Overall weather summary.
2. Areas with extreme conditions.
3. Advisory or alert if any.
"""

weather_agent = Agent(
    name="weather_agent",
    model="gemini-2.0-flash",
    description=(
        "Agent to collect and summarize weather data for Bengaluru location."
    ),
    instruction=system_prompt,
    tools=[collect_weather_data],
    output_key="weather_summary"
)