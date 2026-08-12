import os
from celery import Celery

# Setup environment to ensure we can load config
os.environ.setdefault("FORCELOAD", "1")
from config import settings

celery_app = Celery(
    "command_center",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["tasks.ingestion"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    worker_prefetch_multiplier=1,  # Good for long-running heavy tasks
)

from celery.signals import worker_process_init

@worker_process_init.connect
def init_celery_db(**kwargs):
    """Initialize database connection (and SQLite fallback if needed) in each Celery worker process."""
    import asyncio
    from database import init_db
    # Run the init_db coroutine to establish connection or trigger fallback
    loop = asyncio.get_event_loop()
    if loop.is_closed():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    loop.run_until_complete(init_db())
