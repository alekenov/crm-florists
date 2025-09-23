"""
Main FastAPI application with SQLModel
Following official SQLModel best practices
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import api_router
from app.db import create_db_and_tables
from app.seed_data import create_seed_data

# Create FastAPI app
app = FastAPI(
    title="CRM for Florists API",
    description="API для системы управления цветочным бизнесом",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router with version prefix
app.include_router(api_router, prefix="/api")

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    create_db_and_tables()
    print("✅ Database initialized with SQLModel structure")

    # Create seed data
    create_seed_data()
    print("✅ Seed data initialized")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "CRM for Florists API v2.0",
        "structure": "SQLModel with proper separation",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "framework": "FastAPI + SQLModel",
        "version": "2.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8011,
        reload=True
    )