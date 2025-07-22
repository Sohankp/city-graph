import googlemaps
import requests
import pandas as pd
from datetime import datetime
import google.generativeai as genai

# --- API KEYS ---
GOOGLE_MAPS_API_KEY = 'AIzaSyBqXRmYQJPiIUFXKt0Z125e4fgES-hszRg'
WEATHERAPI_KEY = 'a7b796a8885b4e78af3103559251907'
GEMINI_API_KEY = "AIzaSyBPzrnIAvg4rRMUQunBQYNm8Rd31D44xdA"

# --- Initialize clients ---
gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-1.5-pro')

# --- Step 1: Define Bangalore localities ---
bangalore_areas = ['Koramangala', 'Whitefield', 'Electronic City', 'Hebbal', 'Indiranagar', 'MG Road', 'Marathahalli']

# --- Step 2: Geocode each locality ---
def geocode_area(area_name):
    geocode_result = gmaps.geocode(f"{area_name}, Bangalore, India")
    if geocode_result:
        location = geocode_result[0]['geometry']['location']
        return location['lat'], location['lng']
    return None, None

# --- Step 3: Get Weather Data for each area ---
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

# --- Step 4: Collect weather data for all areas ---
def collect_weather_data():
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
    return pd.DataFrame(records)

# --- Step 5: Agent Reasoning for Weather Summary ---
def agent_weather_insights(weather_df):
    if weather_df.empty:
        return "No weather data available to summarize."

    weather_summary = "\n".join(
        [f"{row['area']}: {row['weather_description']}, {row['temperature_C']}°C, Humidity {row['humidity']}%" 
         for idx, row in weather_df.iterrows()]
    )

    prompt = f"""
You are a weather analyst agent for Bangalore. Summarize the current weather conditions and predict 
any potential weather-based disruptions or advisories for the city areas below:

{weather_summary}

Output:
1. Overall weather summary.
2. Areas with extreme conditions.
3. Advisory or alert if any.
"""

    response = gemini_model.generate_content(prompt)
    return response.text.strip()

# --- Step 6: Main pipeline ---
if __name__ == "__main__":
    weather_df = collect_weather_data()
    print("=== Current Weather Data ===")
    print(weather_df)

    insights = agent_weather_insights(weather_df)
    print("\n=== Agent Weather Insights ===")
    print(insights)

    # Optionally save
    weather_df.to_csv(f"bangalore_weather_data_{datetime.now().strftime('%Y%m%d%H%M%S')}.csv", index=False)
