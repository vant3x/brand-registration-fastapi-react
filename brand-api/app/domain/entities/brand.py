from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from uuid import UUID

from app.shared.enums.brand_status import BrandStatus


@dataclass
class Brand:
    marca: str
    titular: str
    status: BrandStatus

    id: Optional[UUID] = None
    pais_registro: Optional[str] = "Colombia"
    imagen_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
