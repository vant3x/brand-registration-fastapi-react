from fastapi import APIRouter, Depends

from app.application.dto.user_dto import LoginDTO
from app.application.use_cases.auth.login_user import LoginUseCase
from app.application.use_cases.auth.refresh_token import RefreshTokenUseCase
from app.presentation.api.dependencies.database import get_user_repository
from app.presentation.schemas.user import (
    RefreshTokenRequest,
    Token,
    TokenRefreshResponse,
    UserLogin,
)

router = APIRouter(tags=["auth"])


@router.post("/token", response_model=Token)
async def login_for_access_token(
    login_data: UserLogin,
    user_repo=Depends(get_user_repository),
):
    use_case = LoginUseCase(user_repo)
    login_dto = LoginDTO(email=login_data.email, password=login_data.password)
    token_data = await use_case.execute(login_dto)
    return {
        "access_token": token_data["access_token"],
        "refresh_token": token_data["refresh_token"],
        "token_type": "bearer",
    }


@router.post("/refresh", response_model=TokenRefreshResponse)
async def refresh_access_token(
    request: RefreshTokenRequest, user_repo=Depends(get_user_repository)
):
    use_case = RefreshTokenUseCase(user_repo)
    new_access_token = await use_case.execute(request.refresh_token)
    return {"access_token": new_access_token}
