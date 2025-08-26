from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Body, Depends, File, Form, UploadFile, status

from app.application.dto.brand_dto import CreateBrandDTO, UpdateBrandDTO
from app.application.use_cases.brand.create_brand import CreateBrandUseCase
from app.application.use_cases.brand.delete_brand import DeleteBrandUseCase
from app.application.use_cases.brand.get_brand import GetBrandUseCase
from app.application.use_cases.brand.get_presigned_url import GetPresignedUrlUseCase
from app.application.use_cases.brand.update_brand import UpdateBrandUseCase
from app.application.use_cases.brand.upload_brand_image import UploadBrandImageUseCase
from app.domain.entities.user import User
from app.presentation.api.dependencies.database import get_brand_repository
from app.presentation.api.dependencies.s3 import get_s3_service
from app.presentation.api.dependencies.security import get_current_user
from app.presentation.schemas.brand import BrandCreate, BrandResponse, BrandUpdate
from app.shared.enums.brand_status import BrandStatus

router = APIRouter(tags=["brands"])


@router.post("/", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
async def create_brand(
    brand_create: BrandCreate = Body(...),
    brand_repo=Depends(get_brand_repository),
    current_user: User = Depends(get_current_user),
):
    use_case = CreateBrandUseCase(brand_repo)
    dto = CreateBrandDTO(
        marca=brand_create.marca,
        titular=brand_create.titular,
        status=brand_create.status,
        pais_registro=brand_create.pais_registro,
        imagen_url=brand_create.imagen_url,
    )
    brand = await use_case.execute(dto)
    return brand


@router.put("/{brand_id}/image", response_model=BrandResponse)
async def upload_brand_image(
    brand_id: UUID,
    image_file: UploadFile = File(...),
    brand_repo=Depends(get_brand_repository),
    s3_service=Depends(get_s3_service),
    current_user: User = Depends(get_current_user),
):
    use_case = UploadBrandImageUseCase(brand_repo, s3_service)
    brand = await use_case.execute(
        brand_id=brand_id,
        file_content=await image_file.read(),
        file_name=image_file.filename,
    )
    return brand


@router.get("/{brand_id}/image/presigned-url", response_model=str)
async def get_brand_image_presigned_url(
    brand_id: UUID,
    brand_repo=Depends(get_brand_repository),
    s3_service=Depends(get_s3_service),
    # current_user: User = Depends(get_current_user),
):
    use_case = GetPresignedUrlUseCase(brand_repo, s3_service)
    presigned_url = await use_case.execute(brand_id)
    return presigned_url


@router.get("/{brand_id}", response_model=BrandResponse)
async def get_brand(
    brand_id: UUID,
    brand_repo=Depends(get_brand_repository),
    current_user: User = Depends(get_current_user),
):
    use_case = GetBrandUseCase(brand_repo)
    brand = await use_case.execute(brand_id)
    return brand


@router.get("/", response_model=List[BrandResponse])
async def get_all_brands(
    skip: int = 0,
    limit: int = 100,
    brand_repo=Depends(get_brand_repository),
):
    brands = await brand_repo.get_all(skip=skip, limit=limit)
    return brands


@router.put("/{brand_id}", response_model=BrandResponse)
async def update_brand(
    brand_id: UUID,
    marca: Optional[str] = Form(None),
    titular: Optional[str] = Form(None),
    status: Optional[BrandStatus] = Form(None),
    pais_registro: Optional[str] = Form(None),
    imagen_url: Optional[str] = Form(None),
    imagen_file: Optional[UploadFile] = File(None),
    brand_repo=Depends(get_brand_repository),
    s3_service=Depends(get_s3_service),
    current_user: User = Depends(get_current_user),
):
    image_content = None
    image_filename = None
    if imagen_file:
        image_content = await imagen_file.read()
        image_filename = imagen_file.filename

    use_case = UpdateBrandUseCase(brand_repo, s3_service)
    dto = UpdateBrandDTO(
        marca=marca,
        titular=titular,
        status=status,
        pais_registro=pais_registro,
        imagen_url=imagen_url,
        imagen_file_content=image_content,
        imagen_file_name=image_filename,
    )
    brand = await use_case.execute(brand_id, dto)
    return brand


@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_brand(
    brand_id: UUID,
    brand_repo=Depends(get_brand_repository),
    current_user: User = Depends(get_current_user),
):
    use_case = DeleteBrandUseCase(brand_repo)
    await use_case.execute(brand_id)
    return
