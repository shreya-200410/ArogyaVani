import React, {
    useEffect,
    useRef,
    useState
} from "react";

import {
    ArrowLeft,
    FileText,
    HeartPulse,
    History,
    LogOut,
    MessageCircle,
    Plus,
    Settings,
    Volume2
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";


import {
    sendChatMessage,
    transcribeAudio
} from "./api";


import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import LanguageSelector from "./components/LanguageSelector";
import ReportUpload from "./components/ReportUpload";

const WELCOME_MESSAGE = {
    role: "assistant",
    content: "Hello! I am ArogyaVani AI. Ask me a healthcare question in English, Hindi, or Marathi."
};

function readLocalList(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function readUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "null") || {};
    } catch {
        return {};
    }
}


function App() {

    const navigate = useNavigate();


    const [language, setLanguage] =
        useState("en");


    const [input, setInput] =
        useState("");


    const [messages, setMessages] =
        useState([WELCOME_MESSAGE]);

    const [currentSessionId, setCurrentSessionId] = useState(() => String(Date.now()));
    const [sessions, setSessions] = useState(() => readLocalList("arogya_chat_history"));
    const [reports, setReports] = useState(() => readLocalList("arogya_reports"));
    const [profile] = useState(readUser);


    const [loading, setLoading] =
        useState(false);


    const [recording, setRecording] =
        useState(false);


    const [activeMenu, setActiveMenu] =
        useState("chat");


    const mediaRecorderRef =
        useRef(null);


    const audioChunksRef =
        useRef([]);


    async function sendMessage() {

        const question =
            input.trim();


        if (!question || loading) {
            return;
        }


        const userMessage = {
            role: "user",
            content: question
        };


        const updatedMessages = [
            ...messages,
            userMessage
        ];


        setMessages(
            updatedMessages
        );

        saveSession(updatedMessages);


        setInput("");

        setLoading(true);


        try {

            const result =
                await sendChatMessage({

                    query: question,

                    language,

                    sessionId: currentSessionId,

                    history:
                        updatedMessages.map(
                            message => ({
                                role:
                                    message.role,

                                content:
                                    message.content
                            })
                        )
                });


            const completedMessages = [
                ...updatedMessages,
                { role: "assistant", content: result.answer, sources: result.sources }
            ];
            setMessages(completedMessages);
            saveSession(completedMessages);

        } catch (error) {

            console.error(
                "Chat error:",
                error
            );


            const failedMessages = [
                ...updatedMessages,
                { role: "assistant", content: "Sorry, I could not process your question. Please check whether the backend and RAG system are running." }
            ];
            setMessages(failedMessages);
            saveSession(failedMessages);

        } finally {

            setLoading(false);
        }
    }


    async function startRecording() {

        if (recording) {

            mediaRecorderRef.current?.stop();

            return;
        }


        try {

            const stream =
                await navigator.mediaDevices
                    .getUserMedia({
                        audio: true
                    });


            const recorder =
                new MediaRecorder(stream);


            audioChunksRef.current = [];


            recorder.ondataavailable =
                event => {

                    if (
                        event.data.size > 0
                    ) {

                        audioChunksRef.current
                            .push(event.data);

                    }
                };


            recorder.onstop =
                async () => {

                    setRecording(false);


                    stream
                        .getTracks()
                        .forEach(
                            track =>
                                track.stop()
                        );


                    const blob =
                        new Blob(
                            audioChunksRef.current,
                            {
                                type:
                                    "audio/webm"
                            }
                        );


                    try {

                        setLoading(true);


                        const result =
                            await transcribeAudio(
                                blob
                            );


                        setInput(
                            result.transcript
                        );

                    } catch (error) {

                        console.error(
                            "Voice transcription error:",
                            error
                        );


                        alert(
                            "Could not transcribe audio."
                        );

                    } finally {

                        setLoading(false);
                    }
                };


            mediaRecorderRef.current =
                recorder;


            recorder.start();

            setRecording(true);

        } catch (error) {

            console.error(
                "Microphone error:",
                error
            );


            alert(
                "Microphone permission is required."
            );
        }
    }


    function speakAnswer(text) {

        if (
            !("speechSynthesis" in window)
        ) {

            alert(
                "Speech synthesis is not supported by this browser."
            );

            return;
        }


        window.speechSynthesis.cancel();


        const utterance =
            new SpeechSynthesisUtterance(
                text
            );


        if (language === "mr") {

            utterance.lang =
                "mr-IN";

        } else if (language === "hi") {

            utterance.lang =
                "hi-IN";

        } else {

            utterance.lang =
                "en-IN";
        }


        utterance.rate = 0.95;


        window.speechSynthesis.speak(
            utterance
        );
    }


    function handleReportText(text) {

        const selectedLanguage =
            language === "mr"
                ? "Marathi"
                : language === "hi"
                    ? "Hindi"
                    : "English";


        setInput(
            `Please explain this medical report in simple ${selectedLanguage}:\n\n${text}`
        );
    }

    function saveSession(sessionMessages) {
        const firstQuestion = sessionMessages.find(message => message.role === "user")?.content || "New conversation";
        const entry = {
            id: currentSessionId,
            title: firstQuestion.slice(0, 48),
            updatedAt: new Date().toISOString(),
            messages: sessionMessages
        };
        setSessions(previous => {
            const next = [entry, ...previous.filter(session => session.id !== currentSessionId)];
            localStorage.setItem("arogya_chat_history", JSON.stringify(next));
            return next;
        });
    }

    function handleReportExtracted(text, fileName) {
        const entry = {
            id: String(Date.now()),
            name: fileName,
            extractedText: text,
            createdAt: new Date().toISOString()
        };
        setReports(previous => {
            const next = [entry, ...previous];
            localStorage.setItem("arogya_reports", JSON.stringify(next));
            return next;
        });
        handleReportText(text);
        setActiveMenu("chat");
    }


    function handleNewChat() {

        setCurrentSessionId(String(Date.now()));
        setMessages([WELCOME_MESSAGE]);


        setInput("");

        setActiveMenu("chat");
    }


    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    function openSession(session) {
        setCurrentSessionId(session.id);
        setMessages(session.messages);
        setActiveMenu("chat");
    }


    useEffect(() => {

        return () => {

            mediaRecorderRef.current
                ?.stream
                ?.getTracks()
                ?.forEach(
                    track =>
                        track.stop()
                );


            if (
                "speechSynthesis" in window
            ) {

                window.speechSynthesis.cancel();
            }

        };

    }, []);


    return (

        <div className="dashboard">

            {/* =========================
                TOP BAR
            ========================== */}

            <header className="dashboard-topbar">

                <div className="dashboard-brand">

                    <div className="dashboard-brand-icon">

                        <HeartPulse size={22} />

                    </div>


                    <div>

                        <h1>
                            ArogyaVani
                        </h1>

                        <span>
                            HealthSaathi AI
                        </span>

                    </div>

                </div>


                <div className="dashboard-user-area">

                    <LanguageSelector
                        language={language}
                        setLanguage={setLanguage}
                    />


                    <button
                        className="user-profile profile-trigger"
                        onClick={() => setActiveMenu("profile")}
                        aria-label="Open profile"
                        type="button"
                    >

                        <div className="user-avatar">
                            {(profile.name || profile.full_name || "U").charAt(0).toUpperCase()}
                        </div>

                        <div className="user-details">

                            <strong>
                                {profile.name || profile.full_name || "User"}
                            </strong>

                            <span>
                                Health Assistant
                            </span>

                        </div>

                    </button>

                </div>

            </header>


            {/* =========================
                DASHBOARD BODY
            ========================== */}

            <div className="dashboard-body">


                {/* SIDEBAR */}

                <aside className="dashboard-sidebar">

                    <button
                        className="new-chat-button"
                        onClick={handleNewChat}
                    >

                        <Plus size={18} />

                        New Chat

                    </button>


                    <div className="sidebar-menu">

                        <button
                            className={
                                activeMenu === "chat"
                                    ? "sidebar-item active"
                                    : "sidebar-item"
                            }
                            onClick={() =>
                                setActiveMenu("chat")
                            }
                        >

                            <MessageCircle size={18} />

                            Chat

                        </button>


                        <button
                            className={
                                activeMenu === "reports"
                                    ? "sidebar-item active"
                                    : "sidebar-item"
                            }
                            onClick={() =>
                                setActiveMenu("reports")
                            }
                        >

                            <FileText size={18} />

                            Reports

                        </button>


                        <button
                            className={
                                activeMenu === "history"
                                    ? "sidebar-item active"
                                    : "sidebar-item"
                            }
                            onClick={() =>
                                setActiveMenu("history")
                            }
                        >

                            <History size={18} />

                            History

                        </button>


                        <button
                            className={
                                activeMenu === "profile"
                                    ? "sidebar-item active"
                                    : "sidebar-item"
                            }
                            onClick={() =>
                                setActiveMenu("profile")
                            }
                        >

                            <Settings size={18} />

                            Profile

                        </button>

                    </div>


                    <div className="sidebar-bottom">

                        <button
                            className="sidebar-item logout-item"
                            onClick={handleLogout}
                        >

                            <LogOut size={18} />

                            Logout

                        </button>

                    </div>

                </aside>


                {/* MAIN CONTENT */}

                <main className="dashboard-main">

                    <div className="dashboard-heading">

                        <div>

                            <p className="dashboard-greeting">
                                Hello, {profile.name || profile.full_name || "User"}
                            </p>

                            <h2>{activeMenu === "chat" ? "How can I help you today?" : activeMenu === "reports" ? "Your health reports" : activeMenu === "history" ? "Your conversations" : "Your account"}</h2>

                            {activeMenu === "chat" && <p className="dashboard-subtitle">
                                Ask a healthcare question or use
                                your voice to get simple health
                                information.
                            </p>}

                        </div>


                        {activeMenu === "chat" && <div className="health-status">

                            <span></span>

                            Assistant ready

                        </div>}

                    </div>


                    {activeMenu === "chat" && <>

                    <section className="dashboard-chat">

                        <div className="dashboard-chat-header">

                            <div>

                                <strong>
                                    HealthSaathi AI
                                </strong>

                                <span>
                                    Multilingual healthcare information
                                </span>

                            </div>

                        </div>


                        {/* MESSAGES */}

                        <div className="messages">

                            {messages.map(
                                (message, index) => (

                                <div
                                    key={index}
                                    className="message-wrapper"
                                >

                                    <ChatMessage
                                        message={message}
                                    />


                                    {message.role ===
                                        "assistant" &&
                                        index > 0 && (

                                        <button
                                            className="speak-answer"
                                            onClick={() =>
                                                speakAnswer(
                                                    message.content
                                                )
                                            }
                                        >

                                            <Volume2
                                                size={15}
                                            />

                                            Listen

                                        </button>

                                    )}

                                </div>

                            ))}


                            {loading && (

                                <div className="typing">

                                    ArogyaVani is thinking...

                                </div>

                            )}

                        </div>


                        {/* REPORT TOOL */}

                        <div className="tools">

                            <ReportUpload
                                onExtracted={handleReportExtracted}
                            />


                            <span>
                                Upload a report or ask using your voice
                            </span>

                        </div>


                        {/* CHAT INPUT */}

                        <ChatInput
                            value={input}
                            setValue={setInput}
                            onSend={sendMessage}
                            onVoice={startRecording}
                            recording={recording}
                            disabled={loading}
                        />

                    </section>
                    </>}

                    {activeMenu === "reports" && <section className="dashboard-view">
                        <div className="view-heading">
                            <div><h2>Reports</h2><p>Upload a report to extract its text and ask ArogyaVani to explain it.</p></div>
                            <ReportUpload onExtracted={handleReportExtracted} />
                        </div>
                        <div className="view-list">
                            {reports.length === 0 ? <p className="empty-state">Your processed reports will appear here.</p> : reports.map(report => <article className="view-list-item" key={report.id}>
                                <div className="report-file-icon"><FileText size={20} /></div>
                                <div className="view-item-copy"><strong>{report.name || "Medical report"}</strong><span>{new Date(report.createdAt).toLocaleString()}</span></div>
                                <button className="view-action" onClick={() => { handleReportText(report.extractedText); setActiveMenu("chat"); }}>Explain in chat</button>
                            </article>)}
                        </div>
                    </section>}

                    {activeMenu === "history" && <section className="dashboard-view">
                        <div className="view-heading"><div><h2>Chat history</h2><p>Reopen a previous conversation from this browser.</p></div></div>
                        <div className="view-list">
                            {sessions.length === 0 ? <p className="empty-state">Your conversations will appear here after you send a message.</p> : sessions.map(session => <button className="view-list-item history-item" key={session.id} onClick={() => openSession(session)}>
                                <div className="report-file-icon"><MessageCircle size={20} /></div>
                                <div className="view-item-copy"><strong>{session.title}</strong><span>{new Date(session.updatedAt).toLocaleString()} · {Math.max(0, session.messages.length - 1)} messages</span></div>
                                <ArrowLeft className="history-open-icon" size={18} />
                            </button>)}
                        </div>
                    </section>}

                    {activeMenu === "profile" && <section className="dashboard-view profile-view">
                        <div className="view-heading"><div><h2>Your profile</h2><p>Account details associated with your ArogyaVani sign in.</p></div></div>
                        <div className="profile-card">
                            <div className="profile-large-avatar">{(profile.name || profile.full_name || "U").charAt(0).toUpperCase()}</div>
                            <div className="profile-details">
                                <div><span>Name</span><strong>{profile.name || profile.full_name || "User"}</strong></div>
                                <div><span>Email</span><strong>{profile.email || "Not available"}</strong></div>
                                <div><span>Preferred language</span><strong>{language === "hi" ? "Hindi" : language === "mr" ? "Marathi" : "English"}</strong></div>
                            </div>
                            <button className="view-action profile-logout" onClick={handleLogout}><LogOut size={16} /> Log out</button>
                        </div>
                    </section>}

                </main>

            </div>

        </div>
    );
}


export default App;
