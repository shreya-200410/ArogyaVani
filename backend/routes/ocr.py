import os
import shutil
import uuid

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


@router.post("/report")
async def upload_report(
    file: UploadFile = File(...)
):

    allowed_types = {
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp"
}

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail="Only JPG and PNG images are supported."
        )

    os.makedirs(
        "temp_reports",
        exist_ok=True
    )

    extension = os.path.splitext(
        file.filename or ""
    )[1]

    filename = (
        f"report_{uuid.uuid4().hex}"
        f"{extension}"
    )

    path = os.path.join(
        "temp_reports",
        filename
    )

    try:

        with open(path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        extracted_text = (
            extract_text_from_image(path)
        )

        return {
            "filename": file.filename,
            "extracted_text": extracted_text
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        if os.path.exists(path):
            os.remove(path)