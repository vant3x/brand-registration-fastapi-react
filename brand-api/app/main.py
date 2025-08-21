from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.exceptions import setup_exception_handlers
from app.presentation.api.v1.router import api_router

settings = get_settings()

app = FastAPI(title=settings.project_name, version="1.0.0", debug=settings.debug)


# app.add_middleware(
#    CORSMiddleware,
#    allow_origins=["*"],
#    allow_credentials=True,
#    allow_methods=["*"],
#    allow_headers=["*"],
# )

# Exception handlers
setup_exception_handlers(app)


# Routes
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/")
async def root():
    return {"message": "FastAPI CRUD - Marcas"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
