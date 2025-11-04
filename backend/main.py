"""
Main FastAPI application entry point
"""

import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn

from app.core.config import settings
from app.core.firebase import initialize_firebase
from app.core.logging import setup_logging
from app.routers import (
    auth,
    users,
    leads,
    companies,
    tasks,
    projects,
    communications,
    chat,
    notifications,
    analytics,
    ai,
    upload,
)
from app.middleware.auth import AuthMiddleware
from app.middleware.rate_limit import RateLimitMiddleware

# Setup logging
setup_logging()
logger = settings.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting AI-Driven BDE System Backend")

    # Initialize Firebase
    initialize_firebase()
    logger.info("Firebase initialized")

    # Initialize Redis connection
    from app.core.redis import init_redis
    await init_redis()
    logger.info("Redis connection established")

    yield

    # Shutdown
    logger.info("Shutting down AI-Driven BDE System Backend")

# Create FastAPI app
app = FastAPI(
    title="AI-Driven BDE System API",
    description="Backend API for AI-driven Business Development Executive management system",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS,
)

# Add custom middleware
app.add_middleware(RateLimitMiddleware)
app.add_middleware(AuthMiddleware)

# Include routers
api_prefix = "/api/v1"

app.include_router(auth.router, prefix=api_prefix, tags=["Authentication"])
app.include_router(users.router, prefix=api_prefix, tags=["Users"])
app.include_router(leads.router, prefix=api_prefix, tags=["Leads"])
app.include_router(companies.router, prefix=api_prefix, tags=["Companies"])
app.include_router(tasks.router, prefix=api_prefix, tags=["Tasks"])
app.include_router(projects.router, prefix=api_prefix, tags=["Projects"])
app.include_router(communications.router, prefix=api_prefix, tags=["Communications"])
app.include_router(chat.router, prefix=api_prefix, tags=["Chat"])
app.include_router(notifications.router, prefix=api_prefix, tags=["Notifications"])
app.include_router(analytics.router, prefix=api_prefix, tags=["Analytics"])
app.include_router(ai.router, prefix=api_prefix, tags=["AI"])
app.include_router(upload.router, prefix=api_prefix, tags=["Upload"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI-Driven BDE System API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI-Driven BDE System Backend",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )