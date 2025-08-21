from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func
import sqlalchemy as sa

from app.infrastructure.database.models.base import Base
from app.shared.enums.brand_status import BrandStatus


class BrandModel(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String, unique=True, index=True, nullable=False)
    titular = Column(String, index=True, nullable=False)
    status = sa.Column(sa.Enum(BrandStatus, name="brand_status_enum", values_callable=lambda x: [e.value for e in x]), index=True, nullable=False)
    pais_registro = Column(String, nullable=True)
    imagen_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
