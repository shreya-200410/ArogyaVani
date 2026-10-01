# ArogyaVani (HealthSaathi AI)

ArogyaVani is a multilingual healthcare information assistant. Users can ask questions in English, Hindi, or Marathi, dictate questions, and upload medical report images for text extraction and explanation.

The app has a React and Vite frontend and a FastAPI backend. Chat answers use retrieved medical reference text from Pinecone and Groq generation. The backend also provides account registration and login with SQLite storage, Groq speech transcription, and English OCR through EasyOCR. The browser provides answer read-aloud using its built-in speech synthesis.

## Features

- Healthcare Q&A in English, Hindi, and Marathi.
- Retrieval-augmented answers from the documents in `data/medical/`.
- Speech-to-text with Groq Whisper.
- Image report text extraction with EasyOCR.
- Browser-based answer read-aloud.
- Registration and login, backed by SQLite and JWT tokens.
- Chat history and processed report records saved in browser local storage.
- Chat, reports, history, and profile views in the dashboard.

## Requirements

- Python 3.11 recommended.
- Node.js 20 or newer and npm.
- A Groq API key.
- A Pinecone account and API key.

The first EasyOCR run may download its model files. Chat, speech transcription, and Pinecone retrieval need internet access and configured provider credentials.

## Configure the backend

From the project root, create and activate a virtual environment, then install the backend packages.

Windows (PowerShell):

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
```

macOS or Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` and set:

```dotenv
GROQ_API_KEY=your-groq-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX_NAME=multilingual-health-assistant
JWT_SECRET_KEY=replace-with-a-long-random-secret
PINECONE_CLOUD=aws
PINECONE_REGION=us-east-1
```

Generate a JWT secret with `python -c "import secrets; print(secrets.token_urlsafe(48))"`. `GROQ_STT_MODEL` is optional; it defaults to `whisper-large-v3-turbo`.

Create the Pinecone index and upload the medical reference documents. Run these commands from the `backend` directory:

```powershell
python scripts/create_pinecone_index.py
python scripts/ingest_docs.py
```

The ingestion script embeds the text files in `data/medical/` with Pinecone's `multilingual-e5-large` model. Re-running ingestion replaces the vectors for each document topic in the configured index.

Start the API from the `backend` directory:

```powershell
uvicorn main:app --reload
```

The API is available at `http://localhost:8000`. Interactive API documentation is at `http://localhost:8000/docs`, and the health check is `http://localhost:8000/health`. The app creates `backend/users.db` on startup.

## Run the frontend

In a second terminal, from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. The frontend defaults to `http://localhost:8000/api`. To use another backend URL, create `frontend/.env` with:

```dotenv
VITE_API_URL=http://localhost:8000/api
```

Restart the Vite server after changing frontend environment variables.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/` | API status message |
| `GET` | `/health` | Health check |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/chat` | Retrieve context and generate an answer |
| `POST` | `/api/voice/transcribe` | Transcribe an uploaded audio file |
| `POST` | `/api/ocr/report` | Extract text from an uploaded report image |

## Project layout

```text
backend/        FastAPI API, services, auth, and setup scripts
data/medical/   Text documents ingested into Pinecone
frontend/       React and Vite user interface
```

## Safety and privacy

ArogyaVani provides general health information; it does not diagnose conditions or prescribe treatment. For urgent symptoms, seek emergency care. Consult a qualified healthcare professional for personal medical advice.

Chat history and extracted report text are stored in the current browser's local storage. Account records are stored in the local SQLite database. Uploaded report and audio files are written to temporary backend folders for processing and removed afterward. Do not commit `.env` files or API keys.
