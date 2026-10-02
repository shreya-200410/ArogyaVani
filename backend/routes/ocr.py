from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)

from services.ocr_service import (
    extract_text_from_image
)


router = APIRouter(
    prefix="/ocr",
    tags=["OCR"]
)

MAX_IMAGE_BYTES = 20 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
}


@router.post("/report")
async def upload_report(
    file: UploadFile = File(...)
):

    content_type = (file.content_type or "").split(";")[0].lower()

    if content_type not in ALLOWED_IMAGE_TYPES:

        raise HTTPException(
            status_code=400,
            detail="Upload a JPG, PNG, or WEBP image."
        )

    image_bytes = await file.read(MAX_IMAGE_BYTES + 1)

    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="The report image must be 20 MB or smaller."
        )

    try:
        extracted_text = extract_text_from_image(
            image_bytes,
            content_type
        )

        return {
            "filename": file.filename,
            "extracted_text": extracted_text
        }

    except Exception as error:
        # Avoid returning provider internals or submitted medical data to the client.
        raise HTTPException(
            status_code=502,
            detail="Groq could not process this report image. Check the API key, model access, and try again."
        ) from error
