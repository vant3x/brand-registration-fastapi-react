from app.core.exceptions import (  # Assuming you'll create this exception
    BrandNotFoundError,
)
from app.domain.entities.brand import Brand
from app.domain.repositories.brand_repository import BrandRepository


class GetBrandUseCase:
    def __init__(self, brand_repository: BrandRepository):
        self.brand_repository = brand_repository

    async def execute(self, brand_id: int) -> Brand:
        brand = await self.brand_repository.get_by_id(brand_id)
        if not brand:
            raise BrandNotFoundError()
        return brand
