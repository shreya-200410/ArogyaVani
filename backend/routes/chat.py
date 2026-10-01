from fastapi import APIRouter
from pydantic import BaseModel

from services.rag import retrieve_context
from services.llm import generate_answer
from services.translation import language_name
from services.safety import assess_safety


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    query: str
    language: str = "English"


@router.post("")
def chat(request: ChatRequest):

    # --------------------------------------------------
    # 1. Normalize requested language
    # --------------------------------------------------

    selected_language = language_name(
        request.language
    )

    # --------------------------------------------------
    # 2. Safety check
    # --------------------------------------------------

    safety_result = assess_safety(
        request.query
    )

    if safety_result["level"] != "normal":

        return {
            "answer": safety_result["message"],
            "language": selected_language,
            "sources": [],
            "safety": safety_result
        }

    # --------------------------------------------------
    # 3. Retrieve relevant medical information
    # --------------------------------------------------

    retrieved_chunks = retrieve_context(
        request.query,
        top_k=3
    )

    # --------------------------------------------------
    # 4. Build context for the LLM
    # --------------------------------------------------

    context_parts = []

    for chunk in retrieved_chunks:

        context_parts.append(
            f"Section: {chunk['section']}\n"
            f"Source: {chunk['source']}\n"
            f"Content: {chunk['text']}"
        )

    context = "\n\n".join(
        context_parts
    )

    # --------------------------------------------------
    # 5. Generate grounded answer
    # --------------------------------------------------

    answer = generate_answer(
        question=request.query,
        context=context,
        language=selected_language
    )

    # --------------------------------------------------
    # 6. Return response
    # --------------------------------------------------

    return {
        "answer": answer,
        "language": selected_language,
        "sources": [
            {
                "section": chunk["section"],
                "source": chunk["source"],
                "score": chunk["score"]
            }
            for chunk in retrieved_chunks
        ],
        "safety": safety_result
    }