import asyncio
import csv
import json
import logging
import os
from datetime import datetime, timezone
import traceback

from celery_app import celery_app
import database
from models_v2 import IngestionLog, Entity
import uuid

logger = logging.getLogger("command_center.tasks.ingestion")

async def _process_ingestion_async(log_id: str, workspace_id: str, file_path: str, source_type: str, entity_type: str):
    """Async workhorse for the ingestion task."""
    logger.info(f"Starting ingestion process for log_id={log_id}, source={source_type}")
    
    async with database.async_session_factory() as session:
        log_uuid = uuid.UUID(log_id)
        ws_uuid = uuid.UUID(workspace_id)
        
        # Fetch the log entry and mark as processing
        log_entry = await session.get(IngestionLog, log_uuid)
        if not log_entry:
            logger.error(f"IngestionLog {log_id} not found.")
            return

        log_entry.status = "processing"
        await session.commit()

        records_processed = 0
        records_failed = 0
        error_detail = None

        try:
            if source_type == "csv_upload":
                with open(file_path, "r", encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    entities = []
                    for row in reader:
                        # Use the first column or 'title' column as title, fallback to generic
                        title = row.get("title") or row.get("name") or f"{entity_type.title()} Record"
                        entities.append(
                            Entity(
                                workspace_id=ws_uuid,
                                entity_type=entity_type,
                                title=title,
                                data=row,
                                source="csv_upload"
                            )
                        )
                        records_processed += 1
                    
                    # Bulk insert
                    if entities:
                        session.add_all(entities)
                        await session.commit()

            elif source_type == "json_upload":
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        entities = []
                        for item in data:
                            title = item.get("title") or item.get("name") or f"{entity_type.title()} Record"
                            entities.append(
                                Entity(
                                workspace_id=ws_uuid,
                                    entity_type=entity_type,
                                    title=title,
                                    data=item,
                                    source="json_upload"
                                )
                            )
                            records_processed += 1
                        if entities:
                            session.add_all(entities)
                            await session.commit()
                    else:
                        raise ValueError("JSON root must be an array of objects for bulk ingestion.")
                        
            elif source_type == "pdf_upload":
                # Simulated heavy document processing (>400K tokens)
                # In Phase 4, we would chunk and embed this into pgvector
                # For now, we store the metadata and raw text as an entity
                logger.info(f"Processing heavy PDF document at {file_path}")
                # Simulate heavy processing delay without blocking Event Loop
                await asyncio.sleep(5)
                
                title = file_path.split("/")[-1]
                entity = Entity(
                    workspace_id=ws_uuid,
                    entity_type=entity_type,
                    title=f"Document: {title}",
                    data={"file_path": file_path, "status": "processed_metadata_only"},
                    source="pdf_upload"
                )
                session.add(entity)
                await session.commit()
                records_processed = 1
                
            else:
                raise ValueError(f"Unsupported source_type: {source_type}")

            log_entry.status = "completed"
            
        except Exception as e:
            logger.error(f"Ingestion failed: {e}")
            await session.rollback()
            log_entry = await session.get(IngestionLog, log_uuid)
            log_entry.status = "failed"
            log_entry.error_detail = traceback.format_exc()
            records_failed = records_processed # Assuming rollback or partial commit logic
            records_processed = 0

        finally:
            # Update the log entry with final stats
            log_entry.records_processed = records_processed
            log_entry.records_failed = records_failed
            log_entry.completed_at = datetime.now(timezone.utc).replace(tzinfo=None)
            
            # Clean up the temporary file if it exists
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    logger.info(f"Cleaned up temporary file: {file_path}")
                except OSError as e:
                    logger.warning(f"Failed to clean up file {file_path}: {e}")

            session.add(log_entry)
            await session.commit()


@celery_app.task(name="tasks.ingestion.process_bulk_file", bind=True, max_retries=3)
def process_bulk_file(self, log_id: str, workspace_id: str, file_path: str, source_type: str, entity_type: str):
    """
    Celery task to handle heavy file ingestion asynchronously.
    Executes the async pipeline in a synchronous wrapper.
    """
    try:
        # Run the async DB operations in a new event loop
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        loop.run_until_complete(
            _process_ingestion_async(
                log_id=log_id, 
                workspace_id=workspace_id, 
                file_path=file_path, 
                source_type=source_type, 
                entity_type=entity_type
            )
        )
        return {"status": "success", "log_id": log_id}
    except (OSError, ValueError, json.JSONDecodeError) as err:
        logger.error(f"Fatal task payload error: {err}")
        return {"status": "failed", "reason": str(err)}
    except Exception as exc:
        logger.error(f"Transient task error, retrying: {exc}")
        raise self.retry(exc=exc, countdown=10)

import PyPDF2
from services.rag_engine import chunk_text, embed_text

async def _process_document_async(file_path: str, filename: str, workspace_id: str):
    logger.info(f"Processing document {filename}")
    text = ""
    if filename.lower().endswith('.pdf'):
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            text = "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
    elif filename.lower().endswith('.csv'):
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    elif filename.lower().endswith('.md') or filename.lower().endswith('.txt'):
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        logger.warning(f"Unsupported file type for {filename}")
        return

    if not text:
        logger.warning(f"No text extracted from {filename}")
        return

    chunks = chunk_text(text)
    
    async with database.async_session_factory() as session:
        ws_uuid = uuid.UUID(workspace_id)
        
        for i, chunk in enumerate(chunks):
            embedding = await embed_text(chunk)
            entity = Entity(
                workspace_id=ws_uuid,
                entity_type="document_chunk",
                title=f"{filename} - Chunk {i+1}",
                data={"content": chunk, "_embedding": embedding},
                source="document_upload"
            )
            session.add(entity)
        
        await session.commit()
    
    if os.path.exists(file_path):
        os.remove(file_path)
    logger.info(f"Finished processing document {filename}")

@celery_app.task(name="tasks.ingestion.process_document")
def process_document(file_path: str, filename: str, workspace_id: str):
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        loop.run_until_complete(_process_document_async(file_path, filename, workspace_id))
        return {"status": "success"}
    except Exception as exc:
        logger.error(f"Error in process_document: {exc}")
        return {"status": "failed", "reason": str(exc)}
