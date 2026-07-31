import os
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from werkzeug.utils import secure_filename
from rag import process_document

router = APIRouter()

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'uploads')

@router.post("/upload")
def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Nama file kosong")
    
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    try:
        with open(filepath, "wb") as buffer:
            buffer.write(file.file.read())
        
        process_document(filepath)
        os.remove(filepath)
        return {"message": f"File {filename} berhasil diproses dan disimpan ke knowledge base."}
    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail=str(e))
