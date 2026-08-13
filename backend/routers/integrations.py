from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm.attributes import flag_modified
from pydantic import BaseModel
import uuid

from database import get_db
from models_v2 import Workspace

router = APIRouter(prefix="/integrations", tags=["Integrations"])

class IntegrationConfig(BaseModel):
    workspace_id: str
    integrations: dict

@router.get("/config")
async def get_integrations_config(workspace_id: str, db: AsyncSession = Depends(get_db)):
    try:
        ws_uuid = uuid.UUID(workspace_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid workspace ID format")

    stmt = select(Workspace).where(Workspace.id == ws_uuid)
    result = await db.execute(stmt)
    workspace = result.scalar_one_or_none()

    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    integrations = workspace.config.get("integrations", {})
    return {"workspace_id": str(workspace.id), "integrations": integrations}

@router.post("/config")
async def update_integrations_config(payload: IntegrationConfig, db: AsyncSession = Depends(get_db)):
    try:
        ws_uuid = uuid.UUID(payload.workspace_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid workspace ID format")

    stmt = select(Workspace).where(Workspace.id == ws_uuid)
    result = await db.execute(stmt)
    workspace = result.scalar_one_or_none()

    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    config = dict(workspace.config)
    config["integrations"] = payload.integrations
    workspace.config = config
    flag_modified(workspace, "config")
    
    await db.commit()
    
    return {"status": "success", "integrations": workspace.config["integrations"]}
