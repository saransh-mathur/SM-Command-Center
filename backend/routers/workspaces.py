import logging
import re
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models_v2 import Workspace
from schemas_v2 import WorkspaceCreate, WorkspaceUpdate, WorkspaceResponse

logger = logging.getLogger('command_center.routers.workspaces')

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])

def generate_slug(name: str) -> str:
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug).strip('-')
    return slug

@router.post("/", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
async def create_workspace(workspace_in: WorkspaceCreate, db: AsyncSession = Depends(get_db)):
    logger.info(f"Creating workspace with name: {workspace_in.name}")
    slug = generate_slug(workspace_in.name)
    
    workspace = Workspace(
        name=workspace_in.name,
        slug=slug,
        persona_type=workspace_in.persona_type,
        config=workspace_in.config or {}
    )
    db.add(workspace)
    await db.commit()
    await db.refresh(workspace)
    return workspace

@router.get("/", response_model=List[WorkspaceResponse])
async def list_workspaces(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Workspace).where(Workspace.is_active == True))
    return result.scalars().all()

@router.get("/{workspace_id}", response_model=WorkspaceResponse)
async def get_workspace(workspace_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id, Workspace.is_active == True))
    workspace = result.scalar_one_or_none()
    if not workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    return workspace

@router.patch("/{workspace_id}", response_model=WorkspaceResponse)
async def update_workspace(workspace_id: str, workspace_update: WorkspaceUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id, Workspace.is_active == True))
    workspace = result.scalar_one_or_none()
    if not workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    
    update_data = workspace_update.model_dump(exclude_unset=True)
    if 'name' in update_data:
        workspace.slug = generate_slug(update_data['name'])
        
    for key, value in update_data.items():
        setattr(workspace, key, value)
        
    await db.commit()
    await db.refresh(workspace)
    return workspace

@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workspace(workspace_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id))
    workspace = result.scalar_one_or_none()
    if not workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    
    workspace.is_active = False
    await db.commit()
    return None
