import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from core.database import Base

class ChatSession(Base):
    __tablename__ = "chat_session"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    title = Column(String(200), default="Obrolan Baru")
    subject = Column(String(100), nullable=True)
    grade = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="chats")
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan", order_by="Message.timestamp")

class Message(Base):
    __tablename__ = "message"
    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(String(36), ForeignKey('chat_session.id'), nullable=False)
    sender = Column(String(10), nullable=False) # 'user' or 'ai'
    text = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    chat = relationship("ChatSession", back_populates="messages")
