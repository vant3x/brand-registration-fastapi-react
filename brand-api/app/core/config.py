from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings
from typing import Optional


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
    rate_limit: str = Field(default="10/minute", env="RATE_LIMIT")

    # Cache
    redis_url: str = Field(default="redis://localhost:6379", env="REDIS_URL")

    # AWS S3
    aws_access_key_id: Optional[str] = Field(None, env="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: Optional[str] = Field(None, env="AWS_SECRET_ACCESS_KEY")
    aws_region_name: Optional[str] = Field(None, env="AWS_REGION_NAME")
    aws_s3_bucket_name: Optional[str] = Field(None, env="AWS_S3_BUCKET_NAME")

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
