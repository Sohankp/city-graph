from app.api.v1.models import PingPayload, UploadImagePayload
from app.core.workflows.ingestion_workflow.sub_agents.retrieval_agent.retrieve_runner import extraction_pipeline
from app.services.gemini import summarize_image, generate_response
from app.core.utils.common_utils import call_api

async def ping(payload: PingPayload):
    return {"message": f"Hi {payload.name}, welcome to the City Graph API!"}

async def retrieve_graph(query:str):
    result = await extraction_pipeline(query)
    return result

async def upload_image(payload: UploadImagePayload):
    summary = summarize_image(payload.image_b64)
    print(f"Image summary: {summary}")
    prompt = """Summarize the image with description: {summary},
    Image description: {image_description},
    The image is located at: {location}, 
    Timestamp of the image upload: {timestamp}

    based on the above information, Summarize the entry, preserving key facts:
    - timestamp: Date of the event
    - sentiment: Positive / Negative / Neutral
    - location: Key location(s) and nearby areas
    - advisory: Any warnings, alerts, disruptions

    Categorize the summary under:
    - Weather
    - Traffic
    - Infrastructure
    - Public Events
    - Safety
    - Public Transport
    - Civic Issues

    give me a json object like this:
    {{
        "category": "Weather",
        "summary": "A brief summary of the image."
    }}
    
    IMPORTANT: Do not include any additional text or explanations or ``` or any markdown format, just return the plain JSON object.
    """
    prompt = prompt.format(
        summary=summary,
        image_description=payload.image_description,
        location=payload.location,
        timestamp=payload.timestamp
    )
    response = generate_response(prompt)
    print(f"Generated response: {response}")
    category = response.get("category", "Uncategorized")
    summary = response.get("summary", "No summary available.")

    call_api(
        url="https://fastapi-city-graph-1081552206448.asia-south1.run.app/api/v1/add/episode",
        method="POST",
        headers={"Content-Type": "application/json", "accept": "application/json"},
        data={
            "name": "City Updates",
            "episode_body": summary,
            "source_description": "Banglore city news updates through image",
            "group_id": category
        }
    )

    return {'response': f"Image uploaded successfully. Category: {category}, Summary: {summary}"}