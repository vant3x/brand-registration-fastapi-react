from typing import List

from app.domain.entities.brand import Brand
from app.domain.repositories.brand_repository import BrandRepository


class GetAllBrandsUseCase:
    def __init__(self, brand_repository: BrandRepository):
        self.brand_repository = brand_repository

    async def execute(self, skip: int = 0, limit: int = 100) -> List[Brand]:
        return await self.brand_repository.get_all(skip=skip, limit=limit)
