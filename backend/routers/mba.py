import datetime
from typing import Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from database import get_db
from services.mba_indexer import mba_indexer
from services.mba_ai import generate_mba_answer, get_premade_notes
from services.mba_rag import mba_rag
from models import DailyInput, MBASessionLog
from schemas import MBASessionLogCreate, MBASessionLogResponse

router = APIRouter(prefix="/mba", tags=["MBA Study Copilot"])

class ChatRequest(BaseModel):
    query: str = Field(..., description="User's academic or syllabus question")
    module_id: Optional[str] = Field(default="financial_accounting", description="Module identifier")

class StudyLogRequest(BaseModel):
    module_id: str
    topic: str
    minutes: int = Field(default=45, ge=5)

@router.get("/modules")
async def get_modules():
    """Returns the list of all 6 NMIMS MBA modules with file metadata and progress."""
    return mba_indexer.get_all_modules()

@router.get("/modules/{module_id}/notes")
async def get_module_notes(module_id: str):
    """Returns pre-made structured notes, LaTeX formula sheets, and slide takeaways for the module."""
    return get_premade_notes(module_id)

@router.post("/chat")
async def chat_with_mba_ai(payload: ChatRequest):
    """
    Q&A chatbot grounded in NMIMS textbooks & slides with local RAG,
    qwen3-embedding:4b vector search, and page citations.
    """
    response = await mba_rag.generate_rag_response(payload.query, payload.module_id)
    return response

@router.post("/rag-search")
async def search_textbook_passages(payload: ChatRequest):
    """Returns top semantic vector search passages from textbooks and slides."""
    passages = await mba_rag.search_relevant_passages(payload.query, payload.module_id, top_k=4)
    return {"module_id": payload.module_id, "query": payload.query, "passages": passages}

@router.post("/sessions", response_model=MBASessionLogResponse)
async def log_mba_session(payload: MBASessionLogCreate, db: AsyncSession = Depends(get_db)):
    """
    Logs a deep MBA study session into PostgreSQL mba_session_logs and increments
    today's daily controllable input tracker for mbaRecall.
    """
    # 1. Add to mba_session_logs
    log = MBASessionLog(
        subject=payload.subject,
        topic=payload.topic,
        duration_minutes=payload.duration_minutes,
        ai_notes_snapshot=payload.ai_notes_snapshot,
        created_at=datetime.datetime.utcnow()
    )
    db.add(log)

    # 2. Update today's daily_inputs (optional if handled by frontend, but good to have)
    today = datetime.date.today()
    stmt = select(DailyInput).where(DailyInput.date == today)
    res = await db.execute(stmt)
    record = res.scalars().first()
    if not record:
        record = DailyInput(date=today, deep_dev_blocks=1)
        db.add(record)
    else:
        record.deep_dev_blocks += 1
        record.updated_at = datetime.datetime.utcnow()

    await db.commit()
    await db.refresh(log)

    return MBASessionLogResponse(
        id=log.id,
        subject=log.subject,
        topic=log.topic,
        duration_minutes=log.duration_minutes,
        ai_notes_snapshot=log.ai_notes_snapshot,
        created_at=log.created_at.isoformat()
    )

@router.get("/sessions", response_model=list[MBASessionLogResponse])
async def list_mba_sessions(limit: int = 20, db: AsyncSession = Depends(get_db)):
    """Retrieves recent MBA study sessions from PostgreSQL."""
    stmt = select(MBASessionLog).order_by(desc(MBASessionLog.created_at)).limit(limit)
    result = await db.execute(stmt)
    records = result.scalars().all()
    
    return [
        MBASessionLogResponse(
            id=r.id,
            subject=r.subject,
            topic=r.topic,
            duration_minutes=r.duration_minutes,
            ai_notes_snapshot=r.ai_notes_snapshot,
            created_at=r.created_at.isoformat()
        )
        for r in records
    ]
