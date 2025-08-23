from datetime import datetime
from typing import Optional
from uuid import UUID
from fastapi import UploadFile

from pydantic import BaseModel, Field

from app.shared.enums.brand_status import BrandStatus


# Base schema for brand properties
class BrandBase(BaseModel):
    marca: str = Field(..., min_length=2, max_length=100)
    titular: str = Field(..., min_length=2, max_length=100)
    status: BrandStatus
    pais_registro: Optional[str] = 'Colombia'
    imagen_url: Optional[str] = None


# Schema for creating a new brand
class BrandCreate(BrandBase):
    pass


# Schema for updating a brand
class BrandUpdate(BaseModel):
    marca: Optional[str] = Field(None, min_length=2, max_length=100)
    titular: Optional[str] = Field(None, min_length=2, max_length=100)
    status: Optional[BrandStatus]
    imagen_file: Optional[UploadFile] = None


# Schema for the response when a brand is returned
class BrandResponse(BrandBase):
    id: UUID
    pais_registro: Optional[str] = None
    imagen_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
