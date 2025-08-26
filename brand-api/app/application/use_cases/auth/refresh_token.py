from uuid import UUID

from app.core.exceptions import InvalidCredentialsException, UserNotFoundError
from app.domain.repositories.user_repository import UserRepository
from app.domain.services import jwt_service


class RefreshTokenUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def execute(self, refresh_token: str) -> str:
        payload = jwt_service.decode_token(refresh_token)

        if payload.get("token_type") != "refresh":
            raise InvalidCredentialsException(
                detail="Invalid token type for refreshing"
            )

        user_id_str = payload.get("sub")
        if not user_id_str:
            raise InvalidCredentialsException(detail="Invalid token payload")

        user = await self.user_repository.get_by_id(UUID(user_id_str))
        if not user or not user.is_active:
            raise UserNotFoundError(detail="User not found or inactive")

        token_subject = str(user.id)
        extra_claims = {"email": user.email.value}
        return jwt_service.create_access_token(
            subject=token_subject, extra_data=extra_claims
        )
