from app.application.dto.brand_dto import CreateBrandDTO
from app.domain.entities.brand import Brand
from app.domain.repositories.brand_repository import BrandRepository


class CreateBrandUseCase:
    def __init__(self, brand_repository: BrandRepository):
        self.brand_repository = brand_repository

    async def execute(self, brand_dto: CreateBrandDTO) -> Brand:
        brand = Brand(
            id=None,
            marca=brand_dto.marca,
            titular=brand_dto.titular,
            status=brand_dto.status,
            pais_registro=brand_dto.pais_registro,
            imagen_url=brand_dto.imagen_url,  # The URL might be passed directly, or will be None
            created_at=None,
            updated_at=None,
        )
        return await self.brand_repository.create(brand)
