from pydantic import BaseModel, Field

class PingPayload(BaseModel):
    name: str = Field(..., description="The name of the user")