import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { setError("All fields required."); return; }
        setError(""); setLoading(true);
        setTimeout(() => {
            const user = login(email, password);
            setLoading(false);
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        }, 800);
    };

    const handleAdminQuickAccess = () => {
        setEmail("admin@amiance.co");
        setPassword("admin123");
    };

    return (
        <div className="auth-page">
            {/* Left — brand panel */}
            <div className="auth-brand">
                <div className="auth-brand-inner">
                    <Link to="/" className="auth-logo">AMIANCE</Link>
                    <div className="auth-brand-body">
                        <h2 className="auth-brand-title">
                            <span className="auth-brand-outline">Welcome</span>
                            <span className="auth-brand-solid">Back.</span>
                        </h2>
                        <p className="auth-brand-sub">
                            The collection waits for no one.<br />
                            Sign in and claim your drop.
                        </p>
                    </div>
                    <div className="auth-brand-footer">
                        <span>SS 2026</span>
                        <span className="auth-brand-dot" />
                        <span>Limited Drops</span>
                        <span className="auth-brand-dot" />
                        <span>Organic Cotton</span>
                    </div>
                </div>

                {/* Decorative grid */}
                <div className="auth-grid-deco" aria-hidden="true">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="auth-grid-col" />
                    ))}
                </div>

                {/* Corner watermark */}
                <span className="auth-watermark">AMIANCE</span>
            </div>

            {/* Right — form */}
            <div className="auth-form-wrap">
                <div className="auth-form-inner">
                    <div className="auth-form-top">
                        <p className="auth-eyebrow">Member Access</p>
                        <h1 className="auth-heading">Sign In</h1>
                        <p className="auth-sub-text">
                            Don't have an account?{" "}
                            <Link to="/signup" className="auth-switch-link">Create one →</Link>
                        </p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label className="auth-label">Email Address</label>
                            <input
                                className="auth-input"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="auth-field">
                            <div className="auth-label-row">
                                <label className="auth-label">Password</label>
                                <a href="#" className="auth-forgot">Forgot password?</a>
                            </div>
                            <input
                                className="auth-input"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="auth-error">{error}</p>}

                        <button className="auth-submit" type="submit" disabled={loading}>
                            <span>{loading ? "Signing in..." : "Sign In"}</span>
                            {!loading && <span className="auth-submit-arrow">→</span>}
                        </button>

                        <div className="auth-divider">
                            <span className="auth-divider-line" />
                            <span className="auth-divider-text">or continue with</span>
                            <span className="auth-divider-line" />
                        </div>

                        <div className="auth-socials">
                            <button type="button" className="auth-social-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button type="button" className="auth-social-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                                GitHub
                            </button>
                        </div>

                        {/* Dev shortcut */}
                        <div style={{ borderTop: "1px solid rgba(167,201,87,0.12)", paddingTop: "20px", marginTop: "4px" }}>
                            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(167,201,87,0.4)", marginBottom: "12px" }}>
                                Dev Access
                            </p>
                            <button
                                type="button"
                                className="auth-social-btn"
                                style={{ width: "100%", borderColor: "rgba(167,201,87,0.3)", color: "rgba(167,201,87,0.8)", gap: "8px" }}
                                onClick={handleAdminQuickAccess}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                                Enter as Admin
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                .auth-page {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    background: var(--dark);
                }

                /* ── Brand panel ── */
                .auth-brand {
                    position: relative;
                    background: var(--dark2);
                    border-right: 1px solid rgba(167,201,87,0.08);
                    overflow: hidden;
                    display: flex;
                    align-items: stretch;
                }
                .auth-brand-inner {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 48px 56px 52px;
                    width: 100%;
                }
                .auth-logo {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 24px;
                    letter-spacing: 0.22em;
                    background: linear-gradient(135deg, var(--g3) 0%, var(--cream) 60%, var(--g3) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-decoration: none;
                    cursor: none;
                }
                .auth-brand-body { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 60px 0; }
                .auth-brand-title { display: flex; flex-direction: column; gap: 0; margin-bottom: 28px; }
                .auth-brand-outline {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(60px, 7vw, 100px);
                    line-height: .88;
                    color: transparent;
                    -webkit-text-stroke: 1.5px rgba(242,232,207,0.15);
                    letter-spacing: .04em;
                }
                .auth-brand-solid {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(60px, 7vw, 100px);
                    line-height: .88;
                    background: linear-gradient(135deg, var(--cream) 0%, var(--g4) 40%, var(--g3) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: .04em;
                }
                .auth-brand-sub {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 14px;
                    font-weight: 300;
                    line-height: 1.9;
                    color: rgba(242,232,207,0.35);
                }
                .auth-brand-footer {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 9px;
                    font-weight: 600;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(167,201,87,0.35);
                }
                .auth-brand-dot {
                    width: 3px; height: 3px; border-radius: 50%; background: rgba(167,201,87,0.3);
                }
                .auth-grid-deco {
                    position: absolute; inset: 0;
                    display: flex; justify-content: space-between;
                    pointer-events: none; z-index: 0;
                }
                .auth-grid-col {
                    width: 1px;
                    height: 100%;
                    background: linear-gradient(to bottom, transparent, rgba(167,201,87,0.05), transparent);
                }
                .auth-watermark {
                    position: absolute;
                    bottom: -20px; right: -16px;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(80px, 12vw, 160px);
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(167,201,87,0.04);
                    pointer-events: none;
                    user-select: none;
                    z-index: 1;
                    letter-spacing: -0.02em;
                }

                /* ── Form panel ── */
                .auth-form-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 60px;
                    background: var(--dark);
                }
                .auth-form-inner {
                    width: 100%;
                    max-width: 400px;
                    animation: fadeSlideUp .6s ease both;
                }
                .auth-form-top { margin-bottom: 44px; }
                .auth-eyebrow {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.28em;
                    text-transform: uppercase;
                    color: var(--g3);
                    margin-bottom: 16px;
                }
                .auth-heading {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 58px;
                    line-height: .9;
                    color: var(--cream);
                    margin-bottom: 14px;
                }
                .auth-sub-text {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 13px;
                    font-weight: 300;
                    color: rgba(242,232,207,0.35);
                }
                .auth-switch-link {
                    color: var(--g3);
                    text-decoration: none;
                    font-weight: 500;
                    cursor: none;
                    transition: color .2s ease;
                }
                .auth-switch-link:hover { color: var(--g4); }

                .auth-form { display: flex; flex-direction: column; gap: 20px; }
                .auth-field { display: flex; flex-direction: column; gap: 8px; }
                .auth-label {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(242,232,207,0.3);
                }
                .auth-label-row { display: flex; justify-content: space-between; align-items: center; }
                .auth-forgot {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 9px;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    color: rgba(167,201,87,0.4);
                    text-decoration: none;
                    cursor: none;
                    transition: color .2s ease;
                }
                .auth-forgot:hover { color: var(--g3); }
                .auth-input {
                    background: var(--dark2);
                    border: 1px solid rgba(167,201,87,0.12);
                    padding: 16px 20px;
                    color: var(--cream);
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 14px;
                    font-weight: 300;
                    outline: none;
                    transition: border-color .3s ease, box-shadow .3s ease;
                    border-radius: 0;
                }
                .auth-input::placeholder { color: rgba(242,232,207,0.2); }
                .auth-input:focus {
                    border-color: rgba(167,201,87,0.4);
                    box-shadow: 0 0 0 3px rgba(167,201,87,0.05);
                }
                .auth-error {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 11px;
                    color: var(--red);
                    letter-spacing: 0.06em;
                    padding: 10px 16px;
                    border: 1px solid rgba(188,71,73,0.2);
                    background: rgba(188,71,73,0.05);
                }
                .auth-submit {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    padding: 18px 24px;
                    background: var(--g3);
                    border: none;
                    color: var(--dark);
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    cursor: none;
                    position: relative;
                    overflow: hidden;
                    transition: background .3s ease, transform .3s ease;
                    margin-top: 4px;
                }
                .auth-submit:hover { background: var(--g4); transform: translateY(-2px); }
                .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
                .auth-submit-arrow { font-size: 18px; }
                .auth-divider {
                    display: flex; align-items: center; gap: 16px;
                }
                .auth-divider-line { flex: 1; height: 1px; background: rgba(167,201,87,0.08); }
                .auth-divider-text {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 9px; font-weight: 600;
                    letter-spacing: 0.16em; text-transform: uppercase;
                    color: rgba(242,232,207,0.2); white-space: nowrap;
                }
                .auth-socials { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .auth-social-btn {
                    display: flex; align-items: center; justify-content: center;
                    gap: 10px; padding: 14px;
                    border: 1px solid rgba(167,201,87,0.12);
                    background: var(--dark2);
                    color: rgba(242,232,207,0.5);
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 11px; font-weight: 600;
                    letter-spacing: 0.1em;
                    cursor: none;
                    transition: border-color .3s ease, color .3s ease, background .3s ease;
                }
                .auth-social-btn:hover {
                    border-color: rgba(167,201,87,0.3);
                    color: var(--cream);
                    background: var(--dark3);
                }

                @media (max-width: 768px) {
                    .auth-page { grid-template-columns: 1fr; }
                    .auth-brand { display: none; }
                    .auth-form-wrap { padding: 100px 24px 60px; }
                }
            `}</style>
        </div>
    );
}

export default Login;