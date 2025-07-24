from fastapi import APIRouter 
from app.api.v1.controllers import ping, retrieve_graph 
from app.api.v1.models import PingPayload, RetrivePayload


router = APIRouter()    

@router.post("/ping")
async def post_ping(payload: PingPayload):
    return await ping(payload)

@router.post("/graph/retrieve")
async def retrive_graph(paylaod: RetrivePayload):
    retrieve_graph_response = await retrieve_graph(paylaod.query)
    return retrieve_graph_response
