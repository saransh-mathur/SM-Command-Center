import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import init_db
from routers import telemetry, system, containers, state, mba, app_state, setup_config, auth
from routers import workspaces, entities, metrics, ingestion, ai

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("command_center.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database & Schema
    logger.info("Initializing SM Command Center Backend...")
    await init_db()
    
    # Security: Ensure Admin Password
    auth.ensure_admin_account_exists()
    
    logger.info("SM Command Center Backend online and ready.")
    yield
    # Shutdown
    logger.info("Shutting down SM Command Center Backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for Frontend UI (http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api prefix
app.include_router(telemetry.router, prefix=settings.API_PREFIX)
app.include_router(system.router, prefix=settings.API_PREFIX)
app.include_router(containers.router, prefix=settings.API_PREFIX)
app.include_router(state.router, prefix=settings.API_PREFIX)
app.include_router(mba.router, prefix=settings.API_PREFIX)
app.include_router(app_state.router, prefix=settings.API_PREFIX)
app.include_router(setup_config.router, prefix=settings.API_PREFIX)
app.include_router(auth.router, prefix=settings.API_PREFIX)

# Phase 3: Universal Command Center Dynamic Infrastructure
app.include_router(workspaces.router, prefix=settings.API_PREFIX)
app.include_router(entities.router, prefix=settings.API_PREFIX)
app.include_router(metrics.router, prefix=settings.API_PREFIX)
app.include_router(ingestion.router, prefix=settings.API_PREFIX)

# Phase 4: Agentic Engine & AI Integration
app.include_router(ai.router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "healthy",
        "docs": "/docs",
        "api": settings.API_PREFIX
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "database": "connected",
        "frontend_origin": "http://localhost:3000"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main.py:app", 
        host=settings.HOST, 
        port=settings.PORT, 
        reload=settings.DEBUG
    )
