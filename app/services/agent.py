import requests
from bs4 import BeautifulSoup
import time
import google.generativeai as genai
from datetime import datetime
from google.adk.agents import Agent
import os

# ✅ Google credentials path (if needed)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\\Users\\user\\Downloads\\city-graph-466517-5bdbc7e0c25e.json"

# # ✅ Initialize Gemini
genai.configure(api_key="AIzaSyABScX7i7ATruOWy-DorTxz2Sm9A4_BZqw")  # Replace with your key
model = genai.GenerativeModel("gemini-2.5-pro")

HEADERS = {"User-Agent": "Mozilla/5.0"}
NEWS_SOURCES = [
    "https://www.thehindu.com/news/cities/bangalore/",
    "https://timesofindia.indiatimes.com/city/bangalore"
]


def extract_links(source_url):
    """Extracts article links from the given news source"""
    try:
        res = requests.get(source_url, headers=HEADERS)
        soup = BeautifulSoup(res.text, "html.parser")
        if "thehindu" in source_url:
            articles = soup.find_all("h3", class_="title")
            return [tag.a["href"] for tag in articles if tag.a]
        elif "timesofindia" in source_url:
            return [a["href"] for a in soup.select("a[href*='/city/bengaluru/']") if a.get("href")]
        elif "indianexpress" in source_url:
            return [a["href"] for a in soup.select("a.card") if a.get("href")]
    except:
        return []


def extract_article_content(url):
    """Fetch and clean article text content"""
    try:
        res = requests.get(url, headers=HEADERS)
        soup = BeautifulSoup(res.text, "html.parser")
        if "timesofindia" in url:
            content = " ".join(p.get_text().strip() for p in soup.find_all("div", class_="_s30J clearfix"))
        else:
            content = " ".join(p.get_text().strip() for p in soup.find_all("p"))
        return content
    except:
        return ""


def analyze_with_gemini(text, link):
    """Pass article content to Gemini for summarization and tagging"""
    prompt = f"""
You are an intelligent news extractor and analyzer for Bengaluru and its surrounding regions.
Given the following news article , determine if it's related to Bangalore city or any locality in Bangalore. Perform these tasks and return the results as clearly formatted text:

Summarization:
Provide a clear, concise summary of the main event or issue in 2–3 lines.

Categorization:
Assign the most relevant category (choose from Traffic, Weather, Civic Issue, Public Event, Politics, Crime, Festival, Transport, or specify a more appropriate category if needed).

Timestamp Identification:
Extract the article’s publication date as the timestamp. If unavailable, use today’s date.

Sentiment Analysis:
Determine the overall sentiment of the article (Positive, Negative, or Neutral).

Public Guidance/Advisory:
If the news affects the public (e.g., disruptions, risks, safety concerns, transportation changes), provide 1 line of practical advice or guidance. If the article does not impact the public, omit this field.

Location Extraction:
Clearly state the main location mentioned in the article where the event occurred, and list any notable nearby areas referenced/affected

If not relevant to Bangalore, respond with:
is_bangalore_related:   

Article:
{text}
"""
    try:
        response = model.generate_content(prompt)
        output = response.text.strip()
        if "is_bangalore_related: false" in output.lower():
            return None
        return f"🔗 {link}\n{output}\n{'-'*80}"
    except:
        return None


def scrape_bangalore_news() -> str:
    
    results = []
    for source in NEWS_SOURCES:
        links = extract_links(source)
        for link in links[:2]:  # Limit to 5 per site
            content = extract_article_content(link)
            if not content:
                continue
            analyzed = analyze_with_gemini(content, link)
            if analyzed:
                results.append(analyzed)
            time.sleep(2)

    if not results:
        return "No Bangalore-related news found at the moment."

    return "\n\n".join(results)


# ✅ Register the agent
root_agent = Agent(
    name="bangalore_news_agent",
    model="gemini-2.0-flash",
    description=("Agent that fetches and summarizes latest Bangalore-related news using web scraping and Gemini."),
    instruction=("When the user asks for Bangalore news, scrape news sites and Provide whatever ouput the gemini gives"),
    tools=[scrape_bangalore_news],
)
