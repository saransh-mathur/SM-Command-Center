import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "SM Command Center API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    # PostgreSQL Database URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+asyncpg://postgres:postgres@localhost:5432/command_center_db"
    )
    # Fallback to async SQLite if PostgreSQL server is not locally configured/accessible
    FALLBACK_DATABASE_URL: str = "sqlite+aiosqlite:///./command_center.db"

    # CORS settings for Frontend UI
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

    # Script Paths
    TOGGLE_AGY_SCRIPT: str = "/home/saransh/toggle_agy_dashboard.py"
    UPDATE_DASHBOARD_SCRIPT: str = "/home/saransh/update_dashboard.py"
    HTML_DASHBOARD_PATH: str = "/home/saransh/laptop_health_dashboard.html"

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
