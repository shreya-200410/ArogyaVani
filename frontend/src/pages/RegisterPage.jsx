import React, {
    useState
} from "react";

import {
    HeartPulse,
    ArrowLeft,
    User,
    Mail,
    Lock
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { registerUser } from "../api";

import "./pages.css";


export default function RegisterPage() {

    const navigate = useNavigate();

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");


    async function handleSubmit(event) {

    event.preventDefault();


    try {

        const result =
            await registerUser({
                name,
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
                            Join ArogyaVani
                        </div>


                        <h1>
                            Your health,
                            <br />
                            <span>
                                your language.
                            </span>
                        </h1>


                        <p>
                            Create your account and access a
                            multilingual healthcare information
                            assistant designed to make health
                            information easier to understand.
                        </p>


                        <div className="auth-language">
                            English • हिन्दी • मराठी
                        </div>

                    </div>

                </div>


                {/* Register form */}

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
                                Create your account
                            </h2>

                            <p>
                                Get started with HealthSaathi AI.
                            </p>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                        >

                            <label>
                                Full name
                            </label>

                            <div className="input-with-icon">

                                <User size={18} />

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Enter your name"
                                    required
                                />

                            </div>


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
                                    placeholder="Create a password"
                                    required
                                />

                            </div>


                            <div className="terms-text">

                                By creating an account, you agree
                                to use ArogyaVani for general
                                healthcare information.

                            </div>


                            <button
                                type="submit"
                                className="auth-submit"
                            >
                                Create Account
                            </button>

                        </form>


                        <div className="auth-switch">

                            Already have an account?

                            <Link to="/login">
                                Login
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}