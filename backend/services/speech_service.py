import os

from dotenv import load_dotenv
from groq import Groq


load_dotenv(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        ".env"
    )
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY is missing from backend/.env"
    )


client = Groq(
    api_key=GROQ_API_KEY
)


STT_MODEL = os.getenv(
    "GROQ_STT_MODEL",
    "whisper-large-v3-turbo"
)


def transcribe_audio(audio_path: str):
    """
    Transcribe an audio file using Groq Whisper.
    """

    with open(audio_path, "rb") as audio_file:

        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model=STT_MODEL
        )

    return {
        "text": transcription.text,
        "language": getattr(
            transcription,
            "language",
            "en"
        )
    }