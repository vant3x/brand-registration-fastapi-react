from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.brand import Brand


class BrandRepository(ABC):
    @abstractmethod
    async def create(self, brand: Brand) -> Brand:
        pass

    @abstractmethod
    async def get_by_id(self, brand_id: int) -> Optional[Brand]:
        pass

    @abstractmethod
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Brand]:
        pass

    @abstractmethod
    async def update(self, brand: Brand) -> Brand:
        pass

    @abstractmethod
    async def delete(self, brand_id: int) -> bool:
        pass
