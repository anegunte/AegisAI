import os

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    API_PORT: int = int(os.getenv("PORT", 8000))
    API_HOST: str = "0.0.0.0"

settings = Settings()
