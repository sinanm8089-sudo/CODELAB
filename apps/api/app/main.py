from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .db import Base, engine, SessionLocal
from .seed_data import seed_database
from .routes import (
    auth, preferences, projects, execution,
    ai, learning, algorithms, practice,
    focus, analytics, admin
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist and seed database
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

# Also seed immediately on module load so test runners have data instantly
Base.metadata.create_all(bind=engine)
_db = SessionLocal()
try:
    seed_database(_db)
finally:
    _db.close()

app = FastAPI(
    title="CODELAB IDE API",
    version=settings.version,
    description="Product: CODELAB IDE | Developer: Sinan Mohammed | Universal Multi-Language Platform & Web IDE",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS setup
origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(preferences.router)
app.include_router(projects.router)
app.include_router(execution.router)
app.include_router(ai.router)
app.include_router(learning.router)
app.include_router(algorithms.router)
app.include_router(practice.router)
app.include_router(focus.router)
app.include_router(analytics.router)
app.include_router(admin.router)

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "product": settings.app_name,
        "developer": settings.developer,
        "version": settings.version,
        "database": "connected"
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to CODELAB IDE API",
        "developer": settings.developer,
        "docs": "/docs"
    }
