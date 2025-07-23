import pandas as pd
from google.adk.agents import Agent
import os
from pydantic import RootModel
from typing import Dict, List
from app.core.workflows.ingestion_workflow.sub_agents.retrieval_agent.retrieve_tools import retrieve_from_graph
from app.services.graph_service.graph_client import graphiti
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\Users\\sohan kp\\Downloads\\city-graph-466517-5bdbc7e0c25e.json"

retrieval_agent = Agent(
    name = "agent_retrieval",
    model="gemini-2.0-flash",
    description=(
        "Agent to retirve data from the graph"
    ),
    tools=[retrieve_from_graph]
)

