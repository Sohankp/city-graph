from google.adk.agents import Agent
from pydantic import RootModel
from typing import Dict, List
from datetime import datetime
from app.services.graph_service.graph_client import graphiti
from app.services.graph_service.graph_schemas import entity_types, edge_types, edge_type_map

class NewsContent(RootModel[Dict[str, List[str]]]):
    pass


def ingest_news(news_content: NewsContent) -> str:
    """Ingests the news content into the database.

    Args:
        news_content (NewsContent): The content of the news to be ingested, 
                                    should be of the format {"category1": ["article1", "article2"], ...}.

    Returns:
        str: Confirmation message of successful ingestion.
    """
    news_content = news_content['root']
    print("--"*100)
    print(news_content)
    print("--"*100)
    for category in news_content.keys():
        for article in news_content[category]:
            print(f"Ingesting article in category '{category}': {article}")
            graphiti.add_episode(
                name="City Update",
                episode_body=article,
                source_description="Banglore city news updates",
                reference_time=datetime.now(),
                group_id=category,
                entity_types=entity_types,
                edge_types=edge_types,
                edge_type_map=edge_type_map
            )
    return "News content ingested successfully."

system_prompt = """
You are a smart assistant that takes a news summary, social media summary and weather summary, processes it, and stores it in a structured database.
Strictly do not ask for a user input or any permission. 
Follow these steps:

1. Understand the news file, weather and social media summary.
2. Summarize each entry, preserving all essential facts that includes
        - timestamp: date of event
        - sentiment: Positive/Negative/Neutral
        - location: Primary location + nearby areas
        - advisory: Any advisories or warnings
3. Detect any overlapping or repeated news items; keep one instance only.
4. Assign each news item to one of the following categories:
    - Weather
    - Traffic
    - Infrastructure
    - Events
    - Safety
    - Entire City – Use “Entire City” for broad updates that span multiple domains.
5. For each finalized news item, create a record with:
    - Category
    - list of news Summaries
    - sample news content (JSON):
        news_content = {
            "Weather": ["summary1", "summary2"],
            "Traffic": ["summary3"],
            "Infrastructure": ["summary4", "summary5"],
            "Events": ["summary6"],
            "Safety": ["summary7"],
            "Entire City": ["summary8"]
        }

below is the data:
    news summary: {news_summary}
    weather summary: {weather_summary}
    social media summary: {social_media_summary}

Your job:
    Turn the raw news file into clean, non-duplicated, categorized records as per above format.
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
