

from app.application.dto.brand_dto import UpdateBrandDTO
from app.core.exceptions import BrandNotFoundError
from app.domain.entities.brand import Brand
from app.domain.repositories.brand_repository import BrandRepository


class UpdateBrandUseCase:
    def __init__(self, brand_repository: BrandRepository):
        self.brand_repository = brand_repository

    async def execute(self, brand_id: int, brand_dto: UpdateBrandDTO) -> Brand:
        existing_brand = await self.brand_repository.get_by_id(brand_id)
        if not existing_brand:
            raise BrandNotFoundError()

        # Update fields if provided in DTO
        if brand_dto.marca is not None:
            existing_brand.marca = brand_dto.marca
        if brand_dto.titular is not None:
            existing_brand.titular = brand_dto.titular
        if brand_dto.estado is not None:
            existing_brand.estado = brand_dto.estado

        return await self.brand_repository.update(existing_brand)
