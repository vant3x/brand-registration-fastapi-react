from app.application.dto.brand_dto import CreateBrandDTO
from app.domain.entities.brand import Brand
from app.domain.repositories.brand_repository import BrandRepository
from app.infrastructure.external.s3_service import S3Service
import uuid
import mimetypes


class CreateBrandUseCase:
    def __init__(self, brand_repository: BrandRepository, s3_service: S3Service):
        self.brand_repository = brand_repository
        self.s3_service = s3_service

    async def execute(self, brand_dto: CreateBrandDTO) -> Brand:
        image_url = brand_dto.imagen_url

        if brand_dto.imagen_file_content and brand_dto.imagen_file_name:
            file_extension = brand_dto.imagen_file_name.split('.')[-1]
            object_name = f"brands/{uuid.uuid4()}.{file_extension}"
            
            guessed_mime_type, _ = mimetypes.guess_type(brand_dto.imagen_file_name)
            content_type = guessed_mime_type if guessed_mime_type else "image/jpeg" # Default to jpeg if cannot guess

            try:
                image_url = self.s3_service.upload_file(
                    file_content=brand_dto.imagen_file_content,
                    object_name=object_name,
                    content_type=content_type
                )
            except Exception as e:
                print(f"Error uploading image to S3: {e}")
                # Decide how to handle the error: re-raise, log, return original URL, etc.
                # For now, we'll proceed without the image_url if upload fails
                image_url = brand_dto.imagen_url # Revert to original or keep as None if it was None

        brand = Brand(
            id=None,
            marca=brand_dto.marca,
            titular=brand_dto.titular,
            status=brand_dto.status,
            pais_registro=brand_dto.pais_registro,
            imagen_url=image_url,
            created_at=None,
            updated_at=None,
        )
        return await self.brand_repository.create(brand)
