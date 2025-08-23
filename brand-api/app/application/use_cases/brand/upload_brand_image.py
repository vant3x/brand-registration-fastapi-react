import uuid
import mimetypes

from app.core.exceptions import BrandNotFoundError
from app.domain.entities.brand import Brand
from app.domain.repositories.brand_repository import BrandRepository
from app.infrastructure.external.s3_service import S3Service


class UploadBrandImageUseCase:
    def __init__(
        self,
        brand_repository: BrandRepository,
        s3_service: S3Service,
    ):
        self.brand_repository = brand_repository
        self.s3_service = s3_service

    async def execute(
        self,
        brand_id: int,
        file_content: bytes,
        file_name: str,
    ) -> Brand:
        existing_brand = await self.brand_repository.get_by_id(brand_id)
        if not existing_brand:
            raise BrandNotFoundError()

        file_extension = file_name.split('.')[-1]
        object_name = f"brands/{uuid.uuid4()}.{file_extension}"
        content_type, _ = mimetypes.guess_type(file_name)
        
        image_url = self.s3_service.upload_file(
            file_content=file_content,
            object_name=object_name,
            content_type=content_type or "image/jpeg",
        )

        existing_brand.imagen_url = image_url
        
        updated_brand = await self.brand_repository.update(existing_brand)

        return updated_brand
