import os
from dotenv import load_dotenv
load_dotenv()

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_groq import ChatGroq
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import PromptTemplate
from langchain_core.documents import Document
import pandas as pd
from pypdf import PdfReader
from docx import Document as DocxDocument

# Setup directories
CHROMA_PATH = os.path.join(os.path.dirname(__file__), "chroma_db")

# Inisialisasi embeddings menggunakan Hugging Face (all-MiniLM-L6-v2)
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Inisialisasi Chroma (persistent)
vector_store = Chroma(
    collection_name="smartai_knowledge",
    embedding_function=embeddings,
    persist_directory=CHROMA_PATH
)

# Inisialisasi ChatGroq
# Secara otomatis akan menggunakan variabel lingkungan GROQ_API_KEY
chat_model = ChatGroq(model_name="openai/gpt-oss-20b")

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
    elif ext in [".xlsx", ".xls"]:
        df = pd.read_excel(file_path)
        text = df.to_string()
    else:
        raise ValueError(f"Tipe file {ext} tidak didukung.")
    return text

def process_document(file_path: str):
    """Membaca file, memecahnya menjadi teks, lalu memasukkannya ke ChromaDB."""
    text = get_text_from_file(file_path)
    if not text.strip():
        raise ValueError("Teks kosong atau gagal diekstrak.")
    
    # Memecah teks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    
    chunks = text_splitter.split_text(text)
    
    # Mengubah ke format Document
    docs = [Document(page_content=chunk) for chunk in chunks]
    
    # Menyimpan ke ChromaDB
    vector_store.add_documents(docs)

def generate_answer(query: str, system_instruction: str) -> str:
    """Melakukan pencarian konteks di ChromaDB dan mengirim ke Groq API."""
    # 1. Similarity Search
    results = vector_store.similarity_search(query, k=3)
    context = "\n\n".join([doc.page_content for doc in results])
    
    # 2. Setup Prompt Template
    template = """{system_instruction}

Berdasarkan konteks tambahan dari dokumen berikut (jika ada dan relevan):
{context}

Jawablah pertanyaan dari user berikut:
Pertanyaan: {query}

(Catatan: Jika informasi relevan tidak ada di dalam konteks tambahan, abaikan konteks tersebut dan gunakan pengetahuanmu sendiri sebagai tutor untuk menjawab.)
Jawaban:"""
    
    prompt = PromptTemplate.from_template(template)
    chain = prompt | chat_model
    
    # 3. Eksekusi model
    response = chain.invoke({
        "system_instruction": system_instruction,
        "context": context,
        "query": query
    })
    
    return response.content
