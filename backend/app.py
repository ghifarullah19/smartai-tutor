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
from models import db, User
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
@app.route('/ask', methods=['POST'])
def ask_gemini():
    data = request.get_json()
    user_question = data.get('question')
    user_id = data.get('userId') # Ambil userId dari frontend
    grade = data.get('grade') # Ambil grade (kelas) dari frontend
    subject = data.get('subject') # Ambil subject (mata pelajaran) dari frontend

    if not user_question:
        return jsonify({"error": "Pertanyaan tidak boleh kosong"}), 400

    print(f"[{user_id}] Menerima pertanyaan: {user_question} | Kelas: {grade} | Pelajaran: {subject}")

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

        # Dapatkan jawaban menggunakan modul RAG
        ai_response = generate_answer(user_question, system_instruction)

        print(f"[{user_id}] Jawaban AI sukses diproses.") # Log status sukses

        return jsonify({"answer": ai_response})
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