import os
from dotenv import load_dotenv
# Muat variabel lingkungan dari .env sedini mungkin
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS # Ini penting untuk komunikasi frontend-backend
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from rag import process_document, generate_answer
from models import db, User, ChatSession, Message
from auth_middleware import token_required

# Inisialisasi Flask App
app = Flask(__name__)
# Aktifkan CORS untuk mengizinkan permintaan dari frontend
CORS(app) 

# Konfigurasi Database & JWT
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pintarai.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'super-rahasia-pintarai-jwt-key')
db.init_app(app)

# Inisialisasi Database & Seeder
with app.app_context():
    db.create_all()
    if not User.query.filter_by(email='siswa@pintarai.com').first():
        dummy_user = User(
            email='siswa@pintarai.com',
            name='Siswa Dummy',
            password_hash=generate_password_hash('password123')
        )
        db.session.add(dummy_user)
        db.session.commit()
        print("Seeder: Dummy user 'siswa@pintarai.com' berhasil dibuat.")

# Konfigurasi Upload
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



# Konfigurasi Groq API
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY tidak ditemukan di variabel lingkungan. Pastikan sudah diatur di file .env")

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email dan password wajib diisi"}), 400
    
    user = User.query.filter_by(email=data.get('email')).first()
    if user and check_password_hash(user.password_hash, data.get('password')):
        token = jwt.encode({
            'user_id': user.id,
            'email': user.email,
            'name': user.name,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            "message": "Login berhasil",
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name
            }
        })
    else:
        return jsonify({"error": "Email atau kata sandi salah"}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email dan kata sandi wajib diisi"}), 400
        
    existing_user = User.query.filter_by(email=data.get('email')).first()
    if existing_user:
        return jsonify({"error": "Email sudah terdaftar"}), 400
        
    new_user = User(
        email=data.get('email'),
        name=data.get('name', ''),
        password_hash=generate_password_hash(data.get('password'))
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "Pendaftaran berhasil, silakan login"}), 201

