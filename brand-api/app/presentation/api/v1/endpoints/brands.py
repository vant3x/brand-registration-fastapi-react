from typing import List, Optional

from fastapi import APIRouter, Depends, status, File, UploadFile, Form

from app.presentation.api.dependencies.s3 import get_s3_service

from app.application.dto.brand_dto import CreateBrandDTO, UpdateBrandDTO
from app.application.use_cases.brand.create_brand import CreateBrandUseCase
from app.application.use_cases.brand.delete_brand import DeleteBrandUseCase
from app.application.use_cases.brand.get_brand import GetBrandUseCase
from app.application.use_cases.brand.update_brand import UpdateBrandUseCase
from app.presentation.api.dependencies.database import get_brand_repository
from app.presentation.schemas.brand import BrandCreate, BrandResponse, BrandUpdate
from app.shared.enums.brand_status import BrandStatus

router = APIRouter(tags=["brands"])


@router.post("/", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
async def create_brand(
    marca: str = Form(...),
    titular: str = Form(...),
    status: BrandStatus = Form(...),
    pais_registro: Optional[str] = Form('Colombia'),
    imagen_url: Optional[str] = Form(None),
    imagen_file: Optional[UploadFile] = File(None),
    brand_repo=Depends(get_brand_repository),
    s3_service=Depends(get_s3_service),
):
    image_content = None
    image_filename = None
    if imagen_file:
        image_content = await imagen_file.read()
        image_filename = imagen_file.filename

    use_case = CreateBrandUseCase(brand_repo, s3_service)
    dto = CreateBrandDTO(
        marca=marca,
        titular=titular,
        status=status,
        pais_registro=pais_registro,
        imagen_url=imagen_url,
        imagen_file_content=image_content,
        imagen_file_name=image_filename,
    )
    brand = await use_case.execute(dto)
    return BrandResponse(
        id=brand.id,
        marca=brand.marca,
        titular=brand.titular,
        status=brand.status,
        pais_registro=brand.pais_registro,
        imagen_url=brand.imagen_url,
        created_at=brand.created_at,
        updated_at=brand.updated_at,
    )


@router.get("/{brand_id}", response_model=BrandResponse)
async def get_brand(brand_id: int, brand_repo=Depends(get_brand_repository)):
    use_case = GetBrandUseCase(brand_repo)
    brand = await use_case.execute(brand_id)
    return BrandResponse(
        id=brand.id,
        marca=brand.marca,
        titular=brand.titular,
        status=brand.status,
        pais_registro=brand.pais_registro,
        imagen_url=brand.imagen_url,
        created_at=brand.created_at,
        updated_at=brand.updated_at,
    )


@router.get("/", response_model=List[BrandResponse])
async def get_all_brands(
    skip: int = 0, limit: int = 100, brand_repo=Depends(get_brand_repository)
):
    
    brands = await brand_repo.get_all(skip=skip, limit=limit)
    return [
        BrandResponse(
            id=brand.id,
            marca=brand.marca,
            titular=brand.titular,
            status=brand.status,
            pais_registro=brand.pais_registro,
            imagen_url=brand.imagen_url,
            created_at=brand.created_at,
            updated_at=brand.updated_at,
        )
        for brand in brands
    ]


@router.put("/{brand_id}", response_model=BrandResponse)
async def update_brand(
    brand_id: int,
    marca: Optional[str] = Form(None),
    titular: Optional[str] = Form(None),
    status: Optional[BrandStatus] = Form(None),
    pais_registro: Optional[str] = Form(None),
    imagen_url: Optional[str] = Form(None),
    imagen_file: Optional[UploadFile] = File(None),
    brand_repo=Depends(get_brand_repository),
    s3_service=Depends(get_s3_service),
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
    return BrandResponse(
        id=brand.id,
        marca=brand.marca,
        titular=brand.titular,
        pais_registro=brand.pais_registro,
        status=brand.status,
        imagen_url=brand.imagen_url,
        created_at=brand.created_at,
        updated_at=brand.updated_at,
    )


@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_brand(brand_id: int, brand_repo=Depends(get_brand_repository)):
    use_case = DeleteBrandUseCase(brand_repo)
    await use_case.execute(brand_id)
    return  
