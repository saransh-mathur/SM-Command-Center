import json
import logging
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from database import get_db
from services.llm_factory import get_llm_provider
from services.rag_engine import semantic_search, build_rag_context, embed_and_store_entity

logger = logging.getLogger("command_center.routers.ai")

router = APIRouter(prefix="/ai", tags=["AI & Agentic Engine"])


# --- Schemas ---
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4096)
    workspace_id: Optional[str] = None
    model: Optional[str] = None
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    use_rag: bool = True


class EmbedRequest(BaseModel):
    entity_id: str


class ChatMessage(BaseModel):
    role: str
    content: str


# --- Endpoints ---

@router.get("/health")
async def ai_health():
    """Check if the AI engine (Ollama) is reachable."""
    provider = get_llm_provider("ollama")
    is_healthy = await provider.health_check()
    return {
        "ollama_status": "online" if is_healthy else "offline",
        "ollama_url": settings.OLLAMA_BASE_URL,
        "default_chat_model": settings.OLLAMA_CHAT_MODEL,
        "default_embed_model": settings.OLLAMA_EMBED_MODEL,
    }


@router.get("/models")
async def list_models():
    """List all locally installed Ollama models."""
    provider = get_llm_provider("ollama")
    is_healthy = await provider.health_check()
    if not is_healthy:
        raise HTTPException(
            status_code=503,
            detail="Ollama service is not running. Start it with 'ollama serve'."
        )
    models = await provider.list_models()
    return {
        "provider": "ollama",
        "base_url": settings.OLLAMA_BASE_URL,
        "models": models,
        "default_chat_model": settings.OLLAMA_CHAT_MODEL,
        "default_embed_model": settings.OLLAMA_EMBED_MODEL,
    }


@router.post("/chat")
async def chat_stream(
    req: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Streaming chat endpoint with optional RAG context injection.
    Returns Server-Sent Events (SSE) for real-time token streaming.
    """
    provider = get_llm_provider("ollama")
    is_healthy = await provider.health_check()
    if not is_healthy:
        raise HTTPException(
            status_code=503,
            detail="Ollama service is not running. Start it with 'ollama serve'."
        )
    
    model = req.model or settings.OLLAMA_CHAT_MODEL
    
    # Build system prompt with RAG context if workspace is specified
    system_prompt = (
        "/no_think\n"
        "You are the Command Center AI Assistant. You help users analyze their workspace data, "
        "answer questions, and provide insights. Be concise, accurate, and helpful. "
        "When referencing workspace data, cite the specific entity or record."
    )
    
    if req.use_rag and req.workspace_id:
        try:
            ws_id = uuid.UUID(req.workspace_id)
            rag_results = await semantic_search(req.message, ws_id, db)
            context = build_rag_context(rag_results)
            if context:
                system_prompt += (
                    "\n\n--- WORKSPACE CONTEXT (retrieved data relevant to the user's query) ---\n"
                    f"{context}"
                    "\n--- END CONTEXT ---\n\n"
                    "Use the above context to ground your answers when relevant. "
                    "If the context doesn't contain relevant information, say so and answer from general knowledge."
                )
        except (ValueError, Exception) as e:
            logger.warning(f"RAG retrieval failed, proceeding without context: {e}")
    
    async def event_stream():
        in_think_block = False
        try:
            async for token in provider.generate_stream(
                model=model,
                prompt=req.message,
                system=system_prompt,
                temperature=req.temperature
            ):
                # Filter out <think>...</think> blocks from qwen3
                if "<think>" in token:
                    in_think_block = True
                    continue
                if "</think>" in token:
                    in_think_block = False
                    continue
                if in_think_block:
                    continue
                # SSE format
                data = json.dumps({"token": token})
                yield f"data: {data}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as e:
            logger.error(f"Chat stream error: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@router.post("/embed")
async def embed_entity(
    req: EmbedRequest,
    db: AsyncSession = Depends(get_db)
):
    """Trigger embedding generation for a specific entity."""
    provider = get_llm_provider("ollama")
    is_healthy = await provider.health_check()
    if not is_healthy:
        raise HTTPException(
            status_code=503,
            detail="Ollama service is not running. Cannot generate embeddings."
        )
    
    try:
        entity_uuid = uuid.UUID(req.entity_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid entity_id format")
    
    success = await embed_and_store_entity(entity_uuid, db)
    if not success:
        raise HTTPException(status_code=404, detail="Entity not found or embedding failed")
    
    return {"status": "embedded", "entity_id": req.entity_id}


@router.post("/embed/workspace/{workspace_id}")
async def embed_workspace(
    workspace_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Batch-embed all entities in a workspace."""
    from sqlalchemy import select
    from models_v2 import Entity
    
    result = await db.execute(
        select(Entity.id).where(
            Entity.workspace_id == workspace_id,
            Entity.status == 'active'
        )
    )
    entity_ids = [row[0] for row in result.all()]
    
    if not entity_ids:
        return {"status": "no_entities", "count": 0}
    
    embedded = 0
    failed = 0
    for eid in entity_ids:
        try:
            success = await embed_and_store_entity(eid, db)
            if success:
                embedded += 1
            else:
                failed += 1
        except Exception as e:
            logger.error(f"Failed to embed entity {eid}: {e}")
            failed += 1
    
    return {
        "status": "completed",
        "total": len(entity_ids),
        "embedded": embedded,
        "failed": failed
    }
