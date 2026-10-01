import React from "react";

import {
    ArrowRight,
    HeartPulse,
    Mic,
    FileText,
    Globe2,
    ShieldCheck
} from "lucide-react";

import {
    Link
} from "react-router-dom";

import "./pages.css";


export default function LandingPage() {

    return (
        <div className="landing-page">

            {/* Navbar */}

            <nav className="landing-navbar">

                <Link
                    to="/"
                    className="landing-brand"
                >

                    <div className="landing-brand-icon">
                        <HeartPulse size={22} />
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


                <div className="landing-nav-links">

                    <a href="#features">
                        Features
                    </a>

                    <a href="#how-it-works">
                        How it works
                    </a>

                    <Link
                        to="/login"
                        className="nav-login"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="nav-register"
                    >
                        Create Account
                    </Link>

                </div>

            </nav>


            {/* Hero */}

            <main>

                <section className="hero-section">

                    <div className="hero-content">

                        <div className="hero-badge">

                            <span className="badge-dot"></span>

                            Multilingual Healthcare Assistant

                        </div>


                        <h1>
                            Healthcare information,
                            <br />

                            <span>
                                in your language.
                            </span>
                        </h1>


                        <p className="hero-description">

                            ArogyaVani helps you understand
                            healthcare information in simple
                            English, Hindi and Marathi — using
                            text, voice and medical report assistance.

                        </p>


                        <div className="hero-buttons">

                            <Link
                                to="/register"
                                className="primary-cta"
                            >

                                Create Account

                                <ArrowRight size={18} />

                            </Link>


                            <Link
                                to="/login"
                                className="secondary-cta"
                            >
                                Login
                            </Link>

                        </div>


                        <div className="language-note">

                            <Globe2 size={16} />

                            English • हिन्दी • मराठी

                        </div>

                    </div>


                    {/* Hero visual */}

                    <div className="hero-visual">

                        <div className="medical-card">

                            <div className="medical-card-top">

                                <div className="small-icon">
                                    <HeartPulse size={18} />
                                </div>

                                <div>
                                    <strong>
                                        HealthSaathi AI
                                    </strong>

                                    <span>
                                        Healthcare assistant
                                    </span>
                                </div>

                                <span className="online-dot">
                                    ●
                                </span>

                            </div>


                            <div className="report-preview">

                                <div className="report-header">

                                    <FileText size={18} />

                                    <span>
                                        Health information
                                    </span>

                                    <small>
                                        Ready
                                    </small>

                                </div>


                                <div className="report-line large"></div>

                                <div className="report-line"></div>

                                <div className="report-line short"></div>

                            </div>


                            <div className="ai-message">

                                <div className="ai-avatar">
                                    <HeartPulse size={15} />
                                </div>

                                <div>

                                    <span>
                                        HealthSaathi AI
                                    </span>

                                    <p>
                                        How can I help you
                                        understand your health
                                        information?
                                    </p>

                                </div>

                            </div>


                            <div className="voice-preview">

                                <div className="voice-icon">
                                    <Mic size={17} />
                                </div>

                                <div className="voice-bars">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>

                                <small>
                                    Voice enabled
                                </small>

                            </div>

                        </div>

                    </div>

                </section>


                {/* Features */}

                <section
                    className="features-section"
                    id="features"
                >

                    <div className="section-heading">

                        <span>
                            WHY AROGYAVANI
                        </span>

                        <h2>
                            Healthcare made easier to understand.
                        </h2>

                        <p>
                            Designed to make healthcare information
                            more accessible, understandable and
                            language-friendly.
                        </p>

                    </div>


                    <div className="feature-grid">

                        <div className="feature-card">

                            <div className="feature-icon">
                                <Globe2 />
                            </div>

                            <h3>
                                Multilingual
                            </h3>

                            <p>
                                Ask and understand healthcare
                                information in English, Hindi
                                or Marathi.
                            </p>

                        </div>


                        <div className="feature-card">

                            <div className="feature-icon">
                                <Mic />
                            </div>

                            <h3>
                                Voice-first
                            </h3>

                            <p>
                                Ask questions using your voice
                                instead of typing everything.
                            </p>

                        </div>


                        <div className="feature-card">

                            <div className="feature-icon">
                                <FileText />
                            </div>

                            <h3>
                                Report assistance
                            </h3>

                            <p>
                                Upload a medical report and get
                                its information explained simply.
                            </p>

                        </div>


                        <div className="feature-card">

                            <div className="feature-icon">
                                <ShieldCheck />
                            </div>

                            <h3>
                                Safety-focused
                            </h3>

                            <p>
                                Provides general health information
                                without replacing professional care.
                            </p>

                        </div>

                    </div>

                </section>


                {/* How it works */}

                <section
                    className="how-section"
                    id="how-it-works"
                >

                    <div className="section-heading">

                        <span>
                            HOW IT WORKS
                        </span>

                        <h2>
                            Simple steps to get started.
                        </h2>

                    </div>


                    <div className="steps">

                        <div className="step">

                            <div className="step-number">
                                01
                            </div>

                            <h3>
                                Create your account
                            </h3>

                            <p>
                                Sign up to access your personal
                                healthcare assistant.
                            </p>

                        </div>


                        <div className="step">

                            <div className="step-number">
                                02
                            </div>

                            <h3>
                                Ask your question
                            </h3>

                            <p>
                                Type your question or use your
                                voice to ask.
                            </p>

                        </div>


                        <div className="step">

                            <div className="step-number">
                                03
                            </div>

                            <h3>
                                Understand your information
                            </h3>

                            <p>
                                Receive simple healthcare information
                                in your selected language.
                            </p>

                        </div>

                    </div>

                </section>


                {/* Footer */}

                <footer className="landing-footer">

                    <div>

                        <strong>
                            ArogyaVani
                        </strong>

                        <span>
                            Multilingual Healthcare Assistant
                        </span>

                    </div>

                    <p>
                        Healthcare information made easier to understand.
                    </p>

                </footer>

            </main>

        </div>
    );
}