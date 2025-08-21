from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = Field(..., env="DATABASE_URL")
    environment: str
    # Security
    secret_key: str = Field(..., env="SECRET_KEY")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # API
    api_v1_prefix: str = "/api/v1"
    project_name: str = "FastAPI CRUD brands"
    debug: bool = False

    # Cache
    redis_url: str = Field(default="redis://localhost:6379", env="REDIS_URL")

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
