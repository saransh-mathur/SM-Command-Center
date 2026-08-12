import logging
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm.attributes import flag_modified

from database import get_db
from models_v2 import Entity, Workspace
from schemas_v2 import EntityCreate, EntityUpdate, EntityResponse, EntityListResponse

logger = logging.getLogger('command_center.routers.entities')

router = APIRouter(prefix="/entities", tags=["Entities"])

@router.post("/", response_model=EntityResponse, status_code=status.HTTP_201_CREATED)
async def create_entity(entity_in: EntityCreate, db: AsyncSession = Depends(get_db)):
    workspace = await db.get(Workspace, entity_in.workspace_id)
    if not workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")

    logger.info(f"Creating entity of type {entity_in.entity_type} for workspace {entity_in.workspace_id}")
    entity = Entity(
        workspace_id=entity_in.workspace_id,
        entity_type=entity_in.entity_type,
        title=entity_in.title,
        data=entity_in.data or {},
        tags=entity_in.tags or [],
        source=entity_in.source,
        status='active'
    )
    db.add(entity)
    await db.commit()
    await db.refresh(entity)
    return entity

@router.get("/", response_model=EntityListResponse)
async def list_entities(
    workspace_id: uuid.UUID,
    entity_type: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    query = select(Entity).where(Entity.workspace_id == workspace_id)
    
    if entity_type:
        query = query.where(Entity.entity_type == entity_type)
    if status:
        query = query.where(Entity.status == status)
    else:
        query = query.where(Entity.status != 'archived')
        
    if search:
        query = query.where(Entity.title.ilike(f'%{search}%'))
        
    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    # Get items
    query = query.limit(limit).offset(offset)
    result = await db.execute(query)
    items = result.scalars().all()
    
    return EntityListResponse(items=items, total=total)

@router.get("/{entity_id}", response_model=EntityResponse)
async def get_entity(
    entity_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Entity).where(Entity.id == entity_id, Entity.status != 'archived'))
    entity = result.scalar_one_or_none()
    if not entity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entity not found")
    return entity

@router.patch("/{entity_id}", response_model=EntityResponse)
async def update_entity(
    entity_id: uuid.UUID,
    entity_in: EntityUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Entity).where(Entity.id == entity_id, Entity.status != 'archived'))
    entity = result.scalar_one_or_none()
    if not entity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entity not found")
    
    update_data = entity_in.model_dump(exclude_unset=True)
    
    if 'data' in update_data:
        # Shallow merge
        current_data = entity.data or {}
        new_data = update_data.pop('data')
        current_data.update(new_data)
        entity.data = current_data
        flag_modified(entity, 'data')
        
    for key, value in update_data.items():
        setattr(entity, key, value)
        
    await db.commit()
    await db.refresh(entity)
    return entity

@router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entity(
    entity_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Entity).where(Entity.id == entity_id))
    entity = result.scalar_one_or_none()
    if not entity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entity not found")
    
    entity.status = 'archived'
    await db.commit()
    return None

@router.post("/bulk", response_model=dict)
async def bulk_create_entities(entities_in: List[EntityCreate], db: AsyncSession = Depends(get_db)):
    if not entities_in:
        return {"created_count": 0}

    workspace_id = entities_in[0].workspace_id
    workspace = await db.get(Workspace, workspace_id)
    if not workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")

    logger.info(f"Bulk creating {len(entities_in)} entities")
    entities = [
        Entity(
            workspace_id=e.workspace_id,
            entity_type=e.entity_type,
            title=e.title,
            data=e.data or {},
            tags=e.tags or [],
            source=e.source,
            status='active'
        ) for e in entities_in
    ]
    db.add_all(entities)
    await db.commit()
    return {"created_count": len(entities_in)}
