from app.core.exceptions import BrandNotFoundError
from app.domain.repositories.brand_repository import BrandRepository


class DeleteBrandUseCase:
    def __init__(self, brand_repository: BrandRepository):
        self.brand_repository = brand_repository

    async def execute(self, brand_id: int) -> bool:
        brand_deleted = await self.brand_repository.delete(brand_id)
        if not brand_deleted:
            raise BrandNotFoundError()
        return brand_deleted
