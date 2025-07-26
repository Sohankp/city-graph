
from google.adk.agents import Agent, ParallelAgent, SequentialAgent
from .sub_agents.social_media_agent.agent import *
from .sub_agents.news_agent.agent import *
from .sub_agents.ingestion_agent.agent import summary_agent
from .sub_agents.social_media_agent.agent import social_media_agent
from .sub_agents.news_agent.agent import news_agent


gather_data = ParallelAgent(
    name="ConcurrentDataFetch",
    sub_agents=[news_agent, social_media_agent]
)

root_agent = SequentialAgent(
    name="IngestNews",
    sub_agents=[gather_data, summary_agent]
)

# Create the root ingestion workflow agent
# root_agent = Agent(
#     name="Ingestion_Workflow_Agent",
#     model="gemini-2.0-flash",
#     description="Ingestion workflow agent for processing news articles",
#     instruction="""
#     get the summary of the news file and ingest it into the database.
#     please don't ask user for any input or permission.
#     """,
#     sub_agents=[gather_data, summary_agent],
#     tools=[],
# )
