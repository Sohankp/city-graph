from fastapi import APIRouter 
from app.api.v1.controllers import ping  
from app.api.v1.models import PingPayload

router = APIRouter()    

@router.post("/ping")
async def post_ping(payload: PingPayload):
    return await ping(payload)