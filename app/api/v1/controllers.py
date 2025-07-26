from app.api.v1.models import PingPayload, UploadImagePayload
from app.core.workflows.ingestion_workflow.sub_agents.retrieval_agent.retrieve_runner import extraction_pipeline
from app.services.gemini import summarize_image, generate_response
from app.core.utils.common_utils import call_api
from google import genai
import os
import json
from app.core.workflows.ingestion_workflow.sub_agents.retrieval_agent.retrieve_tools import geocode_area, get_weather_by_coords

# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "city-graph-466517-5bdbc7e0c25e.json"
client = genai.Client(vertexai=True, project="city-graph-466517", location="global")

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

async def retrieve_overall_summary():
    categories = ['Weather','Traffic', 'Infrastructure', 'Public Events','Safety', 'Public Transport']
    response_dict  ={}
    for i in categories:
        response = call_api(
        url="https://fastapi-city-graph-1081552206448.asia-south1.run.app/api/v1/get/graph",
        method="POST",
        headers={"Content-Type": "application/json", "accept": "application/json"},
        data={
            "user_query": "Give me the most recent information about the {i} category",
            "group_id": [i]
        }
        )
        for res in response:
            res.pop("attributes", None)
        response_dict[i] = response

    final_json = str(response_dict)
    prompt = f"""
    You will be provided with a final JSON object containing data retrieved from the graph for various categories. 
    Your task is to analyze the data under each category and generate a concise summary of the key insights.

    For each category, if there is any significant or potentially critical information (e.g., a predictive alert or severe issue that citizens should be aware of), 
    you must include that in an 'alerts' field.
    Provide the summary in an array of points, and if there are no alerts, leave the 'alerts' field empty.

    The expected JSON output format is:
    {{
    category_name: {{
        "summary": ["Point 1", "Point 2", ...],
        "alerts": "..."  # leave empty if no alerts
    }},
    ...
    }}
    Here is the data you need to analyze:
    {final_json}
    """
    print(prompt, 'prompt')
    response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )
    return str(response.text.strip())

async def retrieve_mood_map():
    categories = ['Weather','Traffic', 'Infrastructure', 'Public Events','Safety', 'Public Transport']
    response_list = []
    for i in categories:
        response = call_api(
        url="https://fastapi-city-graph-1081552206448.asia-south1.run.app/api/v1/get/graph",
        method="POST",
        headers={"Content-Type": "application/json", "accept": "application/json"},
        data={
            "user_query": "Give me the most recent information about the {i} category",
            "group_id": [i]
        }
        )
        for res in response:
            res.pop("attributes", None)
        response_list.append(response)

    final_data = str(response_list)

    prompt = f"""
    You will be provided with a final list containing data retrieved from the graph for various areas of Bengaluru city. 
    this data will be used to create mood map for the city. 
    Your task is to analyze the data and generate a concise summary of the key insights along with the city name.

    For each news summary, provide me the city name and a mood associated with it from the below moods:
    - positive
    - negative
    - neutral

    DO NOT include news like:
    - Complaints or opinions about commuting in general  
    - Sarcastic, funny, or emotional venting  
    - News about new transport services, plans, launches, or fares  
    - Civic rants about hospitals, services, companies  
    - Promotions or medical news 

    give it in the below format:
    [{{
        "news_summary":"summary",
        "mood":"positive",
        "area":"Koramangala"
    }}, {{...}}, ...
    ]

    IMPORTANT: Do not include any additional text or explanations or ``` or any markdown format, just return the plain JSON object.

    Here is the data you need to analyze:
    {final_data}
    """
    response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )

    mood_data = json.loads(response.text.strip())
    results = []
    for mood in mood_data:
        lat, lng = geocode_area(mood['area'])
        results.append({
            **mood,
            "latitude":lat,
            "longitude":lng,
            "weather": get_weather_by_coords(lat, lng)
        })
    return results
    