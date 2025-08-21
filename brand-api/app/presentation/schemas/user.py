from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# Base schema for user properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)


# Schema for creating a new user
class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


# Schema for updating a user
class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    is_active: Optional[bool] = None


# Schema for user login
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Schema for the response when a user is returned
class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Schema for the token response
class Token(BaseModel):
    access_token: str
    token_type: str
