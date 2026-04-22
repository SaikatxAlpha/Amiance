import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error | invalid
    const [message, setMessage] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!token) setStatus("invalid");
    }, [token]);

    const strength = (() => {
        if (!password) return 0;
        let s = 0;
        if (password.length >= 6) s++;
        if (password.length >= 9) s++;
        if (/[A-Z]/.test(password) && /[0-9]/.test(password)) s++;
        if (/[^A-Za-z0-9]/.test(password)) s++;
        return s;
    })();

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthColor = ["", "#bc4749", "#fbbf24", "#6a994e", "#a7c957"][strength];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || password.length < 6) {
            setMessage("Password must be at least 6 characters.");
            setStatus("error");
            return;
        }
        if (password !== confirm) {
            setMessage("Passwords do not match.");
            setStatus("error");
            return;
        }
        setStatus("loading");
        setMessage("");
        try {
            const data = await authAPI.resetPassword(token, password);
            if (data.token) {
                localStorage.setItem("amiance_token", data.token);
            }
            setStatus("success");
            setTimeout(() => navigate("/"), 3000);
        } catch (err) {
            setStatus("error");
            setMessage(
                err.message?.includes("expired") || err.message?.includes("invalid")
                    ? "This reset link has expired or is invalid. Please request a new one."
                    : err.message || "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div className="rp-page">
            {/* ── Left brand panel ── */}
            <div className="rp-brand">
                <div className="rp-brand-inner">
                    <Link to="/" className="rp-logo">AMIANCE</Link>
                    <div className="rp-brand-body">
                        <h2 className="rp-brand-title">
                            <span className="rp-title-outline">New</span>
                            <span className="rp-title-solid">Password.</span>
                        </h2>
                        <p className="rp-brand-sub">
                            Choose something memorable. Make it strong.
                            Your account will be secured instantly.
                        </p>
                        <div className="rp-tips">
                            {[
                                "At least 6 characters",
                                "Mix uppercase & lowercase",
                                "Add numbers for strength",
                                "Special characters boost security",
                            ].map((tip) => (
                                <div key={tip} className="rp-tip">
                                    <span className="rp-tip-dot">✦</span>
                                    <span>{tip}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rp-brand-footer">
                        <span>SS 2026</span>
                        <span className="rp-dot" />
                        <span>Secure Reset</span>
                        <span className="rp-dot" />
                        <span>AMIANCE</span>
                    </div>
                </div>
                <div className="rp-grid-deco" aria-hidden="true">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="rp-grid-col" />
                    ))}
                </div>
                <span className="rp-watermark">RESET</span>
            </div>

            {/* ── Right form panel ── */}
            <div className="rp-form-wrap">
                <div className="rp-form-inner">
                    {status === "success" ? (
                        <div className="rp-success">
                            <span className="rp-success-icon">✦</span>
                            <p className="rp-eyebrow">Password Updated</p>
                            <h1 className="rp-heading">You're back in.</h1>
                            <p className="rp-success-desc">
                                Your password has been reset successfully.
                                Redirecting you to the home page in 3 seconds…
                            </p>
                            <Link to="/">
                                <button className="rp-submit" style={{ width: "100%", justifyContent: "center" }}>
                                    <span>Go to Home</span>
                                    <span className="rp-arrow">→</span>
                                </button>
                            </Link>
                        </div>
                    ) : status === "invalid" ? (
                        <div className="rp-success">
                            <span style={{ fontSize: "48px", marginBottom: "16px", display: "block" }}>⚠</span>
                            <p className="rp-eyebrow" style={{ color: "var(--red)" }}>Invalid Link</p>
                            <h1 className="rp-heading">Link Not Found.</h1>
                            <p className="rp-success-desc">
                                This reset link is invalid or missing. Please request a new one.
                            </p>
                            <Link to="/forgot-password">
                                <button className="rp-submit" style={{ width: "100%", justifyContent: "center" }}>
                                    <span>Request New Link</span>
                                    <span className="rp-arrow">→</span>
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="rp-form-top">
                                <p className="rp-eyebrow">Account Recovery</p>
                                <h1 className="rp-heading">Reset Password</h1>
                                <p className="rp-sub">
                                    Remembered it?{" "}
                                    <Link to="/login" className="rp-switch-link">
                                        Sign in →
                                    </Link>
                                </p>
                            </div>

                            <form className="rp-form" onSubmit={handleSubmit}>
                                {/* New Password */}
                                <div className="rp-field">
                                    <label className="rp-label">New Password</label>
                                    <div className="rp-input-wrap">
                                        <input
                                            className="rp-input"
                                            type={showPass ? "text" : "password"}
                                            placeholder="Min. 6 characters"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setStatus("idle");
                                                setMessage("");
                                            }}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            className="rp-eye"
                                            onClick={() => setShowPass((v) => !v)}
                                        >
                                            {showPass ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    {/* Strength meter */}
                                    {password && (
                                        <div className="rp-strength">
                                            <div className="rp-strength-bar">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div
                                                        key={i}
                                                        className="rp-strength-seg"
                                                        style={{
                                                            background:
                                                                i <= strength
                                                                    ? strengthColor
                                                                    : "rgba(167,201,87,0.1)",
                                                            transition: "background 0.3s ease",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <span
                                                className="rp-strength-label"
                                                style={{ color: strengthColor }}
                                            >
                                                {strengthLabel}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="rp-field">
                                    <label className="rp-label">Confirm Password</label>
                                    <div className="rp-input-wrap">
                                        <input
                                            className="rp-input"
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="Repeat your new password"
                                            value={confirm}
                                            onChange={(e) => {
                                                setConfirm(e.target.value);
                                                setStatus("idle");
                                                setMessage("");
                                            }}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            className="rp-eye"
                                            onClick={() => setShowConfirm((v) => !v)}
                                        >
                                            {showConfirm ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    {confirm && password && confirm !== password && (
                                        <p className="rp-mismatch">Passwords don't match</p>
                                    )}
                                    {confirm && password && confirm === password && (
                                        <p className="rp-match">✓ Passwords match</p>
                                    )}
                                </div>

                                {status === "error" && message && (
                                    <div className="rp-error-box">
                                        <span>⚠</span>
                                        <span>{message}</span>
                                        {message.includes("expired") && (
                                            <Link
                                                to="/forgot-password"
                                                className="rp-switch-link"
                                                style={{ marginTop: "8px", display: "block" }}
                                            >
                                                Request a new link →
                                            </Link>
                                        )}
                                    </div>
                                )}

                                <button
                                    className="rp-submit"
                                    type="submit"
                                    disabled={status === "loading"}
                                >
                                    <span>
                                        {status === "loading"
                                            ? "Resetting Password..."
                                            : "Set New Password"}
                                    </span>
                                    {status !== "loading" && (
                                        <span className="rp-arrow">→</span>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                .rp-page {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    background: var(--dark);
                }

                /* ── Brand panel ── */
                .rp-brand {
                    position: relative;
                    background: var(--dark2);
                    border-right: 1px solid rgba(167,201,87,0.08);
                    overflow: hidden;
                    display: flex;
                    align-items: stretch;
                }
                .rp-brand-inner {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 48px 56px 52px;
                    width: 100%;
                }
                .rp-logo {
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
                .rp-brand-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 60px 0;
                }
                .rp-brand-title {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    margin-bottom: 28px;
                }
                .rp-title-outline {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(60px, 7vw, 100px);
                    line-height: .88;
                    color: transparent;
                    -webkit-text-stroke: 1.5px rgba(242,232,207,0.15);
                    letter-spacing: .04em;
                }
                .rp-title-solid {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(60px, 7vw, 100px);
                    line-height: .88;
                    background: linear-gradient(135deg, var(--cream) 0%, var(--g4) 40%, var(--g3) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: .04em;
                }
                .rp-brand-sub {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 14px;
                    font-weight: 300;
                    line-height: 1.9;
                    color: rgba(242,232,207,0.35);
                    margin-bottom: 32px;
                }
                .rp-tips {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .rp-tip {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 12px;
                    color: rgba(242,232,207,0.4);
                }
                .rp-tip-dot {
                    color: var(--g3);
                    font-size: 10px;
                    flex-shrink: 0;
                }
                .rp-brand-footer {
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
                .rp-dot {
                    width: 3px;
                    height: 3px;
                    border-radius: 50%;
                    background: rgba(167,201,87,0.3);
                }
                .rp-grid-deco {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    justify-content: space-between;
                    pointer-events: none;
                    z-index: 0;
                }
                .rp-grid-col {
                    width: 1px;
                    height: 100%;
                    background: linear-gradient(to bottom, transparent, rgba(167,201,87,0.05), transparent);
                }
                .rp-watermark {
                    position: absolute;
                    bottom: -20px;
                    right: -16px;
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
                .rp-form-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 60px;
                    background: var(--dark);
                }
                .rp-form-inner {
                    width: 100%;
                    max-width: 400px;
                    animation: fadeSlideUp 0.6s ease both;
                }
                .rp-form-top { margin-bottom: 44px; }
                .rp-eyebrow {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.28em;
                    text-transform: uppercase;
                    color: var(--g3);
                    margin-bottom: 16px;
                }
                .rp-heading {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 58px;
                    line-height: .9;
                    color: var(--cream);
                    margin-bottom: 14px;
                }
                .rp-sub {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 13px;
                    font-weight: 300;
                    color: rgba(242,232,207,0.35);
                }
                .rp-switch-link {
                    color: var(--g3);
                    text-decoration: none;
                    font-weight: 500;
                    cursor: none;
                    transition: color 0.2s ease;
                }
                .rp-switch-link:hover { color: var(--g4); }

                .rp-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .rp-field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .rp-label {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(242,232,207,0.3);
                }
                .rp-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .rp-input {
                    background: var(--dark2);
                    border: 1px solid rgba(167,201,87,0.12);
                    padding: 16px 60px 16px 20px;
                    color: var(--cream);
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 14px;
                    font-weight: 300;
                    outline: none;
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                    border-radius: 0;
                    width: 100%;
                }
                .rp-input::placeholder { color: rgba(242,232,207,0.2); }
                .rp-input:focus {
                    border-color: rgba(167,201,87,0.4);
                    box-shadow: 0 0 0 3px rgba(167,201,87,0.05);
                }
                .rp-eye {
                    position: absolute;
                    right: 16px;
                    background: none;
                    border: none;
                    color: rgba(242,232,207,0.3);
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    cursor: none;
                    transition: color 0.2s ease;
                    padding: 0;
                }
                .rp-eye:hover { color: var(--g3); }

                /* Strength */
                .rp-strength {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .rp-strength-bar {
                    display: flex;
                    gap: 4px;
                    flex: 1;
                }
                .rp-strength-seg {
                    flex: 1;
                    height: 3px;
                    border-radius: 2px;
                }
                .rp-strength-label {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    min-width: 40px;
                    text-align: right;
                }
                .rp-mismatch {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 10px;
                    color: var(--red);
                    letter-spacing: 0.06em;
                }
                .rp-match {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 10px;
                    color: var(--g3);
                    letter-spacing: 0.06em;
                }
                .rp-error-box {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 11px;
                    color: var(--red);
                    letter-spacing: 0.06em;
                    padding: 14px 18px;
                    border: 1px solid rgba(188,71,73,0.2);
                    background: rgba(188,71,73,0.05);
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .rp-submit {
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
                    transition: background 0.3s ease, transform 0.3s ease;
                    margin-top: 8px;
                    position: relative;
                    overflow: hidden;
                }
                .rp-submit::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: var(--cream);
                    transform: translateX(-105%);
                    transition: transform 0.4s var(--ease-out);
                }
                .rp-submit:hover:not(:disabled) { transform: translateY(-2px); }
                .rp-submit:hover:not(:disabled)::before { transform: translateX(0); }
                .rp-submit span { position: relative; z-index: 1; }
                .rp-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
                .rp-arrow { font-size: 18px; }

                /* Success state */
                .rp-success {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 16px;
                    animation: fadeSlideUp 0.6s ease both;
                }
                .rp-success-icon {
                    font-size: 48px;
                    color: var(--g3);
                    display: block;
                }
                .rp-success-desc {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 14px;
                    font-weight: 300;
                    line-height: 1.9;
                    color: rgba(242,232,207,0.45);
                }

                @media (max-width: 768px) {
                    .rp-page { grid-template-columns: 1fr; }
                    .rp-brand { display: none; }
                    .rp-form-wrap { padding: 100px 24px 60px; }
                }
            `}</style>
        </div>
    );
}

export default ResetPassword;