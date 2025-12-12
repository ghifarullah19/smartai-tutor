import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS  # Ini penting untuk komunikasi frontend-backend

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
    raise ValueError(
        "GOOGLE_API_KEY tidak ditemukan di variabel lingkungan. Pastikan sudah diatur di file .env"
    )

genai.configure(api_key=API_KEY)

# Inisialisasi model Generative AI
# Pilih model yang sesuai. gemini-pro adalah pilihan umum untuk text-only
model = genai.GenerativeModel("gemini-2.5-flash")


def prompt_template(user_question):
    """
    Creates a structured prompt for the AI tutor that maintains educational context
    and provides appropriate guidance for high school students.
    """
    prompt = f"""You are PintarAI, a friendly and knowledgeable virtual tutor designed to help high school students in rural ASEAN areas who may not have easy access to physical teachers.

    Your role is to:
    - Provide clear, step-by-step explanations suitable for high school level
    - Encourage critical thinking by asking guiding questions when appropriate
    - Use simple language and avoid overly technical jargon
    - Be patient and supportive in your teaching approach
    - Cover subjects like Mathematics, Science, English, and other high school topics
    - Adapt your explanations to the student's level of understanding
    - Provide examples and analogies to make concepts easier to grasp

    Guidelines:
    1. If the question is academic, provide a thorough explanation with examples
    2. Break down complex problems into manageable steps
    3. Encourage the student to think through problems rather than just giving answers
    4. If asked about non-academic topics, politely redirect to educational content
    5. Use positive reinforcement to build confidence

    Student's Question: {user_question}

    Please provide a helpful, educational response:"""

    return prompt


# Endpoint untuk chatbot
@app.route("/ask", methods=["POST"])
def ask_gemini():
    data = request.get_json()
    user_question = data.get("question")
    user_id = data.get("userId")  # Ambil userId dari frontend

    if not user_question:
        return jsonify({"error": "Pertanyaan tidak boleh kosong"}), 400

    print(f"[{user_id}] Menerima pertanyaan: {user_question}")  # Log userId

    try:
        formatted_prompt = prompt_template(user_question)

        # Kirim pertanyaan ke model Gemini dengan prompt yang sudah diformat
        response = model.generate_content(formatted_prompt)
        ai_response = response.text

        print(f"[{user_id}] Jawaban AI: {ai_response}")  # Log userId dan jawaban

        return jsonify({"answer": ai_response})
    except Exception as e:
        print(f"Error saat memanggil Gemini API: {e}")
        return (
            jsonify({"error": "Terjadi kesalahan saat memproses pertanyaan Anda."}),
            500,
        )


# Endpoint sederhana untuk testing apakah backend berjalan
@app.route("/")
def home():
    return "Backend PintarAI berjalan!"


# Jalankan aplikasi Flask
if __name__ == "__main__":
    # Di lingkungan produksi, kamu akan menggunakan gunicorn atau sejenisnya
    # Untuk pengembangan, ini cukup
    app.run(debug=True, port=5000)
