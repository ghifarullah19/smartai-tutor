import os
from dotenv import load_dotenv
load_dotenv()

from langchain_groq import ChatGroq
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import PromptTemplate
from pypdf import PdfReader
from docx import Document as DocxDocument

# Inisialisasi ChatGroq (Menggunakan model Groq)
groq_model_name = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
try:
    chat_model = ChatGroq(model_name=groq_model_name)
except Exception:
    chat_model = ChatGroq(model_name="llama3-8b-8192")

def get_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    if ext == ".pdf":
        reader = PdfReader(file_path)
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
    elif ext == ".docx":
        doc = DocxDocument(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    elif ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        raise ValueError(f"Tipe file {ext} tidak didukung.")
    return text

def process_document(file_path: str):
    """Membaca file dan memecahnya menjadi kumpulan teks."""
    text = get_text_from_file(file_path)
    if not text.strip():
        raise ValueError("Teks kosong atau gagal diekstrak.")
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    return text_splitter.split_text(text)

def generate_answer(query: str, system_instruction: str, history_str: str = "", context: str = "") -> str:
    """Mengirim pertanyaan, instruksi tutor, dan riwayat percakapan langsung ke Groq API."""
    template = """{system_instruction}

{context_str}Riwayat Percakapan Sebelumnya:
{history_str}

Jawablah pertanyaan dari user berikut:
Pertanyaan: {query}

(Catatan: Berikan jawaban sebagai tutor yang ramah dan mendidik untuk siswa SMA. Perhatikan riwayat percakapan sebelumnya untuk menyambung konteks pembicaraan.)
Jawaban:"""
    
    context_str = f"Berdasarkan konteks dokumen berikut:\n{context}\n\n" if context and context.strip() else ""
    
    prompt = PromptTemplate.from_template(template)
    chain = prompt | chat_model
    
    response = chain.invoke({
        "system_instruction": system_instruction,
        "context_str": context_str,
        "history_str": history_str,
        "query": query
    })
    
    return response.content

