from typing import Dict

from app.application.dto.user_dto import LoginDTO
from app.core.exceptions import InvalidCredentialsException, UserNotFoundError
from app.domain.repositories.user_repository import UserRepository
from app.domain.services import jwt_service
from app.domain.services.user_service import UserService


class LoginUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
        self.user_service = UserService()

    async def execute(self, login_dto: LoginDTO) -> Dict[str, str]:
        user = await self.user_repository.get_by_email(login_dto.email)
        if not user:
            raise UserNotFoundError()

        if not self.user_service.verify_password(
            login_dto.password, user.hashed_password
        ):
            raise InvalidCredentialsException()

        token_subject = str(user.id)
        extra_claims = {"email": user.email.value}

        access_token = jwt_service.create_access_token(
            subject=token_subject, extra_data=extra_claims
        )
        refresh_token = jwt_service.create_refresh_token(subject=token_subject)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
