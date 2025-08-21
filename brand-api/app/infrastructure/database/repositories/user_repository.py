from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.user import User
from app.domain.repositories.user_repository import UserRepository
from app.domain.value_objects.email import Email
from app.infrastructure.database.models.user import UserModel


class UserRepositoryImpl(UserRepository):
    def __init__(self, db_session: AsyncSession):
        self._db_session = db_session

    async def create(self, user: User) -> User:
        db_user = UserModel(
            email=str(user.email),
            full_name=user.full_name,
            hashed_password=user.hashed_password,
            is_active=user.is_active,
        )
        self._db_session.add(db_user)
        await self._db_session.commit()
        await self._db_session.refresh(db_user)
        return self._to_entity(db_user)

    async def get_by_id(self, user_id: int) -> Optional[User]:
        result = await self._db_session.execute(
            select(UserModel).where(UserModel.id == user_id)
        )
        db_user = result.scalar_one_or_none()
        return self._to_entity(db_user) if db_user else None

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self._db_session.execute(
            select(UserModel).where(UserModel.email == email)
        )
        db_user = result.scalar_one_or_none()
        return self._to_entity(db_user) if db_user else None

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        result = await self._db_session.execute(
            select(UserModel).offset(skip).limit(limit)
        )
        db_users = result.scalars().all()
        return [self._to_entity(db_user) for db_user in db_users]

    async def update(self, user: User) -> User:
        result = await self._db_session.execute(
            select(UserModel).where(UserModel.id == user.id)
        )
        db_user = result.scalar_one()

        db_user.email = str(user.email)
        db_user.full_name = user.full_name
        db_user.is_active = user.is_active

        await self._db_session.commit()
        await self._db_session.refresh(db_user)
        return self._to_entity(db_user)

    async def delete(self, user_id: int) -> bool:
        result = await self._db_session.execute(
            select(UserModel).where(UserModel.id == user_id)
        )
        db_user = result.scalar_one_or_none()

        if db_user:
            await self._db_session.delete(db_user)
            await self._db_session.commit()
            return True
        return False

    def _to_entity(self, db_user: UserModel) -> User:
        return User(
            id=db_user.id,
            email=Email(db_user.email),
            full_name=db_user.full_name,
            hashed_password=db_user.hashed_password,
            is_active=db_user.is_active,
            created_at=db_user.created_at,
            updated_at=db_user.updated_at,
        )
