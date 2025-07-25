import os
from google import genai
from google.genai import types
import google.generativeai as google_genai

def summarize_image(image_b64: str, prompt: str = "Please summarize the following image:") -> str:
    """Loads an image, sends it to Gemini, and returns a summary text."""
    client = genai.Client(vertexai=True, project="city-graph-466517",location="global")
    mime="image/jpeg"

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            prompt,
            types.Part.from_bytes(data=image_b64, mime_type=mime)
        ],
        config=types.GenerateContentConfig(response_modalities=["TEXT"])
    )
    return response.text


def generate_response(prompt: str) -> str:
    """Generates a response based on the text and link provided."""
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "city-graph-466517-5bdbc7e0c25e.json"
    google_genai.configure(api_key="AIzaSyABScX7i7ATruOWy-DorTxz2Sm9A4_BZqw") 
    model = google_genai.GenerativeModel("gemini-2.5-pro")
    response = model.generate_content(prompt)
    return response.text.strip()
