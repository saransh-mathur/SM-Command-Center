import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent
HOME_DIR = Path.home()

class Settings(BaseSettings):
    PROJECT_NAME: str = "SM Command Center API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("1", "true", "yes")

    # PostgreSQL Database URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+asyncpg://postgres:postgres@localhost:5432/command_center_db"
    )
    # Fallback to async SQLite if PostgreSQL server is not locally configured/accessible
    FALLBACK_DATABASE_URL: str = f"sqlite+aiosqlite:///{BASE_DIR / 'command_center.db'}"

    # CORS settings: Strict whitelist for local development and UI dashboard
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    # Dynamic Script & Telemetry Paths (with home-directory auto-resolution)
    TOGGLE_AGY_SCRIPT: str = os.getenv(
        "TOGGLE_AGY_SCRIPT", 
        str(HOME_DIR / "toggle_agy_dashboard.py")
    )
    UPDATE_DASHBOARD_SCRIPT: str = os.getenv(
        "UPDATE_DASHBOARD_SCRIPT", 
        str(HOME_DIR / "update_dashboard.py")
    )
    HTML_DASHBOARD_PATH: str = os.getenv(
        "HTML_DASHBOARD_PATH", 
        str(HOME_DIR / "laptop_health_dashboard.html")
    )
    MBA_NOTES_DIR: str = os.getenv(
        "MBA_NOTES_DIR",
        str(HOME_DIR / "MBA_Notes")
    )

    # Phase 3: Universal Command Center Infrastructure
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/1")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/2")
    VECTOR_DIMENSIONS: int = int(os.getenv("VECTOR_DIMENSIONS", "1536"))

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
