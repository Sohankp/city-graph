
import googlemaps
import os
from google.adk.agents import Agent
import requests
# from app.core.config.app_config import app_config
TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAL%2BM3AEAAAAAStPyuEzvGW1Z2R9xsDzQ3GZ8DOk%3DaeA6s7eM9Twgm0nFIdVld7mBno6IDu0COkSPwhmdvuZmwlQZJe'
GOOGLE_MAPS_API_KEY = 'AIzaSyBqXRmYQJPiIUFXKt0Z125e4fgES-hszRg'

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "city-graph-466517-5bdbc7e0c25e.json"

def geocode_location(location):
    if not location or location == 'Unknown':
        return None, None
    try:
        gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
        geo = gmaps.geocode(location)
        if geo:
            loc = geo[0]['geometry']['location']
            return loc['lat'], loc['lng']
    except Exception as e:
        print(f"Geocoding error for '{location}': {e}")
    return None, None

def fetch_tweets() -> list[dict]:
    """
    Fetches recent tweets matching a given query using the Twitter API v2.
    Returns:
        list[dict]: A list of dictionaries, each containing information about a tweet, including:
            - 'tweet_id': The unique identifier of the tweet.
            - 'text': The text content of the tweet.
            - 'created_at': The creation timestamp of the tweet.
            - 'user_id': The unique identifier of the tweet's author.
            - 'user_location': The location of the tweet's author (if available).
            - 'latitude': The latitude of the user's location (if geocoded).
            - 'longitude': The longitude of the user's location (if geocoded).
    Notes:
        - Prints an error message if the Twitter API request fails.
    """
    url = "https://api.twitter.com/2/tweets/search/recent"
    max_results = 10
    query = "(traffic OR congestion OR accident OR marathon OR event) Bangalore -is:retweet"
    headers = {"Authorization": f"Bearer {TWITTER_BEARER_TOKEN}"}
    params = {
        "query": query,
        "max_results": max_results,
        "tweet.fields": "created_at,author_id,geo",
        "expansions": "author_id",
        "user.fields": "location"
    }

    response = requests.get(url, headers=headers, params=params)
    tweets = []
    if response.status_code == 200:
        data = response.json()
        users = {u['id']: u for u in data.get('includes', {}).get('users', [])}
        for tweet in data.get('data', []):
            user = users.get(tweet['author_id'], {})
            lat, lng = geocode_location(user.get('location', 'Unknown'))
            tweets.append({
                'tweet_id': tweet['id'],
                'text': tweet['text'],
                'created_at': tweet['created_at'],
                'user_id': tweet['author_id'],
                'user_location': user.get('location', 'Unknown'),
                'latitude': lat,
                'longitude': lng
            })
    else:
        print(f"Twitter API Error: {response.status_code} - {response.text}")
    print(tweets)
    return tweets

system_prompt = """
You are a **city data analyst** specializing in Bangalore. Use the `fetch_tweets` tool (or any social‑media feed) to gather **recent public posts** about **traffic**, **accidents**, or **local events** in Bangalore. Based on that data:

1. Summarize each incident or insight with:
   - **What** happened (e.g., accident, congestion, event, maintenance)
   - **Where** it happened (specific locality or landmark)
   - **When** it occurred (date and time, as precisely as available)
   - **Any other relevant details** (severity, duration, cause, agencies involved, alternative routes, impact)

2. Provide a **list** of news summary entries. Ensure:
   - **No duplicates**
   - Each entry gives a **detailed summary** including the event, location, and time

**Output format:**

```json
[
  "On July 17, emergency maintenance led to planned power shutdowns across Koramangala, Jayanagar, Peenya, and RR Nagar from 10 AM to 5 PM, as BESCOM upgraded substation equipment, causing widespread inconvenience.",
  "Metro and flyover construction work near the Silk Board junction ramped traffic onto poorly surfaced service roads, causing continuous congestion between ORR, Koramangala, and BTM Layout. Drivers faced bumpy roads and slowdowns due to craters and narrow lanes—classified medium in severity."
]
"""

social_media_agent = Agent(
    name="social_media_agent",
    model="gemini-2.0-flash",
    description=(
        "Agent to summarize all the news content from the recent twitter posts."
    ),
    instruction=system_prompt,
    tools=[fetch_tweets],
    output_key="social_media_summary"
)

