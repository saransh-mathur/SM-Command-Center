import asyncio
import logging
from datetime import datetime, timezone
import uuid

from celery_app import celery_app
from database import async_session_factory
from models_v2 import Entity, DailyTracker, MetricDefinition

logger = logging.getLogger("command_center.tasks.polling")

async def _poll_live_metrics_async():
    logger.info("Polling live metrics from YouTube and Stripe...")
    async with async_session_factory() as session:
        from sqlalchemy import select
        from models_v2 import Workspace
        
        # Query active workspaces
        result = await session.execute(select(Workspace).where(Workspace.is_active == True))
        workspaces = result.scalars().all()
        
        if not workspaces:
            logger.warning("No active workspaces found, skipping poll_live_metrics.")
            return

        for ws in workspaces:
            integrations = ws.config.get("integrations", {})
            
            # YouTube mock polling
            if integrations.get("youtube") == "active" or integrations.get("youtube") is True:
                youtube_data = {"subscribers": 1500, "views": 10000}
                yt_entity = Entity(
                    workspace_id=ws.id,
                    entity_type="youtube_metrics",
                    title="YouTube Live Metrics",
                    data=youtube_data,
                    source="youtube_api"
                )
                session.add(yt_entity)

            # Stripe mock polling
            if integrations.get("stripe") == "active" or integrations.get("stripe") is True:
                stripe_data = {"mrr": 5000, "active_subscriptions": 100}
                stripe_entity = Entity(
                    workspace_id=ws.id,
                    entity_type="stripe_metrics",
                    title="Stripe Live Metrics",
                    data=stripe_data,
                    source="stripe_api"
                )
                session.add(stripe_entity)
        
        # Save to DB
        await session.commit()
        logger.info("Successfully polled and stored live metrics for active integrations.")

@celery_app.task(name="tasks.polling.poll_live_metrics")
def poll_live_metrics():
    """Poll metrics from external APIs and update the DB."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        loop.run_until_complete(_poll_live_metrics_async())
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error in poll_live_metrics: {e}")
        return {"status": "failed", "reason": str(e)}
