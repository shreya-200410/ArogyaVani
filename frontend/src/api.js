const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api";


export async function sendChatMessage({
    query,
    language,
    sessionId,
    history
}) {

    const response = await fetch(
        `${API_URL}/chat`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                query,
                language,
                session_id: sessionId,
                history
            })
        }
    );


    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);
    }


    return response.json();
}


export async function transcribeAudio(
    audioBlob
) {

    const formData =
        new FormData();

    formData.append(
        "file",
        audioBlob,
        "recording.webm"
    );


    const response = await fetch(
        `${API_URL}/voice/transcribe`,
        {
            method: "POST",
            body: formData
        }
    );


    if (!response.ok) {

        throw new Error(
            "Voice transcription failed."
        );
    }


    return response.json();
}


export async function uploadReport(
    file
) {

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );


    const response = await fetch(
        `${API_URL}/ocr/report`,
        {
            method: "POST",
            body: formData
        }
    );


    if (!response.ok) {

        throw new Error(
            "Report processing failed."
        );
    }


    return response.json();
}

export async function registerUser({
    name,
    email,
    password
}) {

    const response = await fetch(
        `${API_URL}/auth/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })
        }
    );


    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);
    }


    return response.json();
}


export async function loginUser({
    email,
    password
}) {

    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );


    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);
    }


    return response.json();
}