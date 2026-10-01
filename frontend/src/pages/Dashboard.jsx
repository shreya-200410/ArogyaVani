import React, {
    useState
} from "react";

import {
    HeartPulse,
    MessageCircle,
    FileText,
    History,
    User,
    LogOut,
    Plus,
    Menu,
    X
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import LanguageSelector from "../components/LanguageSelector";

import Chatbot from "../Chatbot";

import "./pages.css";


export default function Dashboard() {

    const navigate = useNavigate();

    const [language, setLanguage] =
        useState("en");

    const [sidebarOpen, setSidebarOpen] =
        useState(false);


    function handleLogout() {

        navigate("/login");

    }


    return (
        <div className="dashboard">

            {/* =========================
                TOP BAR
            ========================= */}

            <header className="dashboard-header">

                <div className="dashboard-left">

                    <button
                        className="mobile-menu-button"
                        onClick={() =>
                            setSidebarOpen(!sidebarOpen)
                        }
                    >

                        {sidebarOpen
                            ? <X size={21} />
                            : <Menu size={21} />
                        }

                    </button>


                    <Link
                        to="/assistant"
                        className="dashboard-brand"
                    >

                        <div className="dashboard-brand-icon">

                            <HeartPulse size={21} />

                        </div>


                        <div>

                            <strong>
                                ArogyaVani
                            </strong>

                            <span>
                                HealthSaathi AI
                            </span>

                        </div>

                    </Link>

                </div>


                <div className="dashboard-header-right">

                    <LanguageSelector
                        language={language}
                        setLanguage={setLanguage}
                    />


                    <div className="dashboard-user">

                        <div className="user-avatar">
                            S
                        </div>

                        <div className="user-details">

                            <strong>
                                Shreya
                            </strong>

                            <span>
                                User
                            </span>

                        </div>

                    </div>

                </div>

            </header>


            {/* =========================
                DASHBOARD BODY
            ========================= */}

            <div className="dashboard-body">


                {/* =========================
                    SIDEBAR
                ========================= */}

                <aside
                    className={
                        sidebarOpen
                            ? "dashboard-sidebar open"
                            : "dashboard-sidebar"
                    }
                >

                    <button
                        className="new-chat-button"
                        onClick={() =>
                            navigate("/assistant")
                        }
                    >

                        <Plus size={18} />

                        New Chat

                    </button>


                    <nav className="dashboard-nav">

                        <button className="dashboard-nav-item active">

                            <MessageCircle size={18} />

                            <span>
                                Chat
                            </span>

                        </button>


                        <button
                            className="dashboard-nav-item"
                            onClick={() =>
                                alert(
                                    "Reports section will be available here."
                                )
                            }
                        >

                            <FileText size={18} />

                            <span>
                                Reports
                            </span>

                        </button>


                        <button
                            className="dashboard-nav-item"
                            onClick={() =>
                                alert(
                                    "Chat history will be available here."
                                )
                            }
                        >

                            <History size={18} />

                            <span>
                                History
                            </span>

                        </button>


                        <button
                            className="dashboard-nav-item"
                            onClick={() =>
                                alert(
                                    "Profile section will be available here."
                                )
                            }
                        >

                            <User size={18} />

                            <span>
                                Profile
                            </span>

                        </button>

                    </nav>


                    <div className="sidebar-bottom">

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >

                            <LogOut size={18} />

                            <span>
                                Logout
                            </span>

                        </button>

                    </div>

                </aside>


                {/* =========================
                    MAIN CHAT AREA
                ========================= */}

                <main className="dashboard-main">

                    <div className="dashboard-welcome">

                        <div>

                            <p className="welcome-small">
                                Welcome back
                            </p>

                            <h1>
                                Hello, Shreya 👋
                            </h1>

                            <p className="welcome-description">
                                How can I help you today?
                            </p>

                        </div>

                    </div>


                    <div className="dashboard-chat">

                        <Chatbot
                            language={language}
                            setLanguage={setLanguage}
                        />

                    </div>

                </main>

            </div>

        </div>
    );
}