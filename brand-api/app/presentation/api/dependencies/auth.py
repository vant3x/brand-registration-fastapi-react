from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.exceptions import InvalidCredentialsException
from app.domain.entities.user import User
from app.domain.repositories.user_repository import UserRepository
from app.domain.services import jwt_service
from app.presentation.api.dependencies.database import get_user_repository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")
