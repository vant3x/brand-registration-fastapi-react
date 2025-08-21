from dataclasses import dataclass
from datetime import datetime
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from app.shared.enums.brand_status import BrandStatus


@dataclass
class Brand:
    # Fields without default values
    marca: str
    titular: str
    status: BrandStatus

    # Fields with default values
    id: Optional[int] = None
    pais_registro: Optional[str] = 'Colombia'
    imagen_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
