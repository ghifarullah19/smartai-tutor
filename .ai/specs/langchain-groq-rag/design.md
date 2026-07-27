# Design: LangChain Groq RAG

## Architecture
PintarAI Backend akan dimodifikasi dari script sederhana yang langsung memanggil LLM menjadi sistem berbasis RAG (Retrieval-Augmented Generation) menggunakan *framework* LangChain.
Proses generasi teks sepenuhnya menggunakan layanan Cloud (Groq), sementara embedding menggunakan model ringan secara lokal (all-MiniLM).

## Data Flow
### 1. Data Ingestion (File Upload)
1. User mengunggah file PDF, DOCX, atau Excel via `POST /upload`.
2. Flask menyimpan file secara sementara (`temp/`).
3. LangChain Document Loaders membaca teks dari file tersebut.
4. Teks dipecah oleh `RecursiveCharacterTextSplitter`.
5. Potongan teks diproses oleh model all-MiniLM untuk diubah menjadi vektor.
6. Vektor disimpan secara persisten di ChromaDB (`chroma_db/`).

### 2. Retrieval & Generation (Q&A)
1. User mengirim pertanyaan via `POST /ask`.
2. Pertanyaan diubah menjadi vektor menggunakan model all-MiniLM.
3. ChromaDB melakukan pencarian kesamaan (*similarity search*) dan mengembalikan potongan teks yang paling relevan (konteks).
4. Konteks, instruksi sistem (termasuk kelas/pelajaran), dan pertanyaan digabungkan menjadi satu *prompt*.
5. *Prompt* dikirim ke Groq API (`ChatGroq`).
6. Jawaban dari Groq dikembalikan sebagai respon API ke frontend.

## Components Affected
- `backend/app.py`: Modifikasi rute `/ask` dan penambahan rute `/upload`.
- `backend/requirements.txt`: Penambahan *library* terkait LangChain, Chroma, dan pengolah dokumen.
- `backend/.env`: Kebutuhan akan `GROQ_API_KEY`.
- `backend/rag.py` (Baru): Modul pemisah khusus untuk membungkus logika LangChain dan ChromaDB agar `app.py` tidak terlalu berantakan.

## Implementation Decisions
1. **Embedding API**: Atas permintaan eksplisit pengguna, embedding dijalankan secara lokal menggunakan `HuggingFaceEmbeddings` (model `all-MiniLM-L6-v2`). Ini melepaskan ketergantungan pada API Google.
2. **Text Loaders**: Kita akan menggunakan paket standar Python seperti `pypdf`, `python-docx`, dan `pandas` (untuk excel) agar proses *parsing* ringan.
3. **ChromaDB**: Akan dikonfigurasi menggunakan mode `PersistentClient` agar data tidak hilang ketika server di-*restart*.
