import os
import requests
import googlemaps
import json
from datetime import datetime
from google.adk.agents import Agent

# Securely store your API keys
TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAABUE3QEAAAAA1dD52XdfpbyDUt3VONkE6pSIEfg%3DR8FbqBVypbcoQ4LKyEPIZgsBQH9M4LjXpDxmDzu8UXE7zVok4f'
GOOGLE_MAPS_API_KEY = 'AIzaSyBqXRmYQJPiIUFXKt0Z125e4fgES-hszRg'
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "city-graph-466517-5bdbc7e0c25e.json"

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
    url = "https://api.twitter.com/2/tweets/search/recent"
    query = "#Bangalore -is:retweet lang:en"
    headers = {"Authorization": f"Bearer {TWITTER_BEARER_TOKEN}"}
    params = {
        "query": query,
        "max_results": 20,
        "tweet.fields": "created_at,author_id,text",
        "expansions": "author_id",
        "user.fields": "location"
    }

    response = requests.get(url, headers=headers, params=params)
    tweets = []
    if response.status_code == 200:
        data = response.json()
        print("✅ Twitter API data fetched successfully.")
        print("🔵 Raw API Response:", json.dumps(data, indent=2))

        users = {u['id']: u for u in data.get('includes', {}).get('users', [])}
        for tweet in data.get('data', []):
            user = users.get(tweet['author_id'], {})
            location = user.get('location', 'Unknown')
            lat, lng = geocode_location(location)
            tweets.append({
                'tweet_id': tweet['id'],
                'text': tweet['text'],
                'created_at': tweet['created_at'],
                'user_id': tweet['author_id'],
                'user_location': location,
                'latitude': lat,
                'longitude': lng
            })
    else:
        print("❌ No mock data available. Exiting...")
        return []
    print ("Tweets: ",tweets)
    return tweets

system_prompt = f"""
You are a strict and intelligent Bangalore traffic and public event analyzer for social media.

Given a tweet and metadata (text, timestamp, user location), perform the following ONLY IF the tweet describes a **real-world event** in Bangalore that is:
- Traffic disruptions — jams, waterlogging, blocked roads, signal failure, accidents  
- Public events — protests, marathons, political rallies, large celebrations  
- Major weather events — floods, storm alerts, rains that block roads or cause commute issues  
+
DO NOT respond to:
- Complaints or opinions about commuting in general  
- Sarcastic, funny, or emotional venting  
- News about new transport services, plans, launches, or fares  
- Civic rants about hospitals, services, companies  
- Promotions or medical tweets 
If the tweet is **about anything else** (hospital reviews, customer complaints, jokes, sarcasm, random opinions, promotions), respond with:
text
Respond with -
No news related to Bangalore traffic or any events nearby.
"""

social_media_agent = Agent(
    name="social_media_agent",
    model="gemini-2.5-flash",
    description="Agent to summarize only relevant Bangalore tweets about traffic and impactful public events",
    instruction=system_prompt,
    tools=[fetch_tweets],
    output_key="social_media_summary"
)
