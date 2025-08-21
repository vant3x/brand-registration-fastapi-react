from datetime import datetime, timedelta
from typing import Optional
import jwt
from app.core.config import get_settings
from app.domain.repositories.user_repository import UserRepository
from app.domain.services.user_service import UserService
from app.application.dto.user_dto import LoginDTO
from app.core.exceptions import UserNotFoundError, InvalidCredentialsException

settings = get_settings()

class LoginUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
        self.user_service = UserService()

    async def execute(self, login_dto: LoginDTO) -> str:
        user = await self.user_repository.get_by_email(login_dto.email)
        if not user:
            raise UserNotFoundError()

        if not self.user_service.verify_password(login_dto.password, user.hashed_password):
            raise InvalidCredentialsException()

        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        return self._create_access_token(
            data={"sub": user.email},
            expires_delta=access_token_expires
        )

    def _create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
        return encoded_jwt
