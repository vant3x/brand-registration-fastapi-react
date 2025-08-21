from pydantic import BaseModel, EmailStr


from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class CreateUserDTO:
    email: str
    password: str
    full_name: Optional[str] = None


@dataclass(frozen=True)
class UpdateUserDTO:
    full_name: Optional[str] = None
    is_active: Optional[bool] = None


@dataclass(frozen=True)
class LoginDTO:
    email: str
    password: str