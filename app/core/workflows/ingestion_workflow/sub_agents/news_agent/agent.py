import requests
from bs4 import BeautifulSoup
import time
from dateutil import parser as date_parser
from google.adk.agents import Agent
import os
from datetime import datetime
from google import genai

# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "city-graph-466517-5bdbc7e0c25e.json"

client = genai.Client(vertexai=True, project="city-graph-466517", location="global")

NEWS_SOURCES = [
    "https://www.thehindu.com/news/cities/bangalore/",
    "https://timesofindia.indiatimes.com/city/bangalore"
]

CATEGORIES = [
    "Traffic", "Weather", "Public_Events", 
     "Infrastructure", "Safety", "Public_Transport"
]

def normalize_timestamp(raw_timestamp: str) -> str:
    try:
        # Clean and parse the timestamp (handles The Hindu and TOI formats)
        cleaned = raw_timestamp.strip(" -")  # remove leading/trailing dashes/spaces
        dt = date_parser.parse(cleaned, fuzzy=True)
        return dt.strftime('%Y-%m-%d %H:%M:%S')  # consistent format
    except Exception as e:
        return ""

def extract_links(source_url):
    """Extracts article links from The Hindu and TOI"""
    try:
        res = requests.get(source_url)
        soup = BeautifulSoup(res.text, "html.parser")
        if "thehindu" in source_url:
            articles = soup.find_all("h3", class_=["title", "title big"])
            return [tag.a["href"] for tag in articles if tag.a]
        elif "timesofindia" in source_url:
            return [a["href"] for a in soup.select("a[href*='/city/bengaluru/']") if a.get("href")]
    except:
        return []


def extract_article_content(url):
    """Fetch article text and timestamp"""
    try:
        res = requests.get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        
        if "thehindu" in url:
            content = " ".join(p.get_text().strip() for p in soup.find_all("p"))
            time_div = soup.find("div", class_="update-publish-time")
            timestamp = time_div.find("span").text.strip() if time_div and time_div.find("span") else ""
            timestamp = normalize_timestamp(timestamp)
        
        elif "timesofindia" in url:
            content = " ".join(p.get_text().strip() for p in soup.find_all("div", class_="_s30J clearfix"))
            byline = soup.find("div", class_="xf8Pm byline")
            timestamp = byline.find("span").text.strip() if byline and byline.find("span") else ""
            timestamp = normalize_timestamp(timestamp)
        else:
            content, timestamp = "", ""

        return content, timestamp
    except:
        return "", ""


def analyze_with_gemini(text, link, timestamp):
    """Analyze article using Gemini"""
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    prompt = f"""
You are an intelligent news extractor and analyzer for Bengaluru and its surrounding regions.
Given the following news article , determine if it's related to Bangalore city or any locality in Bangalore. Perform these tasks and return the results as clearly formatted text:

1. Check if the article timestamp "{timestamp}" is within **the last 15 hours** from this current time: {current_time}. 
   If not, respond with only:
   is_recent: false

2. If within 15 hours, proceed with the following:
Summarization:
Summarize the main event or issue in 2–3 lines.

Categorization:
Assign **one or more** categories from the following: "Traffic", "Weather", "Public_Events", "Infrastructure", "Safety", "Public_Transport". If no category fits, use: Category: NA

Timestamp:
Use this timestamp if given: "{timestamp}". If not usable, use today's date.

Sentiment Analysis:
State overall sentiment (Positive, Negative, Neutral).

Public Guidance:
If it affects the public/civic, provide 1 line of practical advice/alert

Location:
Mention the locality in Bangalore where it occurred, plus any nearby places that are affected/mentioned.

for any of the below conditions, respond with: is_bangalore_related: false

- Complaints or opinions about commuting in general  
- Sarcastic, funny, or emotional venting  
- News about new transport services, plans, launches, or fares  
- Civic rants about hospitals, services, companies, politics, etc. 
- Promotions or medical tweets 
- not related to Bangalore

Article Timestamp: {timestamp}

Article:
{text}
"""
    try:
        response = client.models.generate_content(
        model="gemini-2.5-flash",
            contents=prompt,
        )
        output = response.text.strip()
        if "is_bangalore_related: false" in output.lower() or "is_recent: false" in output.lower():
            return None
        return f"🔗 {link}\n🕒 {timestamp or datetime.now().strftime('%Y-%m-%d %H:%M')}\n{output}\n{'-'*80}"
    except:
        return None


def scrape_bangalore_news() -> str:
    """
   Scrapes Bangalore-related news from top Indian news sites,
    analyzes relevance using Gemini, and returns readable summaries.
    Returns:
        str: A string in the below format
        - summary: 2-3 line event summary
        - category: Traffic, Politics, etc.
        - timestamp: From article or today's date
        - sentiment: Psitive/Negative/Neutral
        - location: Primary location + nearby areas
        - advisory: Any warning or guidance for public
    """
    results = []
    for source in NEWS_SOURCES:
        links = extract_links(source)
        for link in links[:5]:  # Adjust count per source if needed
            content, timestamp = extract_article_content(link)
            if not content:
                continue
            analyzed = analyze_with_gemini(content, link, timestamp)
            if analyzed:
                results.append(analyzed)
            time.sleep(2)
    if not results:
        return "No Bangalore-related news found at the moment."
    return "\n\n".join(results)

news_agent = Agent(
    name="news_agent",
    model="gemini-2.0-flash",
    description=("Agent that fetches and summarizes latest Bangalore-related news using web scraping and Gemini."),
    instruction=(""" When the user asks for Bangalore or Bengaluru news, events or latest updates, 
        call the `scrape_bangalore_news` tool and respond with detailed summaries for each news item, 
        including category, sentiment, timestamp, location, and advisory."""),
    tools=[scrape_bangalore_news],
    output_key="news_summary"
)