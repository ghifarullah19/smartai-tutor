import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS # Ini penting untuk komunikasi frontend-backend
from google.api_core.exceptions import ResourceExhausted

# Muat variabel lingkungan dari .env
load_dotenv()

# Inisialisasi Flask App
app = Flask(__name__)
# Aktifkan CORS untuk mengizinkan permintaan dari frontend
CORS(app) 

# Konfigurasi Google Gemini API
# Pastikan variabel lingkungan GOOGLE_API_KEY sudah diatur di file .env
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise ValueError("GOOGLE_API_KEY tidak ditemukan di variabel lingkungan. Pastikan sudah diatur di file .env")

genai.configure(api_key=API_KEY)

# Inisialisasi model Generative AI default (tanpa instruksi kustom)
default_model = genai.GenerativeModel('gemini-2.5-flash')

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

        # Inisialisasi model dengan instruksi sistem kustom per permintaan
        req_model = genai.GenerativeModel('gemini-2.5-flash-lite', system_instruction=system_instruction)

        # Kirim pertanyaan ke model Gemini
        response = req_model.generate_content(user_question)
        ai_response = response.text

        print(f"[{user_id}] Jawaban AI sukses diproses.") # Log status sukses

        return jsonify({"answer": ai_response})
    except ResourceExhausted as e:
        print(f"Gemini API Rate Limit exceeded: {e}")
        return jsonify({"error": "Batas pengiriman pesan terlampaui. PintarAI sedang menerima terlalu banyak pertanyaan. Harap tunggu beberapa saat sebelum mengirim pesan lagi."}), 429
    except Exception as e:
        print(f"Error saat memanggil Gemini API: {e}")
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