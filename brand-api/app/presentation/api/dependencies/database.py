from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.brand_repository import BrandRepository
from app.domain.repositories.user_repository import UserRepository
from app.infrastructure.database.repositories.brand_repository import (
    BrandRepositoryImpl,
)
from app.infrastructure.database.repositories.user_repository import UserRepositoryImpl
from app.infrastructure.database.session import get_db_session


def get_user_repository(
    db_session: AsyncSession = Depends(get_db_session),
) -> UserRepository:
    return UserRepositoryImpl(db_session)


def get_brand_repository(
    db_session: AsyncSession = Depends(get_db_session),
) -> BrandRepository:
    return BrandRepositoryImpl(db_session)
