import base64
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
    raise ValueError("GROQ_API_KEY is missing from backend/.env")


GROQ_VISION_MODEL = os.getenv(
    "GROQ_VISION_MODEL",
    "qwen/qwen3.8-27b"
)

client = Groq(api_key=GROQ_API_KEY)


def extract_text_from_image(
    image_bytes: bytes,
    content_type: str
) -> str:
    """Transcribe the visible text in a report image using Groq vision."""

    if content_type == "image/jpg":
        content_type = "image/jpeg"

    encoded_image = base64.b64encode(image_bytes).decode("ascii")
    image_data_url = f"data:{content_type};base64,{encoded_image}"

    response = client.chat.completions.create(
        model=GROQ_VISION_MODEL,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            "Transcribe all readable text from this medical report image. "
                            "Preserve the wording, numbers, units, labels, and line breaks "
                            "as closely as possible. Do not interpret, summarize, or infer "
                            "missing text. If a section is unreadable, mark it as [unreadable]."
                        )
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": image_data_url}
                    }
                ]
            }
        ],
        temperature=0.1,
        max_completion_tokens=4096
    )

    return (response.choices[0].message.content or "").strip()
