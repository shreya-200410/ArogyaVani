SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "mr": "Marathi"
}


ALIASES = {
    "en": "en",
    "english": "en",

    "hi": "hi",
    "hindi": "hi",
    "हिंदी": "hi",

    "mr": "mr",
    "marathi": "mr",
    "मराठी": "mr",

    "इंग्रजी": "en"
}


def normalize_language(language: str) -> str:
    """
    Convert language names or language codes
    into the supported language code.
    """

    language = (
        language or "en"
    ).lower().strip()

    language = ALIASES.get(
        language,
        "en"
    )

    return language


def language_name(language: str) -> str:
    """
    Return the display name of a supported language.
    """

    language = normalize_language(
        language
    )

    return SUPPORTED_LANGUAGES[language]