from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Document
import fitz  # PyMuPDF
import os, shutil

from chromadb import Client
from chromadb.config import Settings
import google.generativeai as genai
from dotenv import load_dotenv
from google.api_core.exceptions import PermissionDenied, InvalidArgument

load_dotenv()

# Configure Gemini API
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
except TypeError:
    raise ValueError("GEMINI_API_KEY not found in .env")

router = APIRouter()
UPLOAD_DIR = "uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Fresh ChromaDB instance (in-memory)
chroma_client = Client(Settings(anonymized_telemetry=False))

# ❗ Hard delete and recreate the collection to avoid dimension mismatch
if "documents" in [c.name for c in chroma_client.list_collections()]:
    chroma_client.delete_collection("documents")

collection = chroma_client.create_collection(name="documents")


@router.post("/upload-doc")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    save_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(save_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        doc = fitz.open(save_path)
        full_text = "\n".join([page.get_text() for page in doc])
        doc.close()

        if not full_text.strip():
            raise HTTPException(status_code=400, detail="No extractable text found.")

        # Use Gemini embedding model (384-dim)
        response = genai.embed_content(
            model="models/embedding-001",
            content=full_text,
            task_type="RETRIEVAL_DOCUMENT"
        )
        embedding_vector = response["embedding"]

        # Add to ChromaDB
        collection.add(
            documents=[full_text],
            embeddings=[embedding_vector],
            ids=[file.filename]
        )

        # Store metadata in DB
        new_doc = Document(name=file.filename, path=save_path)
        db.add(new_doc)
        db.commit()

    except (PermissionDenied, InvalidArgument) as e:
        raise HTTPException(status_code=403, detail=f"Google API Error: {e}")
    except Exception as e:
        if os.path.exists(save_path):
            os.remove(save_path)
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    return {
        "filename": file.filename,
        "text_preview": full_text[:500],
        "message": "PDF processed and embedded successfully."
    }
