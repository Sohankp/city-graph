import requests
import pandas as pd
from datetime import datetime
import googlemaps
import google.generativeai as genai


# === CONFIGURATION ===
TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAL%2BM3AEAAAAAStPyuEzvGW1Z2R9xsDzQ3GZ8DOk%3DaeA6s7eM9Twgm0nFIdVld7mBno6IDu0COkSPwhmdvuZmwlQZJe'
GOOGLE_MAPS_API_KEY = 'AIzaSyBqXRmYQJPiIUFXKt0Z125e4fgES-hszRg'
WEATHERAPI_KEY = 'a7b796a8885b4e78af3103559251907'
GEMINI_API_KEY = "AIzaSyBPzrnIAvg4rRMUQunBQYNm8Rd31D44xdA"


# --- Initialize Google Clients ---
gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-1.5-pro')

# --- Step 1: Fetch Tweets ---
def fetch_tweets_once(query, max_results=10):
    url = "https://api.twitter.com/2/tweets/search/recent"
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
            tweets.append({
                'tweet_id': tweet['id'],
                'text': tweet['text'],
                'created_at': tweet['created_at'],
                'user_id': tweet['author_id'],
                'user_location': user.get('location', 'Unknown')
            })
    else:
        print(f"Twitter API Error: {response.status_code} - {response.text}")
    return tweets

# --- Step 2: Geocode location ---
def geocode_location(location):
    if not location or location == 'Unknown':
        return None, None
    try:
        geo = gmaps.geocode(location)
        if geo:
            loc = geo[0]['geometry']['location']
            return loc['lat'], loc['lng']
    except Exception as e:
        print(f"Geocoding error for '{location}': {e}")
    return None, None

# --- Step 3: Agent Reasoning via Gemini ---
def agent_reasoning(tweets_df):
    if tweets_df.empty:
        return "No tweets to analyze."

    summary_text = "\n".join([f"- {row['text']} (from {row['user_location']})"
                              for idx, row in tweets_df.iterrows()])

    prompt = f"""
You are a city traffic analyst agent. Given these recent social media posts, summarize the traffic, accidents, or event insights for Bangalore.

Tweets:
{summary_text}

Provide:
1. Key localities with congestion or events.
2. Any accidents or disruptions.
3. Predictions for potential traffic hotspots for the next few days.
"""
    response = gemini_model.generate_content(prompt)
    return response.text.strip()

# --- Full Execution Pipeline ---
if __name__ == "__main__":
    search_query = "(traffic OR congestion OR accident OR marathon OR event) Bangalore -is:retweet"
    tweets = fetch_tweets_once(search_query, max_results=10)

    if tweets:
        # Geocode locations
        for t in tweets:
            lat, lng = geocode_location(t['user_location'])
            t['latitude'] = lat
            t['longitude'] = lng

        df = pd.DataFrame(tweets)
        df.to_csv(f"bangalore_traffic_tweets_{datetime.now().strftime('%Y%m%d%H%M%S')}.csv", index=False)
        print("✅ Tweets with geo saved to CSV.")

        # Run agent reasoning
        agent_summary = agent_reasoning(df)
        print("\n=== AGENT INSIGHTS ===")
        print(agent_summary)
    else:
        print("❌ No tweets fetched.")
