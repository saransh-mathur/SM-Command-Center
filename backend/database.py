import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import text as sa_text
from config import settings

logger = logging.getLogger("command_center.database")

Base = declarative_base()

# Attempt primary PostgreSQL async engine
try:
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=False,
        future=True,
        pool_pre_ping=True
    )
    async_session_factory = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
except Exception as e:
    logger.warning(f"Failed to create engine with primary URL: {e}. Falling back to SQLite.")
    engine = create_async_engine(
        settings.FALLBACK_DATABASE_URL,
        echo=False,
        future=True
    )
    async_session_factory = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False
    )

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that provides an async database session per request."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_db():
    """Initializes the database schema and verifies connectivity."""
    global engine, async_session_factory
    try:
        async with engine.begin() as conn:
            # Attempt to enable pgvector extension (PostgreSQL only, safe to fail on SQLite)
            try:
                await conn.execute(sa_text("CREATE EXTENSION IF NOT EXISTS vector"))
                logger.info("pgvector extension enabled.")
            except Exception:
                logger.info("pgvector extension not available (may be on SQLite fallback).")

            await conn.run_sync(Base.metadata.create_all)
        logger.info(f"Database schema initialized successfully using: {engine.url.render_as_string(hide_password=True)}")
    except Exception as e:
        logger.warning(f"Could not initialize primary database ({e}). Activating async SQLite fallback...")
        engine = create_async_engine(settings.FALLBACK_DATABASE_URL, echo=False, future=True)
        async_session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Fallback SQLite database initialized successfully at command_center.db")

# Import all models so they register with Base.metadata
# Legacy models (Phase 1-2)
import models  # noqa: F401
# Dynamic models (Phase 3 - Universal Command Center)
import models_v2  # noqa: F401
