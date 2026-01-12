"""
Authentication utilities using JWT and password hashing
"""

from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

# =========================
# CONFIGURATION
# =========================

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# =========================
# PASSWORD HASHING (ARGON2)
# =========================
# bcrypt REMOVED completely (Windows-safe, no 72-byte limit)

pwd_context = CryptContext(
    schemes=["argon2"],   #doesnot contain password length
    deprecated="auto",
)

def get_password_hash(password: str) -> str:
    """
    Hash a password using Argon2
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password using Argon2
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


# =========================
# JWT UTILITIES
# =========================

def create_access_token( #creates a signal for jwt token
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(#provides the token
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """
    Verify and decode a JWT token
    """
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload
    except JWTError:
        return None
