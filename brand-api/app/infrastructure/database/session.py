from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import get_settings

settings = get_settings()

async_engine = create_async_engine(
    settings.database_url,
    pool_pre_ping=True,
    echo=False,
)

AsyncSessionFactory = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db_session() -> AsyncSession:
    async with AsyncSessionFactory() as session:
        try:
            yield session
        finally:
            await session.close()
