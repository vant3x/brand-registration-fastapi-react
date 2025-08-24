from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.application.dto.user_dto import CreateUserDTO, UpdateUserDTO
from app.application.use_cases.user.create_user import CreateUserUseCase
from app.application.use_cases.user.get_user import GetUserUseCase
from app.presentation.api.dependencies.database import get_user_repository
from app.presentation.api.dependencies.security import get_current_active_user
from app.presentation.schemas.user import UserCreate, UserResponse, UserUpdate
from app.domain.entities.user import User

router = APIRouter(tags=["users"])


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserCreate, user_repo=Depends(get_user_repository)):
    use_case = CreateUserUseCase(user_repo)
    dto = CreateUserDTO(
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name,
    )
    user = await use_case.execute(dto)

    return UserResponse(
        id=user.id,
        email=str(user.email),
        full_name=user.full_name,
        is_active=user.is_active,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """
    Get current user.
    """
    return UserResponse(
        id=current_user.id,
        email=str(current_user.email), # Convertimos explícitamente a string
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
    )


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: UUID, user_repo=Depends(get_user_repository)):
    use_case = GetUserUseCase(user_repo)
    user = await use_case.execute(user_id)

    return UserResponse(
        id=user.id,
        email=str(user.email),
        full_name=user.full_name,
        is_active=user.is_active,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )
