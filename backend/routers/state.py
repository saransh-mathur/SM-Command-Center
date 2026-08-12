import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from database import get_db
from models import DailyInput, DrillLog, SystemLog
from schemas import DailyInputsResponse, DailyInputsUpdate, DrillLogCreate, DrillLogResponse

router = APIRouter(prefix="/state", tags=["State & PostgreSQL Persistence"])

@router.get("/daily-inputs", response_model=DailyInputsResponse)
async def get_today_daily_inputs(db: AsyncSession = Depends(get_db)):
    """
    Fetches today's controllable inputs record from PostgreSQL.
    If no record exists for today, initializes a fresh record.
    """
    today = datetime.date.today()
    stmt = select(DailyInput).where(DailyInput.date == today)
    result = await db.execute(stmt)
    record = result.scalars().first()

    if not record:
        record = DailyInput(
            date=today,
            applications_sent=0,
            deep_coding_solved=0,
            deep_dev_blocks=0
        )
        db.add(record)
        await db.commit()
        await db.refresh(record)

    return DailyInputsResponse(
        id=record.id,
        date=str(record.date),
        applications_sent=record.applications_sent,
        deep_coding_solved=record.deep_coding_solved,
        deep_dev_blocks=record.deep_dev_blocks,
        updated_at=record.updated_at.isoformat() if record.updated_at else None
    )

@router.put("/daily-inputs", response_model=DailyInputsResponse)
@router.post("/daily-inputs", response_model=DailyInputsResponse)
async def update_daily_inputs(payload: DailyInputsUpdate, db: AsyncSession = Depends(get_db)):
    """
    Updates today's controllable inputs record in PostgreSQL.
    """
    today = datetime.date.today()
    stmt = select(DailyInput).where(DailyInput.date == today)
    result = await db.execute(stmt)
    record = result.scalars().first()

    if not record:
        record = DailyInput(date=today)
        db.add(record)

    if payload.applications_sent is not None:
        record.applications_sent = payload.applications_sent
    if payload.deep_coding_solved is not None:
        record.deep_coding_solved = payload.deep_coding_solved
    if payload.deep_dev_blocks is not None:
        record.deep_dev_blocks = payload.deep_dev_blocks

    record.updated_at = datetime.datetime.utcnow()
    await db.commit()
    await db.refresh(record)

    return DailyInputsResponse(
        id=record.id,
        date=str(record.date),
        applications_sent=record.applications_sent,
        deep_coding_solved=record.deep_coding_solved,
        deep_dev_blocks=record.deep_dev_blocks,
        updated_at=record.updated_at.isoformat() if record.updated_at else None
    )

@router.post("/drill-logs", response_model=DrillLogResponse)
async def create_drill_log(payload: DrillLogCreate, db: AsyncSession = Depends(get_db)):
    """Logs a completed DSA, PREP interview, or MBA study drill into PostgreSQL."""
    log = DrillLog(
        category=payload.category,
        topic=payload.topic,
        notes=payload.notes,
        created_at=datetime.datetime.utcnow()
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)

    return DrillLogResponse(
        id=log.id,
        category=log.category,
        topic=log.topic,
        notes=log.notes,
        created_at=log.created_at.isoformat()
    )

@router.get("/drill-logs", response_model=List[DrillLogResponse])
async def list_drill_logs(limit: int = 10, db: AsyncSession = Depends(get_db)):
    """Retrieves recent drill records from PostgreSQL."""
    stmt = select(DrillLog).order_by(desc(DrillLog.created_at)).limit(limit)
    result = await db.execute(stmt)
    records = result.scalars().all()

    return [
        DrillLogResponse(
            id=r.id,
            category=r.category,
            topic=r.topic,
            notes=r.notes,
            created_at=r.created_at.isoformat()
        )
        for r in records
    ]

@router.get("/system-logs")
async def list_system_logs(limit: int = 10, db: AsyncSession = Depends(get_db)):
    """Retrieves recent system log events from PostgreSQL."""
    stmt = select(SystemLog).order_by(desc(SystemLog.timestamp)).limit(limit)
    result = await db.execute(stmt)
    records = result.scalars().all()
    return [r.to_dict() for r in records]
