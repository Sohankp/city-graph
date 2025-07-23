from app.api.v1.models import PingPayload
from app.core.workflows.ingestion_workflow.sub_agents.retrieval_agent.retrieve_runner import extraction_pipeline

async def ping(payload: PingPayload):
    return {"message": f"Hi {payload.name}, welcome to the City Graph API!"}

async def retrieve_graph():
    await extraction_pipeline()
    return {"message": "Graph retrieval process completed successfully."}