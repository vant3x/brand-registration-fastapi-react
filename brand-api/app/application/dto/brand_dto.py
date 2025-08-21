from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class CreateBrandDTO:
    marca: str
    titular: str
    estado: str


@dataclass(frozen=True)
class UpdateBrandDTO:
    marca: Optional[str] = None
    titular: Optional[str] = None
    estado: Optional[str] = None
