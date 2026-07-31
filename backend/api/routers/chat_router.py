from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from models.user_model import User
from services.user_service import get_current_user
from services.chat_service import ChatService
from schemas.chat_schema import ChatCreate, ChatUpdate, ChatSessionResponse, MessageCreate, AskResponse

router = APIRouter(prefix="/api/chats")

@router.get("/", response_model=List[ChatSessionResponse])
def get_chats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    chat_service = ChatService(db)
    return chat_service.get_user_chats(current_user.id)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ChatSessionResponse)
def create_chat(chat_in: ChatCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    chat_service = ChatService(db)
    return chat_service.create_chat_session(current_user.id, chat_in)

@router.delete("/{chat_id}")
def delete_chat(chat_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    chat_service = ChatService(db)
    chat_service.delete_chat_session(chat_id, current_user.id)
    return {"message": "Chat berhasil dihapus"}

@router.put("/{chat_id}")
def update_chat(chat_id: str, chat_in: ChatUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    chat_service = ChatService(db)
    chat_service.update_chat_session(chat_id, current_user.id, chat_in)
    return {"message": "Chat berhasil diperbarui"}

@router.get("/{chat_id}/messages")
def get_messages(chat_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    chat_service = ChatService(db)
    messages = chat_service.get_messages(chat_id, current_user.id)
    result = []
    for msg in messages:
        result.append({
            "id": msg.id,
            "sender": msg.sender,
            "text": msg.text,
            "timestamp": msg.timestamp.isoformat()
        })
    return result

@router.post("/{chat_id}/ask", response_model=AskResponse)
def ask_ai(chat_id: str, msg_in: MessageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    chat_service = ChatService(db)
    return chat_service.send_message(chat_id, current_user.id, msg_in)
