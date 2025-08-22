

from app.application.dto.brand_dto import UpdateBrandDTO
from app.core.exceptions import BrandNotFoundError
from app.domain.entities.brand import Brand
from app.domain.repositories.brand_repository import BrandRepository
from app.infrastructure.external.s3_service import S3Service
import uuid


class UpdateBrandUseCase:
    def __init__(self, brand_repository: BrandRepository, s3_service: S3Service):
        self.brand_repository = brand_repository
        self.s3_service = s3_service

    async def execute(self, brand_id: int, brand_dto: UpdateBrandDTO) -> Brand:
        existing_brand = await self.brand_repository.get_by_id(brand_id)
        if not existing_brand:
            raise BrandNotFoundError()

        # Handle image upload/update
        if brand_dto.imagen_file_content and brand_dto.imagen_file_name:
            file_extension = brand_dto.imagen_file_name.split('.')[-1]
            object_name = f"brands/{uuid.uuid4()}.{file_extension}"
            
            new_image_url = self.s3_service.upload_file(
                file_content=brand_dto.imagen_file_content,
                object_name=object_name,
                content_type="image/jpeg" 
            )
            existing_brand.imagen_url = new_image_url
        elif brand_dto.imagen_url is not None:
            existing_brand.imagen_url = brand_dto.imagen_url

        if brand_dto.marca is not None:
            existing_brand.marca = brand_dto.marca
        if brand_dto.titular is not None:
            existing_brand.titular = brand_dto.titular
        if brand_dto.status is not None:
            existing_brand.status = brand_dto.status
        if brand_dto.pais_registro is not None:
            existing_brand.pais_registro = brand_dto.pais_registro

        return await self.brand_repository.update(existing_brand)
