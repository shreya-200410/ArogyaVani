import os

from dotenv import load_dotenv
from groq import Groq


# Load environment variables
load_dotenv(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        ".env"
    )
)

GROQ_API_KEY = os.getenv(
    "GROQ_API_KEY"
)

if not GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY is missing from backend/.env"
    )


# Groq client
client = Groq(
    api_key=GROQ_API_KEY
)


# --------------------------------------------------
# System prompt
# --------------------------------------------------

SYSTEM_PROMPT = """
You are ArogyaVani, a multilingual healthcare
information assistant.

Your job is to provide clear, simple and safe
health information using ONLY the medical context
provided to you.

IMPORTANT RULES:

1. Use the retrieved context as your primary source.
2. Do not invent medical facts that are not present
   in the provided context.
3. Do not diagnose the user.
4. Do not prescribe medicines.
5. Do not tell users to start, stop or change treatment.
6. If the retrieved context does not contain enough
   information to answer the question, clearly say
   that the available information is insufficient.
7. Encourage consultation with a qualified healthcare
   professional when appropriate.
8. Give the answer in the language requested by the user.
9. Keep the answer easy to understand.
"""


def generate_answer(
    question: str,
    context: str,
    language: str = "English"
):
    """
    Generate a grounded answer using Groq.
    """

    user_prompt = f"""
User question:
{question}

Requested language:
{language}

Retrieved medical context:
-------------------------
{context}
-------------------------

Using the retrieved medical context, answer the
user's question clearly and safely.

Do not add unsupported medical information.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        temperature=0.2,
        max_tokens=500
    )

    return response.choices[0].message.content