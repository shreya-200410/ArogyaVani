import os

import bcrypt
import jwt

from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv


load_dotenv(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        ".env"
    )
)


JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY"
)

if not JWT_SECRET_KEY:

    raise ValueError(
        "JWT_SECRET_KEY is missing from backend/.env"
    )


JWT_ALGORITHM = "HS256"

TOKEN_EXPIRE_MINUTES = 60 * 24


def hash_password(password):

    password_bytes = password.encode(
        "utf-8"
    )

    salt = bcrypt.gensalt()

    hashed = bcrypt.hashpw(
        password_bytes,
        salt
    )

    return hashed.decode(
        "utf-8"
    )


def verify_password(
    password,
    password_hash
):

    return bcrypt.checkpw(
        password.encode("utf-8"),
        password_hash.encode("utf-8")
    )


def create_access_token(
    user_id,
    email
):

    expiration = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": expiration
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )

    return token


def decode_access_token(token):

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[
                JWT_ALGORITHM
            ]
        )

        return payload

    except jwt.InvalidTokenError:

        return None