@app.route('/account', methods=['PUT', 'DELETE'])
@token_required
def manage_account(current_user):
    if request.method == 'DELETE':
        try:
            db.session.delete(current_user)
            db.session.commit()
            return jsonify({"message": "Akun berhasil dihapus"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Gagal menghapus akun: {str(e)}"}), 500
            
    if request.method == 'PUT':
        data = request.get_json()
        
        # Update Name
        if 'name' in data and data['name'].strip():
            current_user.name = data['name'].strip()
            
        # Update Email
        if 'email' in data and data['email'].strip():
            # Check if email is already taken by someone else
            existing_user = User.query.filter_by(email=data['email'].strip()).first()
            if existing_user and existing_user.id != current_user.id:
                return jsonify({"error": "Email sudah digunakan oleh akun lain"}), 400
            current_user.email = data['email'].strip()
            
        # Update Password
        if 'password' in data and data['password'].strip():
            current_user.password_hash = generate_password_hash(data['password'])
            
        try:
            db.session.commit()
            return jsonify({
                "message": "Profil berhasil diperbarui",
                "user": {
                    "id": current_user.id,
                    "email": current_user.email,
                    "name": current_user.name
                }
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Gagal memperbarui profil: {str(e)}"}), 500

# --- Chat Endpoints ---

@app.route('/api/chats', methods=['GET'])
@token_required
def get_chats(current_user):
    chats = ChatSession.query.filter_by(user_id=current_user.id).order_by(ChatSession.updated_at.desc()).all()
    result = []
    for chat in chats:
        result.append({
            "id": chat.id,
            "title": chat.title,
            "subject": chat.subject,
            "grade": chat.grade,
            "created_at": chat.created_at.isoformat(),
            "updated_at": chat.updated_at.isoformat()
        })
    return jsonify(result), 200

@app.route('/api/chats', methods=['POST'])
@token_required
def create_chat(current_user):
    data = request.get_json() or {}
    new_chat = ChatSession(
        user_id=current_user.id,
        title=data.get('title', 'Obrolan Baru'),
        subject=data.get('subject'),
        grade=data.get('grade')
    )
    db.session.add(new_chat)
    db.session.commit()
    return jsonify({
        "id": new_chat.id,
        "title": new_chat.title,
        "subject": new_chat.subject,
        "grade": new_chat.grade,
        "created_at": new_chat.created_at.isoformat(),
        "updated_at": new_chat.updated_at.isoformat()
    }), 201

@app.route('/api/chats/<chat_id>', methods=['DELETE', 'PUT'])
@token_required
def modify_chat(current_user, chat_id):
    chat = ChatSession.query.filter_by(id=chat_id, user_id=current_user.id).first()
    if not chat:
        return jsonify({"error": "Chat tidak ditemukan"}), 404
        
    if request.method == 'DELETE':
        db.session.delete(chat)
        db.session.commit()
        return jsonify({"message": "Chat berhasil dihapus"}), 200
        
    if request.method == 'PUT':
        data = request.get_json() or {}
        if 'title' in data:
            chat.title = data['title']
        if 'subject' in data:
            chat.subject = data['subject']
        if 'grade' in data:
            chat.grade = data['grade']
        db.session.commit()
        return jsonify({"message": "Chat berhasil diperbarui"}), 200

@app.route('/api/chats/<chat_id>/messages', methods=['GET'])
@token_required
def get_messages(current_user, chat_id):
    chat = ChatSession.query.filter_by(id=chat_id, user_id=current_user.id).first()
    if not chat:
        return jsonify({"error": "Chat tidak ditemukan"}), 404
        
    messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.timestamp.asc()).all()
    result = []
    for msg in messages:
        result.append({
            "id": msg.id,
            "sender": msg.sender,
            "text": msg.text,
            "timestamp": msg.timestamp.isoformat()
        })
    return jsonify(result), 200

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "Tidak ada file yang dikirim"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Nama file kosong"}), 400
        
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        try:
            process_document(filepath)
            os.remove(filepath)
            return jsonify({"message": f"File {filename} berhasil diproses dan disimpan ke knowledge base."})
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({"error": str(e)}), 500

# Endpoint untuk chatbot
@app.route('/api/chats/<chat_id>/ask', methods=['POST'])
@token_required
def ask_gemini(current_user, chat_id):
    chat = ChatSession.query.filter_by(id=chat_id, user_id=current_user.id).first()
    if not chat:
        return jsonify({"error": "Chat tidak ditemukan"}), 404

    data = request.get_json()
    user_question = data.get('question')
    grade = data.get('grade') or chat.grade
    subject = data.get('subject') or chat.subject

    if not user_question:
        return jsonify({"error": "Pertanyaan tidak boleh kosong"}), 400

    print(f"[{current_user.email}] Menerima pertanyaan di chat {chat_id}: {user_question}")

    # Simpan pesan user ke database
    user_msg = Message(chat_id=chat_id, sender='user', text=user_question)
    db.session.add(user_msg)
    
    # Update updated_at di chat session
    chat.updated_at = datetime.datetime.utcnow()
    
    # Ambil riwayat percakapan sebelumnya (batas 10 pesan terakhir agar konteks tidak terlalu besar)
    past_messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.timestamp.desc()).limit(10).all()
    past_messages.reverse()
    
    history_str = ""
    for msg in past_messages:
        # Skip pesan user yang baru saja ditambahkan dari history (karena akan dikirim sebagai query utama)
        if msg.id == user_msg.id:
            continue
        role = "Siswa" if msg.sender == 'user' else "Tutor AI"
        history_str += f"{role}: {msg.text}\n"

    try:
        # Buat instruksi sistem berdasarkan masukan kelas dan mata pelajaran
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

        # Dapatkan jawaban menggunakan modul RAG dan riwayat
        ai_response = generate_answer(user_question, system_instruction, history_str)

        # Simpan pesan AI ke database
        ai_msg = Message(chat_id=chat_id, sender='ai', text=ai_response)
        db.session.add(ai_msg)
        db.session.commit()

        print(f"[{current_user.email}] Jawaban AI sukses diproses dan disimpan.") # Log status sukses

        return jsonify({
            "answer": ai_response,
            "user_message_id": user_msg.id,
            "ai_message_id": ai_msg.id
        })
    except Exception as e:
        print(f"Error saat memproses pertanyaan: {e}")
        error_msg = str(e)
        if "rate_limit_exceeded" in error_msg.lower() or "429" in error_msg:
            return jsonify({"error": "Batas penggunaan API terlampaui. Harap tunggu beberapa saat sebelum mencoba lagi."}), 429
        return jsonify({"error": "Terjadi kesalahan saat memproses pertanyaan Anda."}), 500

# Endpoint sederhana untuk testing apakah backend berjalan
@app.route('/')
def home():
    return "Backend PintarAI berjalan!"

# Jalankan aplikasi Flask
if __name__ == '__main__':
    # Di lingkungan produksi, kamu akan menggunakan gunicorn atau sejenisnya
    # Untuk pengembangan, ini cukup
    app.run(debug=True, port=5000)