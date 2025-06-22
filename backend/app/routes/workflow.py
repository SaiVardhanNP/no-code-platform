from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load Gemini API Key
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Import shared vector store collection from upload.py
from app.routes.upload import collection

router = APIRouter()

# Define node format
class Node(BaseModel):
    id: str
    type: str
    data: Optional[Dict[str, Any]] = {}
    next: Optional[str]

class WorkflowRequest(BaseModel):
    input_query: str
    nodes: List[Node]


@router.post("/execute-workflow")
async def execute_workflow(request: WorkflowRequest):
    query = request.input_query
    nodes = {node.id: node for node in request.nodes}
    current_id = next((n.id for n in request.nodes if n.type == "UserQuery"), None)

    if not current_id:
        raise HTTPException(status_code=400, detail="Workflow must start with a UserQuery node.")

    context = ""
    final_response = ""

    while current_id:
        node = nodes[current_id]

        if node.type == "UserQuery":
            pass  # query is already captured

        elif node.type == "KnowledgeBase":
            try:
                query_embedding = genai.embed_content(
                    model="models/embedding-001",
                    content=query,
                    task_type="RETRIEVAL_QUERY"
                )["embedding"]

                results = collection.query(
                    query_embeddings=[query_embedding],
                    n_results=1
                )
                context = results["documents"][0][0]

            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Context Retrieval Failed: {str(e)}")

        elif node.type == "LLMEngine":
            prompt = node.data.get("prompt", "Answer the query:")
            combined_input = f"{prompt}\n\nContext:\n{context}\n\nQuery:\n{query}"
            try:
                chat_model = genai.GenerativeModel("models/gemini-1.5-flash-latest")
                response = chat_model.generate_content(combined_input)
                final_response = response.text if response.parts else "No response from LLM."

            except Exception as e:
                raise HTTPException(status_code=500, detail=f"LLM Error: {str(e)}")

        elif node.type == "Output":
            return {"response": final_response or "No output generated."}

        current_id = node.next

    return {"response": "Workflow ended without reaching Output node."}
