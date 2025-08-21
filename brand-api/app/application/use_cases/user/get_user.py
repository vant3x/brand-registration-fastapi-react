from typing import Optional
from app.domain.entities.user import User
from app.domain.repositories.user_repository import UserRepository
from app.core.exceptions import UserNotFoundError


class GetUserUseCase:
    
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
        
    async def execute(self, user_id: int) -> User:
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise UserNotFoundError()
        return user
