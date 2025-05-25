import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS # Ini penting untuk komunikasi frontend-backend

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

# Inisialisasi model Generative AI
# Pilih model yang sesuai. gemini-pro adalah pilihan umum untuk text-only
model = genai.GenerativeModel('gemini-1.5-flash')

# Endpoint untuk chatbot
@app.route('/ask', methods=['POST'])
def ask_gemini():
    data = request.get_json()
    user_question = data.get('question')
    user_id = data.get('userId') # Ambil userId dari frontend

    if not user_question:
        return jsonify({"error": "Pertanyaan tidak boleh kosong"}), 400

    print(f"[{user_id}] Menerima pertanyaan: {user_question}") # Log userId

    try:
        # Kirim pertanyaan ke model Gemini
        response = model.generate_content(user_question)
        ai_response = response.text

        print(f"[{user_id}] Jawaban AI: {ai_response}") # Log userId dan jawaban

        return jsonify({"answer": ai_response})
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