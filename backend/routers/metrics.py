import logging
import datetime
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm.attributes import flag_modified

from database import get_db
from models_v2 import MetricDefinition, DailyTracker
from schemas_v2 import (
    MetricDefinitionCreate, MetricDefinitionUpdate, MetricDefinitionResponse,
    DailyTrackerUpdate, DailyTrackerResponse
)

logger = logging.getLogger('command_center.routers.metrics')

router = APIRouter(prefix="/metrics", tags=["Dynamic Metrics"])

class MetricIncrementRequest(BaseModel):
    workspace_id: str
    metric_key: str

# Metric Definitions
@router.post("/definitions", response_model=MetricDefinitionResponse, status_code=status.HTTP_201_CREATED)
async def create_metric_definition(definition_in: MetricDefinitionCreate, db: AsyncSession = Depends(get_db)):
    definition = MetricDefinition(**definition_in.model_dump())
    db.add(definition)
    await db.commit()
    await db.refresh(definition)
    return definition

@router.get("/definitions", response_model=List[MetricDefinitionResponse])
async def list_metric_definitions(workspace_id: str, db: AsyncSession = Depends(get_db)):
    query = select(MetricDefinition).where(
        and_(
            MetricDefinition.workspace_id == workspace_id,
            MetricDefinition.is_active == True
        )
    ).order_by(MetricDefinition.sort_order)
    result = await db.execute(query)
    return result.scalars().all()

@router.patch("/definitions/{definition_id}", response_model=MetricDefinitionResponse)
async def update_metric_definition(
    definition_id: str, 
    definition_update: MetricDefinitionUpdate, 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(MetricDefinition).where(MetricDefinition.id == definition_id))
    definition = result.scalar_one_or_none()
    if not definition:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Definition not found")
        
    for key, value in definition_update.model_dump(exclude_unset=True).items():
        setattr(definition, key, value)
        
    await db.commit()
    await db.refresh(definition)
    return definition

@router.delete("/definitions/{definition_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_metric_definition(definition_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MetricDefinition).where(MetricDefinition.id == definition_id))
    definition = result.scalar_one_or_none()
    if not definition:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Definition not found")
        
    definition.is_active = False
    await db.commit()
    return None

# Daily Tracker
@router.get("/daily", response_model=DailyTrackerResponse)
async def get_daily_tracker(workspace_id: str, db: AsyncSession = Depends(get_db)):
    today = datetime.date.today()
    query = select(DailyTracker).where(
        and_(DailyTracker.workspace_id == workspace_id, DailyTracker.date == today)
    )
    result = await db.execute(query)
    tracker = result.scalar_one_or_none()
    
    if not tracker:
        tracker = DailyTracker(
            workspace_id=workspace_id,
            date=today,
            metrics={}
        )
        db.add(tracker)
        await db.commit()
        await db.refresh(tracker)
        
    return tracker

@router.post("/daily/increment", response_model=DailyTrackerResponse)
async def increment_metric(request: MetricIncrementRequest, db: AsyncSession = Depends(get_db)):
    today = datetime.date.today()
    query = select(DailyTracker).where(
        and_(DailyTracker.workspace_id == request.workspace_id, DailyTracker.date == today)
    )
    result = await db.execute(query)
    tracker = result.scalar_one_or_none()
    
    if not tracker:
        tracker = DailyTracker(
            workspace_id=request.workspace_id,
            date=today,
            metrics={}
        )
        db.add(tracker)
        
    metrics = tracker.metrics or {}
    metrics[request.metric_key] = metrics.get(request.metric_key, 0) + 1
    tracker.metrics = metrics
    flag_modified(tracker, 'metrics')
    
    await db.commit()
    await db.refresh(tracker)
    return tracker

@router.post("/daily/decrement", response_model=DailyTrackerResponse)
async def decrement_metric(request: MetricIncrementRequest, db: AsyncSession = Depends(get_db)):
    today = datetime.date.today()
    query = select(DailyTracker).where(
        and_(DailyTracker.workspace_id == request.workspace_id, DailyTracker.date == today)
    )
    result = await db.execute(query)
    tracker = result.scalar_one_or_none()
    
    if not tracker:
        tracker = DailyTracker(
            workspace_id=request.workspace_id,
            date=today,
            metrics={}
        )
        db.add(tracker)
        
    metrics = tracker.metrics or {}
    current_val = metrics.get(request.metric_key, 0)
    metrics[request.metric_key] = max(0, current_val - 1)
    tracker.metrics = metrics
    flag_modified(tracker, 'metrics')
    
    await db.commit()
    await db.refresh(tracker)
    return tracker

@router.put("/daily", response_model=DailyTrackerResponse)
async def update_daily_tracker(tracker_update: DailyTrackerUpdate, db: AsyncSession = Depends(get_db)):
    today = datetime.date.today()
    query = select(DailyTracker).where(
        and_(DailyTracker.workspace_id == tracker_update.workspace_id, DailyTracker.date == today)
    )
    result = await db.execute(query)
    tracker = result.scalar_one_or_none()
    
    if not tracker:
        tracker = DailyTracker(
            workspace_id=tracker_update.workspace_id,
            date=today,
            metrics=tracker_update.metrics
        )
        db.add(tracker)
    else:
        tracker.metrics = tracker_update.metrics
        flag_modified(tracker, 'metrics')
        
    await db.commit()
    await db.refresh(tracker)
    return tracker

@router.get("/daily/history", response_model=List[DailyTrackerResponse])
async def get_daily_history(
    workspace_id: str, 
    days: int = 7, 
    db: AsyncSession = Depends(get_db)
):
    cutoff_date = datetime.date.today() - datetime.timedelta(days=days)
    query = select(DailyTracker).where(
        and_(
            DailyTracker.workspace_id == workspace_id,
            DailyTracker.date >= cutoff_date
        )
    ).order_by(DailyTracker.date.desc())
    
    result = await db.execute(query)
    return result.scalars().all()
