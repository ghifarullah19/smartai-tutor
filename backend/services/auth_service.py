from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.user_model import User
from schemas.user_schema import UserCreate, UserResponse
from schemas.token_schema import LoginResponse
from core.security import verify_password, get_password_hash, create_access_token
from core.config import settings
from datetime import timedelta

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, user: UserCreate):
        db_user = self.db.query(User).filter(User.email == user.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email sudah terdaftar"
            )
        
        hashed_password = get_password_hash(user.password)
        new_user = User(
            email=user.email,
            name=user.name,
            password_hash=hashed_password
        )
        self.db.add(new_user)
        self.db.commit()
        return {"message": "Pendaftaran berhasil, silakan login"}

    def login(self, email: str, password: str) -> LoginResponse:
        user = self.db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email atau kata sandi salah",
            )
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id)}, expires_delta=access_token_expires
        )
        
        return LoginResponse(
            message="Login berhasil",
            token=access_token,
            user=UserResponse(
                id=user.id,
                email=user.email,
                name=user.name
            )
        )
