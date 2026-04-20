import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showResend, setShowResend] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { setError("All fields required."); return; }
        setError(""); setLoading(true); setShowResend(false);
        try {
            const user = await login(email, password);
            if (user.role === "admin") navigate("/admin");
            else navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || "Login failed");
            if (err.message?.toLowerCase().includes("verif")) setShowResend(true);
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            setError(data.message);
            setShowResend(false);
        } catch {
            setError("Could not resend verification email.");
        }
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
                        <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "10px" }}>
                            {["Early drop access", "Free returns on all orders", "Member-only pricing", "Exclusive SS26 pieces"].map(p => (
                                <div key={p} style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", color: "rgba(242,232,207,0.4)" }}>
                                    <span style={{ color: "var(--g3)", fontSize: "10px" }}>✦</span>
                                    <span>{p}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="auth-brand-footer">
                        <span>SS 2026</span>
                        <span className="auth-brand-dot" />
                        <span>Limited Drops</span>
                        <span className="auth-brand-dot" />
                        <span>Organic Cotton</span>
                    </div>
                </div>
                <div className="auth-grid-deco" aria-hidden="true">
                    {[...Array(8)].map((_, i) => <div key={i} className="auth-grid-col" />)}
                </div>
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
                                autoComplete="email"
                            />
                        </div>
                        <div className="auth-field">
                            <div className="auth-label-row">
                                <label className="auth-label">Password</label>
                                <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
                            </div>
                            <input
                                className="auth-input"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <div>
                                <p className="auth-error">{error}</p>
                                {showResend && email && (
                                    <button
                                        type="button"
                                        className="auth-switch-link"
                                        style={{ fontSize: "11px", marginTop: "8px", display: "block", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                        onClick={handleResendVerification}
                                    >
                                        Resend verification email →
                                    </button>
                                )}
                            </div>
                        )}

                        <button className="auth-submit" type="submit" disabled={loading}>
                            <span>{loading ? "Signing in..." : "Sign In"}</span>
                            {!loading && <span className="auth-submit-arrow">→</span>}
                        </button>

                        <div className="auth-divider">
                            <span className="auth-divider-line" />
                            <span className="auth-divider-text">or</span>
                            <span className="auth-divider-line" />
                        </div>

                        {/* Dev shortcut */}
                        <div style={{ border: "1px solid rgba(167,201,87,0.12)", padding: "18px" }}>
                            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(167,201,87,0.4)", marginBottom: "12px" }}>
                                Quick Dev Access
                            </p>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    type="button"
                                    className="auth-social-btn"
                                    style={{ flex: 1, borderColor: "rgba(167,201,87,0.3)", color: "rgba(167,201,87,0.8)" }}
                                    onClick={() => { setEmail("admin@amiance.co"); setPassword("Admin@2026"); }}
                                >
                                    Admin
                                </button>
                                <button
                                    type="button"
                                    className="auth-social-btn"
                                    style={{ flex: 1 }}
                                    onClick={() => { setEmail("user@amiance.co"); setPassword("User@2026"); }}
                                >
                                    User
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
        .auth-page { min-height:100vh;display:grid;grid-template-columns:1fr 1fr;background:var(--dark); }
        .auth-brand { position:relative;background:var(--dark2);border-right:1px solid rgba(167,201,87,0.08);overflow:hidden;display:flex;align-items:stretch; }
        .auth-brand-inner { position:relative;z-index:2;display:flex;flex-direction:column;justify-content:space-between;padding:48px 56px 52px;width:100%; }
        .auth-logo { font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:0.22em;background:linear-gradient(135deg,var(--g3) 0%,var(--cream) 60%,var(--g3) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-decoration:none;cursor:none; }
        .auth-brand-body { flex:1;display:flex;flex-direction:column;justify-content:center;padding:60px 0; }
        .auth-brand-title { display:flex;flex-direction:column;gap:0;margin-bottom:28px; }
        .auth-brand-outline { font-family:'Bebas Neue',sans-serif;font-size:clamp(60px,7vw,100px);line-height:.88;color:transparent;-webkit-text-stroke:1.5px rgba(242,232,207,0.15);letter-spacing:.04em; }
        .auth-brand-solid { font-family:'Bebas Neue',sans-serif;font-size:clamp(60px,7vw,100px);line-height:.88;background:linear-gradient(135deg,var(--cream) 0%,var(--g4) 40%,var(--g3) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:.04em; }
        .auth-brand-sub { font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:300;line-height:1.9;color:rgba(242,232,207,0.35); }
        .auth-brand-footer { display:flex;align-items:center;gap:12px;font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(167,201,87,0.35); }
        .auth-brand-dot { width:3px;height:3px;border-radius:50%;background:rgba(167,201,87,0.3); }
        .auth-grid-deco { position:absolute;inset:0;display:flex;justify-content:space-between;pointer-events:none;z-index:0; }
        .auth-grid-col { width:1px;height:100%;background:linear-gradient(to bottom,transparent,rgba(167,201,87,0.05),transparent); }
        .auth-watermark { position:absolute;bottom:-20px;right:-16px;font-family:'Bebas Neue',sans-serif;font-size:clamp(80px,12vw,160px);color:transparent;-webkit-text-stroke:1px rgba(167,201,87,0.04);pointer-events:none;user-select:none;z-index:1;letter-spacing:-0.02em; }
        .auth-form-wrap { display:flex;align-items:center;justify-content:center;padding:80px 60px;background:var(--dark); }
        .auth-form-inner { width:100%;max-width:420px;animation:fadeSlideUp .6s ease both; }
        .auth-form-top { margin-bottom:44px; }
        .auth-eyebrow { font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:var(--g3);margin-bottom:16px; }
        .auth-heading { font-family:'Bebas Neue',sans-serif;font-size:58px;line-height:.9;color:var(--cream);margin-bottom:14px; }
        .auth-sub-text { font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:300;color:rgba(242,232,207,0.35); }
        .auth-switch-link { color:var(--g3);text-decoration:none;font-weight:500;cursor:none;transition:color .2s ease; }
        .auth-switch-link:hover { color:var(--g4); }
        .auth-form { display:flex;flex-direction:column;gap:18px; }
        .auth-field { display:flex;flex-direction:column;gap:8px; }
        .auth-label { font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(242,232,207,0.3); }
        .auth-label-row { display:flex;justify-content:space-between;align-items:center; }
        .auth-forgot { font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.12em;color:rgba(167,201,87,0.4);text-decoration:none;cursor:none;transition:color .2s ease; }
        .auth-forgot:hover { color:var(--g3); }
        .auth-input { background:var(--dark2);border:1px solid rgba(167,201,87,0.12);padding:16px 20px;color:var(--cream);font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:300;outline:none;transition:border-color .3s ease,box-shadow .3s ease;border-radius:0;width:100%; }
        .auth-input::placeholder { color:rgba(242,232,207,0.2); }
        .auth-input:focus { border-color:rgba(167,201,87,0.4);box-shadow:0 0 0 3px rgba(167,201,87,0.05); }
        .auth-error { font-family:'Space Grotesk',sans-serif;font-size:11px;color:var(--red);letter-spacing:0.06em;padding:10px 16px;border:1px solid rgba(188,71,73,0.2);background:rgba(188,71,73,0.05); }
        .auth-submit { display:flex;align-items:center;justify-content:space-between;width:100%;padding:18px 24px;background:var(--g3);border:none;color:var(--dark);font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;cursor:none;transition:background .3s ease,transform .3s ease;margin-top:4px; }
        .auth-submit:hover { background:var(--g4);transform:translateY(-2px); }
        .auth-submit:disabled { opacity:0.6;cursor:not-allowed;transform:none; }
        .auth-submit-arrow { font-size:18px; }
        .auth-divider { display:flex;align-items:center;gap:16px; }
        .auth-divider-line { flex:1;height:1px;background:rgba(167,201,87,0.08); }
        .auth-divider-text { font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:rgba(242,232,207,0.2);white-space:nowrap; }
        .auth-social-btn { display:flex;align-items:center;justify-content:center;gap:10px;padding:14px;border:1px solid rgba(167,201,87,0.12);background:var(--dark2);color:rgba(242,232,207,0.5);font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.1em;cursor:none;transition:border-color .3s ease,color .3s ease,background .3s ease; }
        .auth-social-btn:hover { border-color:rgba(167,201,87,0.3);color:var(--cream);background:var(--dark3); }
        @media (max-width:768px) { .auth-page{grid-template-columns:1fr} .auth-brand{display:none} .auth-form-wrap{padding:100px 24px 60px} }
      `}</style>
        </div>
    );
}

export default Login;