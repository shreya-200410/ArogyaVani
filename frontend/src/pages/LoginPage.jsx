import React, {
    useState
} from "react";

import {
    HeartPulse,
    ArrowLeft,
    Mail,
    Lock
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { loginUser } from "../api";

import "./pages.css";


export default function LoginPage() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");


    async function handleSubmit(event) {

    event.preventDefault();


    try {

        const result =
            await loginUser({
                email,
                password
            });


        localStorage.setItem(
            "token",
            result.token
        );


        localStorage.setItem(
            "user",
            JSON.stringify(result.user)
        );


        navigate("/assistant");

    } catch (error) {

        alert(
            error.message
        );

    }

}


    return (
        <div className="auth-page">

            <div className="auth-container">

                {/* Left information panel */}

                <div className="auth-info">

                    <Link
                        to="/"
                        className="auth-brand"
                    >

                        <div className="auth-brand-icon">
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


                    <div className="auth-info-content">

                        <div className="hero-badge">
                            <span className="badge-dot"></span>
                            Welcome back
                        </div>


                        <h1>
                            Healthcare information,
                            <br />
                            <span>
                                in your language.
                            </span>
                        </h1>


                        <p>
                            Continue using HealthSaathi AI to
                            ask healthcare questions, use voice
                            input and understand medical reports.
                        </p>


                        <div className="auth-language">
                            English • हिन्दी • मराठी
                        </div>

                    </div>

                </div>


                {/* Login form */}

                <div className="auth-form-area">

                    <Link
                        to="/"
                        className="back-home"
                    >
                        <ArrowLeft size={16} />
                        Back to home
                    </Link>


                    <div className="auth-form-wrapper">

                        <div className="form-heading">

                            <h2>
                                Welcome back
                            </h2>

                            <p>
                                Sign in to continue to ArogyaVani.
                            </p>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                        >

                            <label>
                                Email address
                            </label>

                            <div className="input-with-icon">

                                <Mail size={18} />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="you@example.com"
                                    required
                                />

                            </div>


                            <label>
                                Password
                            </label>

                            <div className="input-with-icon">

                                <Lock size={18} />

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Enter your password"
                                    required
                                />

                            </div>


                            <div className="form-options">

                                <label className="remember-option">

                                    <input
                                        type="checkbox"
                                    />

                                    Remember me

                                </label>


                                <button
                                    type="button"
                                    className="forgot-button"
                                >
                                    Forgot password?
                                </button>

                            </div>


                            <button
                                type="submit"
                                className="auth-submit"
                            >
                                Login
                            </button>

                        </form>


                        <div className="auth-switch">

                            Don't have an account?

                            <Link to="/register">
                                Create Account
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}