import datetime
from typing import Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from services.mba_indexer import mba_indexer
from services.mba_ai import generate_mba_answer, get_premade_notes
from services.mba_rag import mba_rag

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

@router.post("/log-study")
async def log_mba_study_session(payload: StudyLogRequest, db: AsyncSession = Depends(get_db)):
    """
    Logs an MBA study sprint into PostgreSQL drill_logs and increments
    today's daily controllable input tracker.
    """
    # 1. Add to drill_logs
    log = DrillLog(
        category="MBA_STUDY",
        topic=f"{payload.module_id.replace('_', ' ').title()}: {payload.topic}",
        notes=f"Completed {payload.minutes}-minute focused study sprint with MBA Copilot.",
        created_at=datetime.datetime.utcnow()
    )
    db.add(log)

    # 2. Update today's daily_inputs
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

    return {
        "status": "success",
        "message": f"Logged {payload.minutes}m study sprint for {payload.topic} in PostgreSQL.",
        "daily_dev_blocks": record.deep_dev_blocks
    }
