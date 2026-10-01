import os
import shutil
import uuid

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)

from services.speech_service import (
    transcribe_audio
)


router = APIRouter(
    prefix="/voice",
    tags=["Voice"]
)


@router.post("/transcribe")
async def transcribe(
    file: UploadFile = File(...)
):
    """
    Receive an audio file and transcribe it
    using Groq Whisper.
    """

    extension = os.path.splitext(
        file.filename or ""
    )[1]

    if not extension:
        extension = ".wav"

    os.makedirs(
        "temp_audio",
        exist_ok=True
    )

    temp_filename = (
        f"temp_{uuid.uuid4().hex}"
        f"{extension}"
    )

    path = os.path.join(
        "temp_audio",
        temp_filename
    )

    try:

        with open(path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        result = transcribe_audio(
            path
        )

        return {
            "transcript": result["text"],
            "language": result["language"]
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        if os.path.exists(path):
            os.remove(path)


@router.post("/speak")
async def speak(
    text: str,
    language: str = "en"
):
    """
    Text-to-speech is not enabled yet.
    Browser-based speech synthesis can be used
    by the frontend instead.
    """

    raise HTTPException(
        status_code=501,
        detail="Text-to-speech is not configured yet."
    )