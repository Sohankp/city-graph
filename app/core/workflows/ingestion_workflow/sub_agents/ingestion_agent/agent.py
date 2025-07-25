from google.adk.agents import Agent
from pydantic import RootModel
from typing import Dict, List
from datetime import datetime
from app.core.utils.common_utils import call_api

class NewsContent(Dict[str, List[str]]):
    pass


async def ingest_news(news_content: dict) -> str:
    """Ingests the news content into the database.

    Args:
        news_content (NewsContent): The content of the news to be ingested, 
                                    should be of the format {"category1": ["article1", "article2"], ...}.

    Returns:
        str: Confirmation message of successful ingestion.
    """
    print("Ingesting news content...")
    # news_content = news_content['root']
    print("--"*100)
    print(news_content)
    print("--"*100)
    try:
        for category in news_content.keys():
            for article in news_content[category]:
                print(f"Ingesting article in category '{category}': {article}")
                url = "https://fastapi-city-graph-1081552206448.asia-south1.run.app/api/v1/add/episode"
                call_api(
                    url=url,
                    method="POST",
                    headers={"Content-Type": "application/json", "accept": "application/json"},
                    data={
                        "name": "City Updates",
                        "episode_body": article,
                        "source_description": "Banglore city news updates",
                        "group_id": category
                    }
                )
        return "News content ingested successfully."
    except Exception as e:
        print(f"Error ingesting news content: {e}")
        return f"Failed to ingest news content: {e}"

# system_prompt = """
# You are a smart assistant that takes a news summary, social media summary and weather summary, processes it, and stores it in a structured database.
# Strictly do not ask for a user input or any permission. 
# Follow these steps:

# 1. Understand the news file, weather and social media summary.
# 2. Summarize each entry, preserving all essential facts that includes
#         - timestamp: date of event
#         - sentiment: Positive/Negative/Neutral
#         - location: Primary location + nearby areas
#         - advisory: Any advisories or warnings
# 3. Detect any overlapping or repeated news items; keep one instance only.
# 4. Assign each news item to one of the following categories:
#     - Weather
#     - Traffic
#     - Infrastructure
#     - Events
#     - Safety
#     - Entire City – Use “Entire City” for broad updates that span multiple domains.
# 5. For each finalized news item, create a record with:
#     - Category
#     - list of news Summaries
#     - sample news content (JSON):
#         news_content = {
#             "Weather": ["summary1", "summary2"],
#             "Traffic": ["summary3"],
#             "Infrastructure": ["summary4", "summary5"],
#             "Events": ["summary6"],
#             "Safety": ["summary7"],
#             "Entire City": ["summary8"]
#         }

# below is the data:
#     news summary: {news_summary}
#     weather summary: {weather_summary}
#     social media summary: {social_media_summary}

# Your job:
#     Turn the raw news file into clean, non-duplicated, categorized records as per above format.
#     After processing, you need to call the `ingest_news` tool with the final structured data and ingest the content into the database.
#         """
system_prompt = """
You are a smart assistant that takes a news summary, social media summary, and weather summary, processes it, and stores it in a structured database.
DO NOT ask for user input. Your task is to generate structured data and CALL the `ingest_news` tool with it.

make use the below data:
     news summary: {news_summary}
     weather summary: {weather_summary}
     social media summary: {social_media_summary}

Steps:

1. Understand the news, weather, and social media summaries.
2. Summarize each entry, preserving key facts:
    - timestamp: Date of the event
    - sentiment: Positive / Negative / Neutral
    - location: Key location(s) and nearby areas
    - advisory: Any warnings, alerts, disruptions
3. Remove duplicates or overlapping items.
4. Categorize each summary under:
    - Weather
    - Traffic
    - Infrastructure
    - Events
    - Safety
    - Entire City
5. Build a dictionary like this:
```json
{
    "Weather": ["summary1", "summary2"],
    "Traffic": ["summary3"],
    "Infrastructure": ["summary4", "summary5"],
    "Events": ["summary6"],
    "Safety": ["summary7"],
    "Entire City": ["summary8"]
}
6. Call the ingest_news tool like this:
ingest_news(news_content={
    "Weather": ["summary1", "summary2"],
    "Traffic": ["summary3"],
    ...
})
IMPORTANT: Your final output MUST be a single call to `ingest_news`. If you don’t do this, the data will be lost.
"""

summary_agent = Agent(
    name="summary_agent",
    model="gemini-2.0-flash",
    description=(
        "Agent to summarize all the news content from the news file."
    ),
    instruction=system_prompt,
    tools=[ingest_news],
)
