from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.presentation.schemas.user import Token
from app.presentation.api.dependencies.database import get_user_repository
from app.application.use_cases.auth.login_user import LoginUseCase
from app.application.dto.user_dto import LoginDTO

router = APIRouter(tags=["auth"])


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    user_repo = Depends(get_user_repository)
):
    use_case = LoginUseCase(user_repo)
    login_dto = LoginDTO(email=form_data.username, password=form_data.password)
    access_token = await use_case.execute(login_dto)
    return {"access_token": access_token, "token_type": "bearer"}
