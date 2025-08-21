from dataclasses import dataclass
from typing import Optional

from app.shared.enums.brand_status import BrandStatus


@dataclass(frozen=True)
class CreateBrandDTO:
    marca: str
    titular: str
    status: BrandStatus
    pais_registro: Optional[str] = 'Colombia'
    imagen_url: Optional[str] = None


@dataclass(frozen=True)
class UpdateBrandDTO:
    marca: Optional[str] = None
    titular: Optional[str] = None
    status: Optional[BrandStatus] = None
    pais_registro: Optional[str] = 'Colombia'

