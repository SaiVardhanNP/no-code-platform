from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, chat,workflow  # ✅ Import the new chat route



app = FastAPI()

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register routers
app.include_router(upload.router)
app.include_router(chat.router)
app.include_router(workflow.router)


# ✅ Root check
@app.get("/")
def root():
    return {"msg": "Backend is running!"}
