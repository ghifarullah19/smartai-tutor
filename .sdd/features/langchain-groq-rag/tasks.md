# Tasks: LangChain Groq RAG

## Implementation Steps

- [x] 1. **Update Dependencies**
  - Perbarui `requirements.txt` dengan menambahkan: `langchain`, `langchain-groq`, `langchain-chroma`, `langchain-huggingface`, `sentence-transformers`, `chromadb`, `pypdf`, `python-docx`, `pandas`, `openpyxl`, `werkzeug`.

- [x] 2. **Environment Variables**
  - Pastikan `.env` dikonfigurasi untuk menerima `GROQ_API_KEY` selain `GOOGLE_API_KEY`.

- [x] 3. **Create RAG Module (`backend/rag.py`)**
  - Buat fungsi untuk menginisialisasi `Chroma` dengan `HuggingFaceEmbeddings`.
  - Buat fungsi `process_document(file_path)` yang membaca file (PDF/DOCX/Excel), memecahnya dengan `RecursiveCharacterTextSplitter`, dan memasukkannya ke ChromaDB.
  - Buat fungsi `generate_answer(query, system_instruction)` yang melakukan pencarian vektor di ChromaDB dan mengirimkan *prompt* gabungan ke `ChatGroq`.

- [x] 4. **Add Upload Endpoint (`backend/app.py`)**
  - Tambahkan folder `uploads` untuk menyimpan file sementara.
  - Buat rute `POST /upload` yang menerima unggahan file, menyimpannya sementara, memanggil `process_document` dari `rag.py`, dan menghapus file sementaranya.

- [x] 5. **Update Ask Endpoint (`backend/app.py`)**
  - Modifikasi rute `POST /ask` yang ada agar tidak lagi memanggil `google.generativeai` secara langsung.
  - Ubah alur untuk memanggil fungsi `generate_answer(query, system_instruction)` dari `rag.py` dengan memberikan *system instruction* yang sudah dinamis (berisi info kelas dan mata pelajaran).

- [x] 6. **Testing**
  - Uji jalankan *backend*.
  - Coba unggah file sampel.
  - Coba ajukan pertanyaan untuk memverifikasi apakah jawaban berasal dari Groq dan mengambil konteks dari file yang diunggah.
