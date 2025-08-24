from app.core.exceptions import InvalidCredentialsException, UserNotFoundError
from app.domain.repositories.user_repository import UserRepository
from app.domain.services import jwt_service


class RefreshTokenUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def execute(self, refresh_token: str) -> str:
        payload = jwt_service.decode_token(refresh_token)

        if payload.get("token_type") != "refresh":
            raise InvalidCredentialsException(detail="Invalid token type for refreshing")

        email = payload.get("sub")
        if not email:
            raise InvalidCredentialsException(detail="Invalid token payload")

        user = await self.user_repository.get_by_email(email)
        if not user or not user.is_active:
            raise UserNotFoundError(detail="User not found or inactive")

        return jwt_service.create_access_token(subject=user.email.value)
