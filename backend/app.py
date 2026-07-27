import os
from dotenv import load_dotenv
# Muat variabel lingkungan dari .env sedini mungkin
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS # Ini penting untuk komunikasi frontend-backend
from werkzeug.utils import secure_filename
from rag import process_document, generate_answer

# Inisialisasi Flask App
app = Flask(__name__)
# Aktifkan CORS untuk mengizinkan permintaan dari frontend
CORS(app) 

# Konfigurasi Upload
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



# Konfigurasi Groq API
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY tidak ditemukan di variabel lingkungan. Pastikan sudah diatur di file .env")

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