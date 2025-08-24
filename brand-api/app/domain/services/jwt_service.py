from datetime import datetime, timedelta
from typing import Any, Dict, Optional

import jwt
from app.core.config import get_settings
from app.core.exceptions import InvalidCredentialsException

settings = get_settings()


def create_access_token(subject: str, extra_data: Optional[Dict[str, Any]] = None) -> str:
    """Creates a new access token."""
    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    to_encode = {
        "exp": datetime.utcnow() + expires_delta,
        "sub": str(subject),
        "token_type": "access",
    }
    if extra_data:
        to_encode.update(extra_data)
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def create_refresh_token(subject: str) -> str:
    """Creates a new refresh token."""
    expires_delta = timedelta(days=settings.refresh_token_expire_days)
    to_encode = {
        "exp": datetime.utcnow() + expires_delta,
        "sub": str(subject),
        "token_type": "refresh",
    }
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> Dict[str, Any]:
    """Decodes a token and returns its payload. Handles exceptions."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except jwt.ExpiredSignatureError:
        raise InvalidCredentialsException(detail="Token has expired")
    except jwt.PyJWTError:
        raise InvalidCredentialsException(detail="Could not validate token")
