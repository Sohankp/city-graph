import os
from typing import Optional
from google import genai


def initialize_gemini_client(
    credentials_path: str,
    project_id: str,
    location: str = "global",
    use_vertex_ai: bool = True
) -> genai.Client:
    """
    Initializes and returns a Gemini genai client.
    """
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
    client = genai.Client(vertexai=use_vertex_ai, project=project_id, location=location)
    return client


def generate_gemini_response(
    client: genai.Client,
    prompt: str,
    model: str = "gemini-2.5-flash",
    temperature: Optional[float] = None,
    top_p: Optional[float] = None,
    top_k: Optional[int] = None,
    max_output_tokens: Optional[int] = None
) -> str:
    """
    Generates a response from Gemini LLM.

    Parameters:
        - client: Initialized genai.Client
        - prompt: The prompt string to send
    Returns:
        - Response string
    """

    response = client.models.generate_content(
        model=model,
        contents=prompt
    )
    return response.text.strip()


# Usage in other files ########
# client = initialize_gemini_client(
#     credentials_path="C:\\Users\\sohan kp\\Downloads\\city-graph-466517-5bdbc7e0c25e.json",
#     project_id="city-graph-466517"
# )
# prompt = "Explain how generative AI is transforming smart cities."
# response = generate_gemini_response(client, prompt, temperature=0.7)
# print(response)