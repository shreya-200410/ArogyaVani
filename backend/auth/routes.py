from fastapi import (
    APIRouter,
    HTTPException
)

from pydantic import BaseModel

from auth.database import (
    create_user,
    get_user_by_email
)

from auth.security import (
    hash_password,
    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class RegisterRequest(BaseModel):

    name: str
    email: str
    password: str


class LoginRequest(BaseModel):

    email: str
    password: str


@router.post("/register")
def register(
    request: RegisterRequest
):

    name = request.name.strip()

    email = (
        request.email
        .strip()
        .lower()
    )

    password = request.password


    if not name:

        raise HTTPException(
            status_code=400,
            detail="Name is required."
        )


    if not email:

        raise HTTPException(
            status_code=400,
            detail="Email is required."
        )


    if len(password) < 6:

        raise HTTPException(
            status_code=400,
            detail=(
                "Password must contain "
                "at least 6 characters."
            )
        )


    existing_user = (
        get_user_by_email(email)
    )


    if existing_user:

        raise HTTPException(
            status_code=409,
            detail=(
                "An account with this "
                "email already exists."
            )
        )


    password_hash = hash_password(
        password
    )


    user_id = create_user(
        name,
        email,
        password_hash
    )


    token = create_access_token(
        user_id,
        email
    )


    return {
        "message": "Account created successfully.",
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "email": email
        }
    }


@router.post("/login")
def login(
    request: LoginRequest
):

    email = (
        request.email
        .strip()
        .lower()
    )

    password = request.password


    user = get_user_by_email(
        email
    )


    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )


    password_valid = verify_password(
        password,
        user["password_hash"]
    )


    if not password_valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )


    token = create_access_token(
        user["id"],
        user["email"]
    )


    return {
        "message": "Login successful.",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }