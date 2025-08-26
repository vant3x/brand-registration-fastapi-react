from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import get_settings
from app.core.exceptions import setup_exception_handlers
from app.core.limiter import limiter
from app.core.middleware import logging_and_timing_middleware
from app.presentation.api.v1.router import api_router

settings = get_settings()
app = FastAPI(title=settings.project_name, version="1.0.0", debug=settings.debug)

# Middleware
app.add_middleware(BaseHTTPMiddleware, dispatch=logging_and_timing_middleware)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)


app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/")
async def root():
    return {"message": "FastAPI CRUD - Marcas"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
