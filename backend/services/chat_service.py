from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.chat_model import ChatSession, Message
from schemas.chat_schema import ChatCreate, ChatUpdate, MessageCreate

class ChatService:
    def __init__(self, db: Session):
        self.db = db

    def create_chat_session(self, user_id: int, chat_in: ChatCreate) -> ChatSession:
        new_chat = ChatSession(
            user_id=user_id,
            title=chat_in.title if chat_in.title else "Obrolan Baru",
            subject=chat_in.subject,
            grade=chat_in.grade
        )
        self.db.add(new_chat)
        self.db.commit()
        self.db.refresh(new_chat)
        return new_chat

    def get_user_chats(self, user_id: int):
        return self.db.query(ChatSession).filter(ChatSession.user_id == user_id).order_by(ChatSession.updated_at.desc()).all()

    def get_chat_session(self, chat_id: str, user_id: int) -> ChatSession:
        chat = self.db.query(ChatSession).filter(ChatSession.id == chat_id, ChatSession.user_id == user_id).first()
        if not chat:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat tidak ditemukan")
        return chat

    def update_chat_session(self, chat_id: str, user_id: int, chat_in: ChatUpdate) -> ChatSession:
        chat = self.get_chat_session(chat_id, user_id)
        if chat_in.title is not None:
            chat.title = chat_in.title
        if chat_in.subject is not None:
            chat.subject = chat_in.subject
        if chat_in.grade is not None:
            chat.grade = chat_in.grade
        self.db.commit()
        self.db.refresh(chat)
        return chat

    def delete_chat_session(self, chat_id: str, user_id: int):
        chat = self.get_chat_session(chat_id, user_id)
        self.db.delete(chat)
        self.db.commit()

    def get_messages(self, chat_id: str, user_id: int):
        chat = self.get_chat_session(chat_id, user_id)
        return self.db.query(Message).filter(Message.chat_id == chat.id).order_by(Message.timestamp.asc()).all()

    def send_message(self, chat_id: str, user_id: int, msg_in: MessageCreate) -> dict:
        chat = self.get_chat_session(chat_id, user_id)
        
        # Override grade/subject from request if present, else fallback to chat defaults
        grade = msg_in.grade or chat.grade
        subject = msg_in.subject or chat.subject
        user_question = msg_in.question

        print(f"Menerima pertanyaan di chat {chat_id}: {user_question}")

        # Simpan pesan user
        user_msg = Message(chat_id=chat.id, sender="user", text=user_question)
        self.db.add(user_msg)
        
        # Update updated_at di chat session
        from datetime import datetime
        chat.updated_at = datetime.utcnow()
        self.db.commit()
        
        return self.generate_ai_reply(chat, user_msg, grade, subject)

    def generate_ai_reply(self, chat: ChatSession, user_msg: Message, grade: str, subject: str) -> dict:
        # Ambil maksimal 10 pesan terakhir untuk konteks
        past_messages = self.db.query(Message).filter(Message.chat_id == chat.id).order_by(Message.timestamp.desc()).limit(10).all()
        past_messages.reverse()
        
        history_str = ""
        for msg in past_messages:
            if msg.id == user_msg.id:
                continue
            role = "Siswa" if msg.sender == 'user' else "Tutor AI"
            history_str += f"{role}: {msg.text}\n"

        if grade and subject:
            system_instruction = (
                f"Anda adalah PintarAI, tutor virtual AI yang ramah, interaktif, dan mendidik. "
                f"Anda sedang membimbing seorang siswa SMA tingkat {grade} untuk mata pelajaran {subject}. "
                f"Berikan penjelasan yang jelas, ringkas, terstruktur, serta mudah dipahami untuk tingkat kelas tersebut. "
                f"Gunakan contoh-contoh konkret yang relevan dengan kehidupan sehari-hari di wilayah ASEAN. "
                f"Gunakan format Markdown untuk struktur teks dan LaTeX untuk rumus matematika "
                f"(gunakan $...$ untuk rumus sebaris/inline, dan $$...$$ untuk rumus blok terpisah)."
            )
        else:
            system_instruction = (
                "Anda adalah PintarAI, tutor virtual AI yang ramah, interaktif, dan mendidik untuk siswa SMA. "
                "Berikan penjelasan akademis yang jelas, ringkas, mudah dipahami, dan relevan dengan kehidupan di ASEAN. "
                "Gunakan format Markdown untuk struktur teks dan LaTeX untuk rumus matematika "
                "(gunakan $...$ untuk rumus sebaris/inline, dan $$...$$ untuk rumus blok terpisah)."
            )

        try:
            from rag import generate_answer
            ai_response = generate_answer(user_msg.text, system_instruction, history_str)
        except Exception as e:
            error_msg = str(e)
            print(f"Error saat memproses pertanyaan: {e}")
            status_code = status.HTTP_429_TOO_MANY_REQUESTS if "rate_limit_exceeded" in error_msg.lower() or "429" in error_msg else status.HTTP_500_INTERNAL_SERVER_ERROR
            raise HTTPException(
                status_code=status_code, 
                detail="Batas penggunaan API terlampaui. Harap tunggu beberapa saat sebelum mencoba lagi." if status_code == 429 else "Terjadi kesalahan saat memproses pertanyaan Anda."
            )

        ai_msg = Message(chat_id=chat.id, sender="ai", text=ai_response)
        self.db.add(ai_msg)
        self.db.commit()
        self.db.refresh(ai_msg)

        print(f"Jawaban AI sukses diproses dan disimpan.")
        
        return {
            "answer": ai_response,
            "user_message_id": user_msg.id,
            "ai_message_id": ai_msg.id
        }
