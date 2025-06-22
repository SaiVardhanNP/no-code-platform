from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

import google.generativeai as genai
from dotenv import load_dotenv
from google.api_core.exceptions import GoogleAPIError

from chromadb import Client
from chromadb.config import Settings

# Load env
load_dotenv()

try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
except TypeError:
    raise ValueError("GEMINI_API_KEY not found in .env file")

router = APIRouter()

# ✅ Set up ChromaDB with same config
chroma_client = Client(Settings(anonymized_telemetry=False))
collection = chroma_client.get_or_create_collection("documents")

class ChatRequest(BaseModel):
    query: str

@router.post("/chat")
async def handle_chat_request(request: ChatRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    try:
        # Use Gemini to embed the query
        embedding = genai.embed_content(
            model="models/embedding-001",
            content=request.query,
            task_type="RETRIEVAL_QUERY"
        )["embedding"]

        # Search ChromaDB
        results = collection.query(
            query_embeddings=[embedding],
            n_results=1
        )

        if not results["documents"]:
            return {"response": "No relevant content found."}

        top_doc = results["documents"][0][0]

        # Use Gemini for final summarization
        model = genai.GenerativeModel("models/gemini-1.5-flash-latest")
        response = model.generate_content(f"{request.query}\n\nContext:\n{top_doc}")

        return {"response": response.text}

    except GoogleAPIError as e:
        raise HTTPException(status_code=500, detail=f"Google API Error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
