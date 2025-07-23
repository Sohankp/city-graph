from pydantic import Field
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv(verbose=True, override=True, dotenv_path=".env")

def get_secret(key: str) -> str:
    """
    Retrieve a secret from the environment variables.
    """
    if key in os.environ:
        return os.environ.get(key)  
    else:
        #TODO: Handle the case where the secret is from key vault or another secure store
        raise KeyError(f"Secret '{key}' not found in environment variables.")

class AppConfig(BaseSettings):
    """
    Application configuration settings.
    """
    app_name: str = "City Graph"
    version: str = "1.0.0"
    debug: bool = True
    gemini_api_key: str = Field(alias="GEMINI_API_KEY")
    twitter_bearer_token: str = Field(alias="TWITTER_BEARER_TOKEN")
    google_maps_api_key: str = Field(alias="GOOGLE_MAPS_API_KEY")

try:
    app_config = AppConfig()
    app_config.gemini_api_key = get_secret("GEMINI_API_KEY")
    app_config.twitter_bearer_token = get_secret("TWITTER_BEARER_TOKEN")
    app_config.google_maps_api_key = get_secret("GOOGLE_MAPS_API_KEY")

except Exception as e:
    raise RuntimeError(f"Failed to load application configuration: {e}")