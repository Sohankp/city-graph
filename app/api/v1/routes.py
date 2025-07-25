from fastapi import APIRouter 
from app.api.v1.controllers import ping, retrieve_graph, upload_image
from app.api.v1.models import PingPayload, RetrivePayload, UploadImagePayload

router = APIRouter()    

@router.post("/ping")
async def post_ping(payload: PingPayload):
    return await ping(payload)

@router.post("/graph/retrieve")
async def post_retrive_graph(paylaod: RetrivePayload):
    retrieve_graph_response = await retrieve_graph(paylaod.query)
    return retrieve_graph_response

@router.post("/upload/image")
async def post_upload_image(payload: UploadImagePayload):
    return await upload_image(payload)
