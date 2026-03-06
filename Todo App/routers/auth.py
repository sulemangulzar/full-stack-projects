from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from models import Users
from passlib.context import CryptContext
from database import SessionLocal
from sqlalchemy.orm import Session
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def authenticate_user(username : str, password : str , db):
    user = db.query(Users).filter(Users.username == username).first()
    if not user: 
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return True


# -----------------------------
# Pydantic Request Schema
# -----------------------------
class CreateUser(BaseModel):
    username: str = Field(min_length=1)
    email: str
    first_name: str
    last_name: str
    password: str
    role: str

# -----------------------------
# Create User Endpoint
# -----------------------------
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(
    create_user_request: CreateUser,
    db: db_dependency
):
    existing_user = db.query(Users).filter(
        Users.username == create_user_request.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    create_user_model = Users(
        username=create_user_request.username,
        email=create_user_request.email,
        first_name=create_user_request.first_name,
        last_name=create_user_request.last_name,
        role=create_user_request.role,
        hashed_password=bcrypt_context.hash(create_user_request.password),
        is_active=True
    )

    db.add(create_user_model)
    db.commit()
    db.refresh(create_user_model)

    return {
        "message": "User created successfully",
        "username": create_user_model.username,
        "email": create_user_model.email
    }


@router.post('/token')
async def login_for_access_token(form_data : Annotated[OAuth2PasswordRequestForm, Depends()],
                                 db : db_dependency
                                 ):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        return "Failed"
    return "success"