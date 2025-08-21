# Base de Excepciones
class CoreException(Exception):
    """Base exception for the application's core layer."""

    pass


# Excepciones Específicas
class EmailAlreadyExistsError(CoreException):
    """Raised when an email already exists in the database."""

    def __init__(self, email: str):
        self.email = email
        super().__init__(f"El email '{email}' ya está registrado.")


class UserNotFoundError(CoreException):
    """Raised when a user is not found in the database."""

    pass


class InvalidCredentialsException(CoreException):
    """Raised when authentication fails due to invalid credentials."""

    pass


class BrandNotFoundError(CoreException):
    """Raised when a brand is not found in the database."""

    pass


# Manejo centralizado de excepciones
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.status import (
    HTTP_401_UNAUTHORIZED,
    HTTP_404_NOT_FOUND,
    HTTP_409_CONFLICT,
)


def setup_exception_handlers(app: FastAPI):
    @app.exception_handler(EmailAlreadyExistsError)
    async def email_already_exists_exception_handler(
        request: Request, exc: EmailAlreadyExistsError
    ):
        return JSONResponse(
            status_code=HTTP_409_CONFLICT,
            content={"detail": str(exc)},
        )

    @app.exception_handler(UserNotFoundError)
    async def user_not_found_exception_handler(
        request: Request, exc: UserNotFoundError
    ):
        return JSONResponse(
            status_code=HTTP_404_NOT_FOUND,
            content={"detail": "Usuario no encontrado."},
        )

    @app.exception_handler(InvalidCredentialsException)
    async def invalid_credentials_exception_handler(
        request: Request, exc: InvalidCredentialsException
    ):
        return JSONResponse(
            status_code=HTTP_401_UNAUTHORIZED,
            content={"detail": "Email o contraseña incorrectos."},
            headers={"WWW-Authenticate": "Bearer"},
        )

    @app.exception_handler(BrandNotFoundError)
    async def brand_not_found_exception_handler(
        request: Request, exc: BrandNotFoundError
    ):
        return JSONResponse(
            status_code=HTTP_404_NOT_FOUND,
            content={"detail": "Marca no encontrada."},
        )
