from fastapi import FastAPI
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.project_name,
    version="1.0.0",
    debug=settings.debug
)


@app.get("/")
async def root():
    return {"message": "FastAPI CRUD - Marcas"}


@app.get("/health")
async def health():
    return {"status": "healthy"}