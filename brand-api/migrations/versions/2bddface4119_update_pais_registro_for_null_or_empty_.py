"""Update pais_registro for NULL or empty strings

Revision ID: 2bddface4119
Revises: f2d5d1a893da
Create Date: 2025-08-21 18:10:22.238768

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2bddface4119'
down_revision: Union[str, Sequence[str], None] = 'f2d5d1a893da'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("UPDATE brands SET pais_registro = 'Colombia' WHERE pais_registro IS NULL OR pais_registro = ''")


def downgrade() -> None:
    """Downgrade schema."""
    pass
