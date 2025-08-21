from datetime import datetime
from typing import Optional
from dataclasses import dataclass
from app.domain.value_objects.email import Email


@dataclass
class User:
    id: Optional[int] = None
    email: Email = None
    full_name: str = ""
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def deactivate(self) -> None:
        """Deactivate user - domain logic"""
        self.is_active = False
    
    def update_name(self, new_name: str) -> None:
        """Update user name with validation"""
        if not new_name or len(new_name.strip()) < 2:
            raise ValueError("Name must be at least 2 characters")
        self.full_name = new_name.strip()