import logging
import os
import shutil
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from anyio import to_thread

from database import get_db
from models_v2 import IngestionLog, Workspace
from schemas_v2 import IngestionLogResponse

# Import the celery app and task signature
from celery_app import celery_app

logger = logging.getLogger("command_center.routers.ingestion")

router = APIRouter(prefix="/ingestion", tags=["Ingestion & Webhooks"])

# Ensure temp directory exists for uploads
TEMP_UPLOAD_DIR = "/tmp/command_center_ingestion"
os.makedirs(TEMP_UPLOAD_DIR, exist_ok=True)

@router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_document(
    workspace_id: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Endpoint for uploading documents (PDF, CSV, Markdown).
    Offloads chunking and embedding to Celery workers.
    """
    # 1. Verify workspace exists
    workspace_uuid = uuid.UUID(workspace_id)
    workspace = await db.get(Workspace, workspace_uuid)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    # 2. Save file temporarily
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ""
    temp_filename = f"{uuid.uuid4()}{file_ext}"
    temp_filepath = os.path.join(TEMP_UPLOAD_DIR, temp_filename)
    
    def _save_upload(filepath, file_obj):
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file_obj, buffer)
            
    try:
        await to_thread.run_sync(_save_upload, temp_filepath, file.file)
    except Exception as e:
        logger.error(f"Failed to save uploaded file: {e}")
        raise HTTPException(status_code=500, detail="Failed to save file for processing")

    # 3. Dispatch Celery Task
    logger.info(f"Dispatching process_document task for {file.filename}")
    celery_app.send_task(
        "tasks.ingestion.process_document",
        args=[
            temp_filepath,
            file.filename,
            str(workspace_id)
        ]
    )

    return {"message": "Document accepted for processing"}


@router.post("/webhook/{workspace_id}/{entity_type}", status_code=status.HTTP_202_ACCEPTED)
async def generic_webhook_receiver(
    workspace_id: uuid.UUID,
    entity_type: str,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Generic Webhook Receiver.
    Accepts arbitrary JSON payloads, saves them to disk, and queues them for async polymorphic ingestion.
    """
    workspace = await db.get(Workspace, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    # Save payload to temp file for worker processing
    temp_filename = f"webhook_{uuid.uuid4()}.json"
    temp_filepath = os.path.join(TEMP_UPLOAD_DIR, temp_filename)
    
    import json
    
    def _save_webhook(filepath, pld):
        with open(filepath, "w", encoding="utf-8") as f:
            # Wrap single objects in array for bulk consistency
            if isinstance(pld, dict):
                pld = [pld]
            json.dump(pld, f)
            
    await to_thread.run_sync(_save_webhook, temp_filepath, payload)

    log_entry = IngestionLog(
        workspace_id=workspace_id,
        source_type="webhook",
        source_name=f"webhook_{entity_type}",
        status="pending"
    )
    db.add(log_entry)
    await db.commit()
    await db.refresh(log_entry)

    celery_app.send_task(
        "tasks.ingestion.process_bulk_file",
        args=[
            str(log_entry.id), 
            str(workspace_id), 
            temp_filepath, 
            "json_upload", 
            entity_type
        ]
    )

    return {"message": "Webhook payload received and queued for processing", "log_id": str(log_entry.id)}


@router.get("/logs/{workspace_id}", response_model=List[IngestionLogResponse])
async def get_ingestion_logs(
    workspace_id: uuid.UUID,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve the immutable audit trail of ingestion events for a workspace."""
    result = await db.execute(
        select(IngestionLog)
        .where(IngestionLog.workspace_id == workspace_id)
        .order_by(IngestionLog.started_at.desc())
        .limit(limit)
    )
    return result.scalars().all()
