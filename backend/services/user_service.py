from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from core.database import get_db
from core.config import settings
from core.security import get_password_hash
from models.user_model import User
from schemas.user_schema import UserUpdate

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        user_id = int(user_id_str)
    except (JWTError, ValueError):
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

class UserService:
    def __init__(self, db: Session):
        self.db = db
        
    def update_profile(self, user_id: int, update_data: UserUpdate) -> User:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        if update_data.name is not None and update_data.name.strip():
            user.name = update_data.name.strip()
            
        if update_data.email is not None and update_data.email.strip():
            existing_user = self.db.query(User).filter(User.email == update_data.email.strip()).first()
            if existing_user and existing_user.id != user_id:
                raise HTTPException(status_code=400, detail="Email sudah digunakan oleh akun lain")
            user.email = update_data.email.strip()
            
        if update_data.password is not None and update_data.password.strip():
            user.password_hash = get_password_hash(update_data.password.strip())
            
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete_account(self, user_id: int):
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            self.db.delete(user)
            self.db.commit()
