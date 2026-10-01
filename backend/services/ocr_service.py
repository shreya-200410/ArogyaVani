import easyocr


# Load EasyOCR reader once when the service starts.
# English is enough for the current medical report OCR pipeline.
reader = easyocr.Reader(
    ["en"],
    gpu=False
)


def extract_text_from_image(file_path: str) -> str:
    """
    Extract text from a medical report image using EasyOCR.
    """

    results = reader.readtext(
        file_path,
        detail=0
    )

    text = "\n".join(results)

    return text.strip()