from pydantic import BaseModel, Field
from typing import List, Optional


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1)
    language: str = "en"
    session_id: str = "default"
    history: Optional[List[dict]] = None


class Source(BaseModel):
    title: str
    source: str
    score: Optional[float] = None


class ChatResponse(BaseModel):
    answer: str
    language: str
    safety_message: Optional[str] = None
    sources: List[Source] = []
    grounded: bool = False


class OCRResponse(BaseModel):
    extracted_text: str
    filename: str


class VoiceResponse(BaseModel):
    transcript: str
    language: str