import uuid
import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
import logging

from models_v2 import Workspace, Entity, DailyTracker

logger = logging.getLogger("command_center.services.ai_tools")

# --- Tool Schemas for Ollama ---

OLLAMA_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "update_daily_metric",
            "description": "Update a specific daily metric for the current date.",
            "parameters": {
                "type": "object",
                "properties": {
                    "metric_name": {
                        "type": "string",
                        "description": "The name or key of the metric to update (e.g., 'workouts', 'sales', 'pages_read')."
                    },
                    "value": {
                        "type": "number",
                        "description": "The numeric value to set for the metric."
                    }
                },
                "required": ["metric_name", "value"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "toggle_integration",
            "description": "Enable or disable a workspace integration.",
            "parameters": {
                "type": "object",
                "properties": {
                    "integration_name": {
                        "type": "string",
                        "description": "The name of the integration to toggle (e.g., 'github', 'notion', 'slack')."
                    },
                    "state": {
                        "type": "boolean",
                        "description": "True to enable the integration, False to disable."
                    }
                },
                "required": ["integration_name", "state"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_quick_note",
            "description": "Create a quick note entity in the workspace.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "The title of the note."
                    },
                    "content": {
                        "type": "string",
                        "description": "The detailed content or body of the note."
                    }
                },
                "required": ["title", "content"]
            }
        }
    }
]

# --- Tool Implementations ---

async def update_daily_metric(metric_name: str, value: float, workspace_id: str, db: AsyncSession) -> str:
    """Updates a daily metric for the current date."""
    try:
        ws_id = uuid.UUID(workspace_id)
        today = datetime.date.today()
        
        # Check if tracker exists for today
        result = await db.execute(
            select(DailyTracker).where(
                DailyTracker.workspace_id == ws_id,
                DailyTracker.date == today
            )
        )
        tracker = result.scalars().first()
        
        if tracker:
            # Update existing tracker
            metrics = dict(tracker.metrics or {})
            metrics[metric_name] = value
            tracker.metrics = metrics
            await db.commit()
            return f"Updated metric '{metric_name}' to {value} for today ({today})."
        else:
            # Create new tracker
            new_tracker = DailyTracker(
                workspace_id=ws_id,
                date=today,
                metrics={metric_name: value},
                targets={}
            )
            db.add(new_tracker)
            await db.commit()
            return f"Created new tracker and set metric '{metric_name}' to {value} for today ({today})."
    except Exception as e:
        logger.error(f"Error in update_daily_metric: {e}")
        return f"Failed to update metric: {str(e)}"

async def toggle_integration(integration_name: str, state: bool, workspace_id: str, db: AsyncSession) -> str:
    """Enables or disables a workspace integration."""
    try:
        ws_id = uuid.UUID(workspace_id)
        result = await db.execute(select(Workspace).where(Workspace.id == ws_id))
        workspace = result.scalars().first()
        
        if not workspace:
            return f"Workspace not found."
            
        # Ensure config exists and is a dictionary
        config = dict(workspace.config or {})
        integrations = config.get("integrations", {})
        if not isinstance(integrations, dict):
            integrations = {}
            
        integrations[integration_name] = state
        config["integrations"] = integrations
        
        workspace.config = config
        await db.commit()
        
        state_str = "enabled" if state else "disabled"
        return f"Successfully {state_str} integration '{integration_name}'."
    except Exception as e:
        logger.error(f"Error in toggle_integration: {e}")
        return f"Failed to toggle integration: {str(e)}"

async def create_quick_note(title: str, content: str, workspace_id: str, db: AsyncSession) -> str:
    """Creates a quick note entity."""
    try:
        ws_id = uuid.UUID(workspace_id)
        note = Entity(
            workspace_id=ws_id,
            entity_type='note',
            title=title,
            data={"content": content},
            source="ai_tool"
        )
        db.add(note)
        await db.commit()
        return f"Created quick note '{title}' successfully."
    except Exception as e:
        logger.error(f"Error in create_quick_note: {e}")
        return f"Failed to create quick note: {str(e)}"

# --- Registry Map ---

TOOL_FUNCTIONS = {
    "update_daily_metric": update_daily_metric,
    "toggle_integration": toggle_integration,
    "create_quick_note": create_quick_note,
}
