import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Layout/Navbar";
import { authAPI } from "../services/api";

function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [status, setStatus] = useState("verifying"); // verifying | success | error
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verify = async () => {
            try {
                const data = await authAPI.verifyEmail(token);
                // Update token and user if new token returned
                if (data.token) {
                    localStorage.setItem("amiance_token", data.token);
                    await refreshUser();
                }
                setStatus("success");
                setMessage(data.message);
                // Redirect to home after 3s
                setTimeout(() => navigate("/"), 3000);
            } catch (err) {
                setStatus("error");
                setMessage(err.message || "Verification failed. The link may have expired.");
            }
        };
        verify();
    }, [token]);

    return (
        <>
            <Navbar />
            <div style={{
                minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                padding: "120px 24px", background: "var(--dark)",
            }}>
                <div style={{
                    maxWidth: "480px", textAlign: "center",
                    animation: "fadeSlideUp .6s ease both",
                }}>
                    {status === "verifying" && (
                        <>
                            <div style={{ fontSize: "48px", marginBottom: "24px", animation: "spin 1s linear infinite", display: "inline-block" }}>◌</div>
                            <p className="ve-eyebrow">Please wait</p>
                            <h1 className="ve-title">Verifying your email...</h1>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <span style={{ fontSize: "56px", display: "block", marginBottom: "20px", color: "var(--g3)" }}>✦</span>
                            <p className="ve-eyebrow">Account Verified</p>
                            <h1 className="ve-title">You're in.</h1>
                            <p className="ve-desc">{message}</p>
                            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", color: "rgba(242,232,207,0.25)", marginBottom: "24px" }}>
                                Redirecting you to the homepage in 3 seconds...
                            </p>
                            <Link to="/shop">
                                <button className="btn-primary"><span>Shop the Collection →</span></button>
                            </Link>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <span style={{ fontSize: "56px", display: "block", marginBottom: "20px" }}>⚠</span>
                            <p className="ve-eyebrow" style={{ color: "var(--red)" }}>Verification Failed</p>
                            <h1 className="ve-title">Link Expired.</h1>
                            <p className="ve-desc">{message}</p>
                            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                                <Link to="/login">
                                    <button className="btn-primary"><span>Back to Login</span></button>
                                </Link>
                                <Link to="/signup">
                                    <button className="btn-ghost">Create New Account <span className="arrow" /></button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style>{`
        .ve-eyebrow { font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:var(--g3);margin-bottom:16px; }
        .ve-title { font-family:'Bebas Neue',sans-serif;font-size:clamp(52px,8vw,84px);color:var(--cream);line-height:.9;margin-bottom:20px; }
        .ve-desc { font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:300;line-height:1.9;color:rgba(242,232,207,0.45);margin-bottom:28px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </>
    );
}

export default VerifyEmail;