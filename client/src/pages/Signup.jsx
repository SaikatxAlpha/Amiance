import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) { setError("All fields required."); return; }
        if (!agreed) { setError("Please agree to terms."); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        setError(""); setLoading(true);
        try {
            const data = await signup(name, email, password);
            if (data.user?.isVerified) {
                navigate("/");
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-brand">
                    <div className="auth-brand-inner">
                        <Link to="/" className="auth-logo">AMIANCE</Link>
                        <div className="auth-brand-body" />
                        <div className="auth-brand-footer">
                            <span>SS 2026</span><span className="auth-brand-dot" />
                            <span>Limited Drops</span><span className="auth-brand-dot" />
                            <span>Organic Cotton</span>
                        </div>
                    </div>
                    <div className="auth-grid-deco" aria-hidden="true">
                        {[...Array(8)].map((_, i) => <div key={i} className="auth-grid-col" />)}
                    </div>
                    <span className="auth-watermark">AMIANCE</span>
                </div>
                <div className="auth-form-wrap">
                    <div className="auth-form-inner" style={{ textAlign: "center" }}>
                        <span style={{ fontSize: "48px", display: "block", marginBottom: "24px" }}>✉</span>
                        <p className="auth-eyebrow">Almost there</p>
                        <h1 className="auth-heading" style={{ fontSize: "48px", marginBottom: "16px" }}>
                            Check your inbox.
                        </h1>
                        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 300, lineHeight: 1.9, color: "rgba(242,232,207,0.45)", marginBottom: "32px" }}>
                            We've sent a verification link to <strong style={{ color: "var(--g3)" }}>{email}</strong>.
                            Click the link to activate your account and start shopping.
                        </p>
                        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", color: "rgba(242,232,207,0.25)", marginBottom: "24px" }}>
                            Didn't receive it? Check your spam folder or{" "}
                            <button
                                style={{ background: "none", border: "none", color: "var(--g3)", cursor: "pointer", fontSize: "11px", fontFamily: "'Space Grotesk', sans-serif", padding: 0 }}
                                onClick={async () => {
                                    try {
                                        await fetch("http://localhost:5000/api/auth/resend-verification", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ email }),
                                        });
                                        alert("Verification email resent!");
                                    } catch { alert("Failed to resend."); }
                                }}
                            >
                                resend it →
                            </button>
                        </p>
                        <Link to="/login">
                            <button className="auth-submit" style={{ width: "100%", justifyContent: "center" }}>
                                <span>Go to Login</span>
                                <span className="auth-submit-arrow">→</span>
                            </button>
                        </Link>
                    </div>
                </div>
                <style>{baseStyles}</style>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-brand">
                <div className="auth-brand-inner">
                    <Link to="/" className="auth-logo">AMIANCE</Link>
                    <div className="auth-brand-body">
                        <h2 className="auth-brand-title">
                            <span className="auth-brand-outline">Join</span>
                            <span className="auth-brand-solid">The Movement.</span>
                        </h2>
                        <p className="auth-brand-sub">
                            Exclusive drops. Curated streetwear.<br />
                            Your wardrobe, elevated forever.
                        </p>
                        <div className="signup-perks">
                            {["Early drop access", "Free returns", "Member-only pricing", "Style concierge"].map(p => (
                                <div key={p} className="signup-perk">
                                    <span className="signup-perk-icon">✦</span>
                                    <span>{p}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="auth-brand-footer">
                        <span>SS 2026</span><span className="auth-brand-dot" />
                        <span>Limited Drops</span><span className="auth-brand-dot" />
                        <span>Organic Cotton</span>
                    </div>
                </div>
                <div className="auth-grid-deco" aria-hidden="true">
                    {[...Array(8)].map((_, i) => <div key={i} className="auth-grid-col" />)}
                </div>
                <span className="auth-watermark">JOIN</span>
            </div>

            <div className="auth-form-wrap">
                <div className="auth-form-inner">
                    <div className="auth-form-top">
                        <p className="auth-eyebrow">Create Account</p>
                        <h1 className="auth-heading">Sign Up</h1>
                        <p className="auth-sub-text">
                            Already have an account?{" "}
                            <Link to="/login" className="auth-switch-link">Sign in →</Link>
                        </p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label className="auth-label">Full Name</label>
                            <input className="auth-input" type="text" placeholder="Alex Monroe"
                                value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
                        </div>
                        <div className="auth-field">
                            <label className="auth-label">Email Address</label>
                            <input className="auth-input" type="email" placeholder="you@example.com"
                                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                        </div>
                        <div className="auth-field">
                            <label className="auth-label">Password</label>
                            <input className="auth-input" type="password" placeholder="Min. 6 characters"
                                value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
                        </div>

                        <div className="signup-agree">
                            <button type="button"
                                className={`signup-checkbox ${agreed ? "signup-checkbox--on" : ""}`}
                                onClick={() => setAgreed(v => !v)}>
                                {agreed && "✓"}
                            </button>
                            <span className="signup-agree-text">
                                I agree to the{" "}
                                <a href="#" className="auth-switch-link">Terms of Service</a>
                                {" "}and{" "}
                                <a href="#" className="auth-switch-link">Privacy Policy</a>
                            </span>
                        </div>

                        {error && <p className="auth-error">{error}</p>}

                        <button className="auth-submit" type="submit" disabled={loading}>
                            <span>{loading ? "Creating account..." : "Create Account"}</span>
                            {!loading && <span className="auth-submit-arrow">→</span>}
                        </button>
                    </form>
                </div>
            </div>

            <style>{baseStyles + `
        .signup-perks { display:flex;flex-direction:column;gap:10px; }
        .signup-perk { display:flex;align-items:center;gap:12px;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:500;color:rgba(242,232,207,0.4); }
        .signup-perk-icon { color:var(--g3);font-size:10px;flex-shrink:0; }
        .signup-agree { display:flex;align-items:flex-start;gap:12px; }
        .signup-checkbox { width:20px;height:20px;flex-shrink:0;border:1px solid rgba(167,201,87,0.25);background:transparent;color:var(--g3);font-size:11px;cursor:none;display:flex;align-items:center;justify-content:center;transition:background .2s ease,border-color .2s ease; }
        .signup-checkbox--on { background:rgba(167,201,87,0.15);border-color:var(--g3); }
        .signup-agree-text { font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:300;line-height:1.6;color:rgba(242,232,207,0.3); }
      `}</style>
        </div>
    );
}

const baseStyles = `
  .auth-page { min-height:100vh;display:grid;grid-template-columns:1fr 1fr;background:var(--dark); }
  .auth-brand { position:relative;background:var(--dark2);border-right:1px solid rgba(167,201,87,0.08);overflow:hidden;display:flex;align-items:stretch; }
  .auth-brand-inner { position:relative;z-index:2;display:flex;flex-direction:column;justify-content:space-between;padding:48px 56px 52px;width:100%; }
  .auth-logo { font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:0.22em;background:linear-gradient(135deg,var(--g3) 0%,var(--cream) 60%,var(--g3) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-decoration:none;cursor:none; }
  .auth-brand-body { flex:1;display:flex;flex-direction:column;justify-content:center;padding:40px 0; }
  .auth-brand-title { display:flex;flex-direction:column;gap:0;margin-bottom:24px; }
  .auth-brand-outline { font-family:'Bebas Neue',sans-serif;font-size:clamp(60px,7vw,100px);line-height:.88;color:transparent;-webkit-text-stroke:1.5px rgba(242,232,207,0.15);letter-spacing:.04em; }
  .auth-brand-solid { font-family:'Bebas Neue',sans-serif;font-size:clamp(60px,7vw,100px);line-height:.88;background:linear-gradient(135deg,var(--cream) 0%,var(--g4) 40%,var(--g3) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:.04em; }
  .auth-brand-sub { font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:300;line-height:1.9;color:rgba(242,232,207,0.35);margin-bottom:28px; }
  .auth-brand-footer { display:flex;align-items:center;gap:12px;font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(167,201,87,0.35); }
  .auth-brand-dot { width:3px;height:3px;border-radius:50%;background:rgba(167,201,87,0.3); }
  .auth-grid-deco { position:absolute;inset:0;display:flex;justify-content:space-between;pointer-events:none;z-index:0; }
  .auth-grid-col { width:1px;height:100%;background:linear-gradient(to bottom,transparent,rgba(167,201,87,0.05),transparent); }
  .auth-watermark { position:absolute;bottom:-20px;right:-16px;font-family:'Bebas Neue',sans-serif;font-size:clamp(80px,12vw,160px);color:transparent;-webkit-text-stroke:1px rgba(167,201,87,0.04);pointer-events:none;user-select:none;z-index:1;letter-spacing:-0.02em; }
  .auth-form-wrap { display:flex;align-items:center;justify-content:center;padding:80px 60px;background:var(--dark); }
  .auth-form-inner { width:100%;max-width:400px;animation:fadeSlideUp .6s ease both; }
  .auth-form-top { margin-bottom:40px; }
  .auth-eyebrow { font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:var(--g3);margin-bottom:16px; }
  .auth-heading { font-family:'Bebas Neue',sans-serif;font-size:58px;line-height:.9;color:var(--cream);margin-bottom:14px; }
  .auth-sub-text { font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:300;color:rgba(242,232,207,0.35); }
  .auth-switch-link { color:var(--g3);text-decoration:none;font-weight:500;cursor:none;transition:color .2s ease; }
  .auth-switch-link:hover { color:var(--g4); }
  .auth-form { display:flex;flex-direction:column;gap:18px; }
  .auth-field { display:flex;flex-direction:column;gap:8px; }
  .auth-label { font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(242,232,207,0.3); }
  .auth-input { background:var(--dark2);border:1px solid rgba(167,201,87,0.12);padding:16px 20px;color:var(--cream);font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:300;outline:none;transition:border-color .3s ease,box-shadow .3s ease;border-radius:0;width:100%; }
  .auth-input::placeholder { color:rgba(242,232,207,0.2); }
  .auth-input:focus { border-color:rgba(167,201,87,0.4);box-shadow:0 0 0 3px rgba(167,201,87,0.05); }
  .auth-error { font-family:'Space Grotesk',sans-serif;font-size:11px;color:var(--red);letter-spacing:0.06em;padding:10px 16px;border:1px solid rgba(188,71,73,0.2);background:rgba(188,71,73,0.05); }
  .auth-submit { display:flex;align-items:center;justify-content:space-between;width:100%;padding:18px 24px;background:var(--g3);border:none;color:var(--dark);font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;cursor:none;transition:background .3s ease,transform .3s ease;margin-top:4px; }
  .auth-submit:hover { background:var(--g4);transform:translateY(-2px); }
  .auth-submit:disabled { opacity:0.6;cursor:not-allowed;transform:none; }
  .auth-submit-arrow { font-size:18px; }
  @media (max-width:768px) { .auth-page{grid-template-columns:1fr} .auth-brand{display:none} .auth-form-wrap{padding:100px 24px 60px} }
`;

export default Signup;