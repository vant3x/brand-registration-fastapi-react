from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.repositories.user_repository import UserRepository
from app.infrastructure.database.repositories.user_repository import UserRepositoryImpl
from app.infrastructure.database.session import get_db_session

def get_user_repository(
    db_session: AsyncSession = Depends(get_db_session)
) -> UserRepository:
    return UserRepositoryImpl(db_session)
