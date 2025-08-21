from app.application.dto.user_dto import CreateUserDTO
from app.core.exceptions import EmailAlreadyExistsError
from app.domain.entities.user import User
from app.domain.repositories.user_repository import UserRepository
from app.domain.services.user_service import UserService
from app.domain.value_objects.email import Email


class CreateUserUseCase:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
        self.user_service = UserService()

    async def execute(self, user_dto: CreateUserDTO) -> User:
        # Check if email already exists
        existing_user = await self.user_repository.get_by_email(user_dto.email)
        if existing_user:
            raise EmailAlreadyExistsError(email=user_dto.email)

        # Hash the password
        hashed_password = self.user_service.hash_password(user_dto.password)

        # Create a new user entity
        user = User(
            id=None,
            email=Email(user_dto.email),
            full_name=user_dto.full_name,
            hashed_password=hashed_password,
            is_active=True,  # Default to active
            created_at=None,
            updated_at=None,
        )

        # Persist the new user
        created_user = await self.user_repository.create(user)
        return created_user
