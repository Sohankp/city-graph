from pydantic import BaseModel, Field

class PingPayload(BaseModel):
    name: str = Field(..., description="The name of the user")

class RetrivePayload(BaseModel):
    query: str = Field(..., description="The query to retrieve data from the graph")