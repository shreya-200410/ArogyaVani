HIGH_RISK_KEYWORDS = [
    "chest pain",
    "difficulty breathing",
    "can't breathe",
    "cannot breathe",
    "severe bleeding",
    "unconscious",
    "stroke",
    "heart attack",
    "suicide",
    "poisoning",
    "overdose",
]

DIAGNOSIS_PHRASES = [
    "do i have",
    "am i suffering from",
    "is this cancer",
    "is this diabetes",
    "diagnose me",
    "what disease do i have",
]


def assess_safety(query: str):

    text = query.lower().strip()

    emergency = any(
        keyword in text
        for keyword in HIGH_RISK_KEYWORDS
    )

    diagnosis_request = any(
        phrase in text
        for phrase in DIAGNOSIS_PHRASES
    )

    if emergency:
        return {
            "level": "emergency",
            "message": (
                "This may require urgent medical attention. "
                "Please contact local emergency medical services "
                "or seek immediate professional medical care."
            )
        }

    if diagnosis_request:
        return {
            "level": "diagnosis",
            "message": (
                "I can provide general health information, "
                "but I cannot diagnose a medical condition. "
                "Please consult a qualified healthcare professional "
                "for diagnosis and personalized advice."
            )
        }

    return {
        "level": "normal",
        "message": None
    }