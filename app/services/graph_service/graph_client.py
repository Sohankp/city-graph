from graphiti_core import Graphiti
from graphiti_core.llm_client.gemini_client import GeminiClient, LLMConfig
from graphiti_core.embedder.gemini import GeminiEmbedder, GeminiEmbedderConfig
from graphiti_core.cross_encoder.gemini_reranker_client import GeminiRerankerClient
from app.services.graph_service.graph_settings import API_KEY, NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD
from google import genai
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\Users\\sohan kp\\Downloads\\city-graph-466517-5bdbc7e0c25e.json"
client = genai.Client(  vertexai=True, project="city-graph-466517",location="global")

graphiti = Graphiti(
    NEO4J_URI,
    NEO4J_USER,
    NEO4J_PASSWORD,
    llm_client=GeminiClient(
        client=client
    ),
    embedder=GeminiEmbedder(
       config=GeminiEmbedderConfig(
          embedding_model="text-embedding-005",
           embedding_dim=768
      ),
       client=client,
    ),
    cross_encoder=GeminiRerankerClient(
        client=client
    )
)