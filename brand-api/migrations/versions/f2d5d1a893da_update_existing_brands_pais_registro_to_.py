"""Update existing brands pais_registro to Colombia

Revision ID: f2d5d1a893da
Revises: 685ce2126ea3
Create Date: 2025-08-21 17:58:25.047331

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f2d5d1a893da'
down_revision: Union[str, Sequence[str], None] = '685ce2126ea3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("UPDATE brands SET pais_registro = 'Colombia' WHERE pais_registro IS NULL")


def downgrade() -> None:
    """Downgrade schema."""
    pass
