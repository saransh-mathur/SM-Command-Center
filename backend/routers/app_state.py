from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Any, Dict
from database import get_db
from models import AppState

router = APIRouter(prefix="/app-state", tags=["App State Persistence"])

@router.get("/{key}")
async def get_state(key: str, db: AsyncSession = Depends(get_db)):
    """Fetch a JSON value by key."""
    stmt = select(AppState).where(AppState.key == key)
    result = await db.execute(stmt)
    record = result.scalars().first()
    
    if record:
        return {"key": key, "value": record.value}
    return {"key": key, "value": None}

@router.post("/{key}")
async def set_state(key: str, value: Any = Body(...), db: AsyncSession = Depends(get_db)):
    """Set a JSON value for a key."""
    stmt = select(AppState).where(AppState.key == key)
    result = await db.execute(stmt)
    record = result.scalars().first()
    
    if record:
        record.value = value
    else:
        record = AppState(key=key, value=value)
        db.add(record)
        
    await db.commit()
    await db.refresh(record)
    return {"key": key, "value": record.value}
