
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

