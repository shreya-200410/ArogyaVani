from auth.database import init_database
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.chat import router as chat_router
from routes.voice import router as voice_router
from routes.ocr import router as ocr_router

from auth.routes import router as auth_router 

app = FastAPI(
    title="Multilingual Healthcare Information Assistant",
    description="Voice-first multilingual healthcare information assistant",
    version="1.0.0"
)

init_database()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://arogyavani.onrender.com"  # your live frontend domain
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(voice_router, prefix="/api")
app.include_router(ocr_router, prefix="/api")
app.include_router(auth_router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Multilingual Healthcare Assistant API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }