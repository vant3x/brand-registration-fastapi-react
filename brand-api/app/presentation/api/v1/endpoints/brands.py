from typing import List

from fastapi import APIRouter, Depends, status

from app.application.dto.brand_dto import CreateBrandDTO, UpdateBrandDTO
from app.application.use_cases.brand.create_brand import CreateBrandUseCase
from app.application.use_cases.brand.delete_brand import DeleteBrandUseCase
from app.application.use_cases.brand.get_brand import GetBrandUseCase
from app.application.use_cases.brand.update_brand import UpdateBrandUseCase
from app.presentation.api.dependencies.database import get_brand_repository
from app.presentation.schemas.brand import BrandCreate, BrandResponse, BrandUpdate

router = APIRouter(tags=["brands"])


@router.post("/", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
async def create_brand(
    brand_data: BrandCreate, brand_repo=Depends(get_brand_repository)
):
    use_case = CreateBrandUseCase(brand_repo)
    dto = CreateBrandDTO(
        marca=brand_data.marca, titular=brand_data.titular, estado=brand_data.estado
    )
    brand = await use_case.execute(dto)
    return BrandResponse(
        id=brand.id,
        marca=brand.marca,
        titular=brand.titular,
        estado=brand.estado,
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
        estado=brand.estado,
        created_at=brand.created_at,
        updated_at=brand.updated_at,
    )


@router.get("/", response_model=List[BrandResponse])
async def get_all_brands(
    skip: int = 0, limit: int = 100, brand_repo=Depends(get_brand_repository)
):
    # This use case is not explicitly defined, but the repository has get_all
    # For simplicity, we'll call the repository directly here.
    # In a more complex scenario, a GetAllBrandsUseCase would be appropriate.
    brands = await brand_repo.get_all(skip=skip, limit=limit)
    return [
        BrandResponse(
            id=brand.id,
            marca=brand.marca,
            titular=brand.titular,
            estado=brand.estado,
            created_at=brand.created_at,
            updated_at=brand.updated_at,
        )
        for brand in brands
    ]


@router.put("/{brand_id}", response_model=BrandResponse)
async def update_brand(
    brand_id: int, brand_data: BrandUpdate, brand_repo=Depends(get_brand_repository)
):
    use_case = UpdateBrandUseCase(brand_repo)
    dto = UpdateBrandDTO(
        marca=brand_data.marca, titular=brand_data.titular, estado=brand_data.estado
    )
    brand = await use_case.execute(brand_id, dto)
    return BrandResponse(
        id=brand.id,
        marca=brand.marca,
        titular=brand.titular,
        estado=brand.estado,
        created_at=brand.created_at,
        updated_at=brand.updated_at,
    )


@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_brand(brand_id: int, brand_repo=Depends(get_brand_repository)):
    use_case = DeleteBrandUseCase(brand_repo)
    await use_case.execute(brand_id)
    return  # No content for 204
