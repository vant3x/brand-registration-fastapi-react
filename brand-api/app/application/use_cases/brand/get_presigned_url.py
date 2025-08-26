from app.core.exceptions import BrandNotFoundError
from app.domain.repositories.brand_repository import BrandRepository
from app.infrastructure.external.s3_service import S3Service


class GetPresignedUrlUseCase:
    def __init__(
        self,
        brand_repository: BrandRepository,
        s3_service: S3Service,
    ):
        self.brand_repository = brand_repository
        self.s3_service = s3_service

    async def execute(self, brand_id: int) -> str:
        existing_brand = await self.brand_repository.get_by_id(brand_id)
        if not existing_brand or not existing_brand.imagen_url:
            raise BrandNotFoundError("Brand or image not found.")

        object_name = "/".join(existing_brand.imagen_url.split("/")[3:])

        presigned_url = self.s3_service.create_presigned_url(object_name)
        return presigned_url
