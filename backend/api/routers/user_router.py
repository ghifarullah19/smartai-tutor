from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from models.user_model import User
from schemas.user_schema import UserUpdate
from services.user_service import UserService, get_current_user

router = APIRouter()

@router.delete("/account")
def delete_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_service = UserService(db)
    user_service.delete_account(current_user.id)
    return {"message": "Akun berhasil dihapus"}

@router.put("/account")
def update_account(update_data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_service = UserService(db)
    updated_user = user_service.update_profile(current_user.id, update_data)
    return {
        "message": "Profil berhasil diperbarui",
        "user": {
            "id": updated_user.id,
            "email": updated_user.email,
            "name": updated_user.name
        }
    }
