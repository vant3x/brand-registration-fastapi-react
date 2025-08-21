from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Brand:
    # Fields without default values
    marca: str
    titular: str
    estado: str

    # Fields with default values
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
