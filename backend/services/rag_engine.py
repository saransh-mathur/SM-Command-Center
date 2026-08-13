import logging
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from config import settings
from models_v2 import Entity
from services.llm_factory import get_llm_provider

logger = logging.getLogger("command_center.services.rag_engine")


def chunk_text(text: str, chunk_size: int = None, overlap: int = None) -> List[str]:
    """Split text into overlapping chunks by character count."""
    chunk_size = chunk_size or settings.RAG_CHUNK_SIZE
    overlap = overlap or settings.RAG_CHUNK_OVERLAP
    if not text or len(text) <= chunk_size:
        return [text] if text else []
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk.strip())
        start += chunk_size - overlap
    return chunks


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """Compute cosine similarity between two vectors."""
    a_arr = np.array(a, dtype=np.float32)
    b_arr = np.array(b, dtype=np.float32)
    dot = np.dot(a_arr, b_arr)
    norm_a = np.linalg.norm(a_arr)
    norm_b = np.linalg.norm(b_arr)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot / (norm_a * norm_b))


async def embed_text(text: str) -> List[float]:
    """Embed a single text string using the configured embedding model."""
    provider = get_llm_provider("ollama")
    return await provider.embed(settings.OLLAMA_EMBED_MODEL, text)


async def embed_and_store_entity(entity_id: UUID, db: AsyncSession) -> bool:
    """Embed an entity's textual content and store the vector."""
    entity = await db.get(Entity, entity_id)
    if not entity:
        logger.warning(f"Entity {entity_id} not found for embedding.")
        return False
    
    # Build text representation from entity fields
    text_parts = [entity.title]
    if isinstance(entity.data, dict):
        for key, value in entity.data.items():
            if isinstance(value, str) and len(value) > 5:
                text_parts.append(f"{key}: {value}")
    if entity.tags:
        text_parts.append("Tags: " + ", ".join(str(t) for t in entity.tags))
    
    full_text = "\n".join(text_parts)
    
    try:
        embedding = await embed_text(full_text[:2048])  # Truncate to avoid huge payloads
        if embedding:
            # Store as JSON list in the data column since SQLite doesn't support pgvector
            current_data = entity.data or {}
            current_data["_embedding"] = embedding
            entity.data = current_data
            from sqlalchemy.orm.attributes import flag_modified
            flag_modified(entity, 'data')
            await db.commit()
            logger.info(f"Embedded entity {entity_id} ({len(embedding)} dims)")
            return True
    except Exception as e:
        logger.error(f"Failed to embed entity {entity_id}: {e}")
    return False


async def semantic_search(
    query: str,
    workspace_id: UUID,
    db: AsyncSession,
    top_k: int = None,
    entity_type: Optional[str] = None
) -> List[Tuple[Entity, float]]:
    """
    Semantic search across workspace entities.
    Uses numpy cosine similarity fallback (no pgvector on SQLite).
    Returns list of (entity, score) tuples sorted by relevance.
    """
    top_k = top_k or settings.RAG_TOP_K
    
    try:
        query_embedding = await embed_text(query)
    except Exception as e:
        logger.error(f"Failed to embed query: {e}")
        return []
    
    if not query_embedding:
        return []
    
    # Fetch entities from workspace
    stmt = select(Entity).where(
        Entity.workspace_id == workspace_id,
        Entity.status == 'active'
    )
    if entity_type:
        stmt = stmt.where(Entity.entity_type == entity_type)
    
    result = await db.execute(stmt)
    entities = result.scalars().all()
    
    scored_results: List[Tuple[Entity, float]] = []
    
    for entity in entities:
        entity_embedding = None
        
        # Check for stored embedding in data JSON
        if isinstance(entity.data, dict) and "_embedding" in entity.data:
            entity_embedding = entity.data["_embedding"]
        
        if entity_embedding and len(entity_embedding) == len(query_embedding):
            score = cosine_similarity(query_embedding, entity_embedding)
            scored_results.append((entity, score))
        else:
            # Fallback: do a quick text relevance check (keyword match)
            text_repr = entity.title.lower()
            query_lower = query.lower()
            words = query_lower.split()
            match_count = sum(1 for w in words if w in text_repr)
            if match_count > 0:
                # Give a low score so embedded results rank higher
                scored_results.append((entity, 0.1 * (match_count / max(len(words), 1))))
    
    # Sort by score descending
    scored_results.sort(key=lambda x: x[1], reverse=True)
    return scored_results[:top_k]


def build_rag_context(results: List[Tuple[Entity, float]], max_tokens: int = 3000) -> str:
    """Build a context string from RAG results for the system prompt."""
    if not results:
        return ""
    
    context_parts = []
    total_len = 0
    
    for entity, score in results:
        entry = f"[{entity.entity_type}] {entity.title}"
        if isinstance(entity.data, dict):
            # Exclude internal fields
            visible_data = {k: v for k, v in entity.data.items() if not k.startswith('_')}
            if visible_data:
                # Truncate long values
                for k, v in visible_data.items():
                    val_str = str(v)[:200]
                    entry += f"\n  {k}: {val_str}"
        
        if total_len + len(entry) > max_tokens * 4:  # rough char estimate
            break
        
        context_parts.append(entry)
        total_len += len(entry)
    
    return "\n\n".join(context_parts)
