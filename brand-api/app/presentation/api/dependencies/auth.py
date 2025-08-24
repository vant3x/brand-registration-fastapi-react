
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.exceptions import InvalidCredentialsException
from app.domain.entities.user import User
from app.domain.repositories.user_repository import UserRepository
from app.domain.services import jwt_service
from app.presentation.api.dependencies.database import get_user_repository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_repo: UserRepository = Depends(get_user_repository),
) -> User:
    try:
        payload = jwt_service.decode_token(token)
        user_id = payload.get("sub")
        if user_id is None:
            raise InvalidCredentialsException(detail="Could not validate credentials")
    except InvalidCredentialsException as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await user_repo.get_by_id(UUID(user_id))
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
