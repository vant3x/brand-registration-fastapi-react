from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# Base schema for brand properties
class BrandBase(BaseModel):
    marca: str = Field(..., min_length=2, max_length=100)
    titular: str = Field(..., min_length=2, max_length=100)
    estado: str = Field(..., min_length=2, max_length=50)


# Schema for creating a new brand
class BrandCreate(BrandBase):
    pass


# Schema for updating a brand
class BrandUpdate(BaseModel):
    marca: Optional[str] = Field(None, min_length=2, max_length=100)
    titular: Optional[str] = Field(None, min_length=2, max_length=100)
    estado: Optional[str] = Field(None, min_length=2, max_length=50)


# Schema for the response when a brand is returned
class BrandResponse(BrandBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
