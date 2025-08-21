from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.brand import Brand
from app.domain.repositories.brand_repository import BrandRepository
from app.infrastructure.database.models.brand import BrandModel
from app.shared.enums.brand_status import BrandStatus


class BrandRepositoryImpl(BrandRepository):
    def __init__(self, db_session: AsyncSession):
        self._db_session = db_session

    async def create(self, brand: Brand) -> Brand:
        db_brand = BrandModel(
            marca=brand.marca, titular=brand.titular, status=brand.status.value
        )
        self._db_session.add(db_brand)
        await self._db_session.commit()
        await self._db_session.refresh(db_brand)
        return self._to_entity(db_brand)

    async def get_by_id(self, brand_id: int) -> Optional[Brand]:
        result = await self._db_session.execute(
            select(BrandModel).where(BrandModel.id == brand_id)
        )
        db_brand = result.scalar_one_or_none()
        return self._to_entity(db_brand) if db_brand else None

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Brand]:
        result = await self._db_session.execute(
            select(BrandModel).offset(skip).limit(limit)
        )
        db_brands = result.scalars().all()
        return [self._to_entity(db_brand) for db_brand in db_brands]

    async def update(self, brand: Brand) -> Brand:
        result = await self._db_session.execute(
            select(BrandModel).where(BrandModel.id == brand.id)
        )
        db_brand = result.scalar_one()

        db_brand.marca = brand.marca
        db_brand.titular = brand.titular
        db_brand.status = brand.status.value

        await self._db_session.commit()
        await self._db_session.refresh(db_brand)
        return self._to_entity(db_brand)

    async def delete(self, brand_id: int) -> bool:
        result = await self._db_session.execute(
            select(BrandModel).where(BrandModel.id == brand_id)
        )
        db_brand = result.scalar_one_or_none()

        if db_brand:
            await self._db_session.delete(db_brand)
            await self._db_session.commit()
            return True
        return False

    def _to_entity(self, db_brand: BrandModel) -> Brand:
        return Brand(
            id=db_brand.id,
            marca=db_brand.marca,
            titular=db_brand.titular,
            status=BrandStatus(db_brand.status),
            created_at=db_brand.created_at,
            updated_at=db_brand.updated_at,
        )
