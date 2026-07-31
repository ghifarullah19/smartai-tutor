# Requirements: LangChain Groq RAG

## User Stories
1. Sebagai admin/user, saya bisa memasukkan dokumen berupa PDF, DOCX, atau Excel ke dalam sistem agar PintarAI bisa mempelajarinya.
2. Sebagai user, saya bisa bertanya kepada PintarAI dan mendapatkan jawaban yang didasarkan pada dokumen yang telah dimasukkan.
3. Sebagai pemilik server, saya tidak ingin server terbebani oleh proses komputasi AI (embedding & LLM), sehingga semuanya harus diproses melalui API eksternal.

## Acceptance Criteria
1. Sistem memiliki endpoint untuk menerima upload file (PDF, DOCX, Excel).
2. Sistem dapat mengekstrak teks dari file-file tersebut.
3. Teks yang diekstrak dipecah menggunakan `RecursiveCharacterTextSplitter`.
4. Sistem menggunakan model embedding lokal HuggingFace (all-MiniLM) untuk mengubah teks menjadi vektor.
5. Vektor disimpan di dalam ChromaDB lokal.
6. Endpoint `/ask` menggunakan LangChain untuk mengambil konteks yang relevan dari ChromaDB, lalu menghasilkan jawaban menggunakan model dari Groq API.
7. Aplikasi berjalan lancar tanpa menggunakan CPU/RAM secara intensif untuk *inference* AI.

## Functional Requirements
- **File Upload:** Endpoint `POST /upload` untuk menerima file `pdf`, `docx`, dan `xlsx`.
- **Text Extraction:** Integrasi parser file (`PyPDF2`/`pypdf`, `python-docx`, `pandas`/`openpyxl`).
- **Embedding:** Menggunakan `HuggingFaceEmbeddings` (model `all-MiniLM-L6-v2`).
- **Vector Store:** Menggunakan `Chroma` sebagai penyimpan vektor di disk lokal.
- **LLM:** Menggunakan `ChatGroq` (misal model `llama3-8b-8192`) untuk memproses instruksi sistem, konteks dari Chroma, dan pertanyaan user.
- **Environment:** Mendukung `GROQ_API_KEY` dan `GOOGLE_API_KEY`.
