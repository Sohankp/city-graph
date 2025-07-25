import requests
from bs4 import BeautifulSoup
import time
# import google.generativeai as genai
from google.adk.agents import Agent
import os
from google import genai

# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "city-graph-466517-5bdbc7e0c25e.json"

# genai.configure(api_key="AIzaSyABScX7i7ATruOWy-DorTxz2Sm9A4_BZqw")  # Replace with your key
# model = genai.GenerativeModel("gemini-2.5-pro")
client = genai.Client(  vertexai=True, project="city-graph-466517",location="global")


NEWS_SOURCES = [
    "https://www.thehindu.com/news/cities/bangalore/",
    "https://timesofindia.indiatimes.com/city/bangalore",
    "https://indianexpress.com/section/cities/bangalore"
]


def extract_links(source_url):
    """Extracts article links from the given news source"""
    try:
        res = requests.get(source_url)
        soup = BeautifulSoup(res.text, "html.parser")
        if "thehindu" in source_url:
            articles = soup.find_all("h3", class_="title")
            return [tag.a["href"] for tag in articles if tag.a]
        elif "timesofindia" in source_url:
            return [a["href"] for a in soup.select("a[href*='/city/bengaluru/']") if a.get("href")]
        # elif "btp" in source_url:
        #     for div in soup.find_all('div', class_='scroll-content3'):
        #         links = [a_tag["href"] for a_tag in div.find_all('a', href=True)]
        #     return links
        elif "indianexpress" in source_url:
            articles = soup.find_all("li") 
            links = [tag.a["href"] for tag in articles if tag.a and "/article/cities/bangalore/" in tag.a["href"]]
            return links
    except:
        return []


def extract_article_content(url):
    """Fetch and clean article text content"""
    try:
        res = requests.get(url)
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
Given the following news article and its URL, determine if it's related to Bangalore city or any locality in Bangalore. Perform these tasks and return the results as clearly formatted text:

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

URL: {link}

Article:
{text}
"""
    try:
        response = client.models.generate_content(
        model="gemini-2.5-flash",
            contents=prompt,
        )
        print(response.text)

        output = response.text.strip()
        if "is_bangalore_related: false" in output.lower():
            return None
        return f"🔗 {link}\n{output}\n{'-'*80}"
    except:
        return None


def scrape_bangalore_news() -> str:
    """
   Scrapes Bangalore-related news from top Indian news sites,
    analyzes relevance using Gemini, and returns readable summaries.
    Returns:
        str: A string in the below format
        - summary: 2-3 line event summary
        - category: Traffic, Civic Issue, Politics, etc.
        - timestamp: oFrom article or today's date
        - sentiment: Psitive/Negative/Neutral
        - location: Primary location + nearby areas
        - advisory: Any warning or guidance for public
    """
    results = []
    for source in NEWS_SOURCES:
        links = extract_links(source)
        for link in links:  # Limit to 5 per site
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

news_agent = Agent(
    name="news_agent",
    model="gemini-2.0-flash",
    description=("Agent that fetches and summarizes latest Bangalore-related news using web scraping and Gemini."),
    instruction=(""" When the user asks for Bangalore or Bengaluru news, events, civic issues, or latest updates, 
        call the `scrape_bangalore_news` tool and respond with detailed summaries for each news item, 
        including category, sentiment, timestamp, location, and advisory."""),
    tools=[scrape_bangalore_news],
    output_key="news_summary"
)