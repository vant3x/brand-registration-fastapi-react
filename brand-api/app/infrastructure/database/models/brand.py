from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.infrastructure.database.models.base import Base


class BrandModel(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String, unique=True, index=True, nullable=False)
    titular = Column(String, index=True, nullable=False)
    estado = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
