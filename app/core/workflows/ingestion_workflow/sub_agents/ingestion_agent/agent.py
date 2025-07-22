import pandas as pd
from google.adk.agents import Agent
import os
from pydantic import RootModel
from typing import Dict, List

class NewsContent(RootModel[Dict[str, List[str]]]):
    pass

def read_summary_file() -> str:
    """Reads the content of a summary file.

    Returns:
        str: The content of the summary file.
    """
    try:
        file_path = "app\\core\\workflows\\ingestion_workflow\\sub_agents\\ingestion_agent\\news_summary.csv"
        df = pd.read_csv(file_path)
        if df.empty:
            return "The summary file is empty."
        else:
            return df.to_string(index=False)
    except FileNotFoundError:
        return "Summary file not found."

def ingest_news(news_content: NewsContent) -> str:
    """Ingests the news content into the database.

    Args:
        news_content (NewsContent): The content of the news to be ingested, 
                                    should be of the format {"category1": ["article1", "article2"], ...}.

    Returns:
        str: Confirmation message of successful ingestion.
    """
    news_content = news_content['root']
    for category in news_content.keys():
        for article in news_content[category]:
            print(f"Ingesting article in category '{category}': {article}")
            # Here you would add the logic to ingest the article into your database.
            # For example, you might call a function that interacts with your database API.
    return "News content ingested successfully."

system_prompt = """
You are a smart assistant that takes a news summary file, processes it, and stores it in a structured database.
Strictly do not ask for a user input or any permission. 
Follow these steps:

1. Load the entire news summary.
2. Condense each entry, preserving all essential facts.
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
    tools=[read_summary_file, ingest_news],
)