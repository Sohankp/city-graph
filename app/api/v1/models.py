from pydantic import BaseModel, Field

class PingPayload(BaseModel):
    name: str = Field(..., description="The name of the user")

class RetrivePayload(BaseModel):
    query: str = Field(..., description="The query to retrieve data from the graph")

class UploadImagePayload(BaseModel):
    image_b64: str = Field(..., description="Base64 encoded image string to upload")
    image_description: str = Field(..., description="Description of the image for summarization")
    location: str = Field(..., description="Location associated with the image")
    tags: list[str] = Field(default_factory=list, description="Tags associated with the image")
    timestamp: str = Field(..., description="Timestamp of the image upload")