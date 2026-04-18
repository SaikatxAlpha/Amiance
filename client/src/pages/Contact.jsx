import { useState } from "react";
import Navbar from "../components/Layout/Navbar";

const CHANNELS = [
    { icon: "✉", label: "Email", value: "hello@amiance.co", sub: "We reply within 24h" },
    { icon: "⊕", label: "Instagram", value: "@amiance.official", sub: "DMs open for styling" },
    { icon: "⊗", label: "Address", value: "12 Fabric Lane, London W1", sub: "By appointment only" },
];

function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); setSent(true); }, 1000);
    };

    return (
        <>
            <Navbar />
            <div className="ct-page">

                {/* Hero */}
                <section className="ct-hero">
                    <div className="ct-hero-bg-text" aria-hidden="true">TALK</div>
                    <div className="ct-hero-content">
                        <p className="ct-eyebrow">Get In Touch</p>
                        <h1 className="ct-title">
                            <span className="ct-title-outline">Let's</span>
                            <span className="ct-title-solid">Connect.</span>
                        </h1>
                        <p className="ct-subtitle">
                            Questions about a drop? Styling advice? Wholesale inquiry?
                            We're all ears — just not 24/7.
                        </p>
                    </div>
                </section>

                {/* Body */}
                <div className="ct-body">

                    {/* Channels */}
                    <aside className="ct-aside">
                        <p className="ct-aside-label">Reach Us</p>
                        <div className="ct-channels">
                            {CHANNELS.map(c => (
                                <div key={c.label} className="ct-channel">
                                    <span className="ct-channel-icon">{c.icon}</span>
                                    <div className="ct-channel-info">
                                        <p className="ct-channel-label">{c.label}</p>
                                        <p className="ct-channel-value">{c.value}</p>
                                        <p className="ct-channel-sub">{c.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ct-social-strip">
                            <p className="ct-aside-label" style={{ marginBottom: "16px" }}>Follow the Drop</p>
                            {["Instagram", "TikTok", "Twitter", "LinkedIn"].map(s => (
                                <a key={s} href="#" className="ct-social-link">
                                    <span>{s}</span>
                                    <span className="ct-social-arrow">→</span>
                                </a>
                            ))}
                        </div>
                    </aside>

                    {/* Form */}
                    <div className="ct-form-wrap">
                        {sent ? (
                            <div className="ct-success">
                                <span className="ct-success-icon">✦</span>
                                <h2 className="ct-success-title">Message Sent.</h2>
                                <p className="ct-success-body">
                                    We'll get back to you within 24 hours. In the meantime,
                                    explore the latest drop.
                                </p>
                                <button className="btn-primary" onClick={() => setSent(false)}>
                                    <span>Send Another</span>
                                </button>
                            </div>
                        ) : (
                            <form className="ct-form" onSubmit={handleSubmit}>
                                <p className="ct-form-label">Send a Message</p>
                                <div className="ct-form-row">
                                    <div className="ct-field">
                                        <label className="ct-field-label">Full Name</label>
                                        <input className="ct-input" name="name" type="text" placeholder="Alex Monroe"
                                            value={form.name} onChange={handleChange} required />
                                    </div>
                                    <div className="ct-field">
                                        <label className="ct-field-label">Email</label>
                                        <input className="ct-input" name="email" type="email" placeholder="you@example.com"
                                            value={form.email} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="ct-field">
                                    <label className="ct-field-label">Subject</label>
                                    <select className="ct-input ct-select" name="subject" value={form.subject} onChange={handleChange} required>
                                        <option value="">Select a topic...</option>
                                        <option>Order Inquiry</option>
                                        <option>Drop Collaboration</option>
                                        <option>Styling Question</option>
                                        <option>Wholesale / Press</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="ct-field">
                                    <label className="ct-field-label">Message</label>
                                    <textarea className="ct-input ct-textarea" name="message" placeholder="Tell us what's on your mind..."
                                        value={form.message} onChange={handleChange} rows={6} required />
                                </div>
                                <button className="ct-submit" type="submit" disabled={loading}>
                                    <span>{loading ? "Sending..." : "Send Message"}</span>
                                    {!loading && <span>→</span>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .ct-page { padding-top:72px; background:var(--dark); min-height:100vh; }

                /* Hero */
                .ct-hero { position:relative; padding:80px 60px 72px; overflow:hidden; border-bottom:1px solid rgba(167,201,87,0.08); background:var(--dark2); }
                .ct-hero::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 50% 70% at 80% 30%,rgba(56,102,65,0.15) 0%,transparent 60%); pointer-events:none; }
                .ct-hero-bg-text { position:absolute; bottom:-20px; right:-10px; font-family:'Bebas Neue',sans-serif; font-size:clamp(120px,20vw,260px); color:transparent; -webkit-text-stroke:1px rgba(167,201,87,0.05); pointer-events:none; user-select:none; line-height:1; }
                .ct-hero-content { position:relative; z-index:2; max-width:700px; animation:fadeSlideUp .6s ease both; }
                .ct-eyebrow { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:var(--g3); margin-bottom:20px; }
                .ct-title { display:flex; flex-direction:column; gap:0; margin-bottom:24px; }
                .ct-title-outline { font-family:'Bebas Neue',sans-serif; font-size:clamp(72px,10vw,140px); line-height:.88; color:transparent; -webkit-text-stroke:1.5px rgba(242,232,207,0.15); letter-spacing:.04em; }
                .ct-title-solid { font-family:'Bebas Neue',sans-serif; font-size:clamp(72px,10vw,140px); line-height:.88; background:linear-gradient(135deg,var(--cream) 0%,var(--g4) 40%,var(--g3) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:.04em; }
                .ct-subtitle { font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:300; line-height:1.9; color:rgba(242,232,207,0.4); }

                /* Body */
                .ct-body { display:grid; grid-template-columns:340px 1fr; gap:0; min-height:60vh; }

                /* Aside */
                .ct-aside { background:var(--dark2); border-right:1px solid rgba(167,201,87,0.08); padding:56px 44px; display:flex; flex-direction:column; gap:48px; }
                .ct-aside-label { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; color:rgba(167,201,87,0.4); margin-bottom:24px; }
                .ct-channels { display:flex; flex-direction:column; gap:28px; }
                .ct-channel { display:flex; gap:16px; align-items:flex-start; }
                .ct-channel-icon { font-size:20px; color:var(--g3); flex-shrink:0; margin-top:2px; }
                .ct-channel-label { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(167,201,87,0.5); margin-bottom:4px; }
                .ct-channel-value { font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; color:var(--cream); margin-bottom:3px; }
                .ct-channel-sub { font-family:'Space Grotesk',sans-serif; font-size:11px; font-weight:300; color:rgba(242,232,207,0.3); }
                .ct-social-strip { display:flex; flex-direction:column; gap:4px; }
                .ct-social-link { display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(167,201,87,0.06); font-family:'Space Grotesk',sans-serif; font-size:12px; font-weight:600; letter-spacing:0.1em; color:rgba(242,232,207,0.3); text-decoration:none; cursor:none; transition:color .3s ease; }
                .ct-social-link:hover { color:var(--g3); }
                .ct-social-arrow { font-size:14px; opacity:0; transition:opacity .3s ease,transform .3s ease; transform:translateX(-4px); }
                .ct-social-link:hover .ct-social-arrow { opacity:1; transform:translateX(0); }

                /* Form */
                .ct-form-wrap { padding:56px 60px; background:var(--dark); }
                .ct-form-label { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; color:rgba(167,201,87,0.4); margin-bottom:32px; }
                .ct-form { display:flex; flex-direction:column; gap:20px; animation:fadeSlideUp .6s ease both; }
                .ct-form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
                .ct-field { display:flex; flex-direction:column; gap:8px; }
                .ct-field-label { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(242,232,207,0.3); }
                .ct-input { background:var(--dark2); border:1px solid rgba(167,201,87,0.12); padding:16px 20px; color:var(--cream); font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:300; outline:none; transition:border-color .3s ease,box-shadow .3s ease; border-radius:0; width:100%; }
                .ct-input::placeholder { color:rgba(242,232,207,0.2); }
                .ct-input:focus { border-color:rgba(167,201,87,0.4); box-shadow:0 0 0 3px rgba(167,201,87,0.05); }
                .ct-select { appearance:none; cursor:none; }
                .ct-select option { background:var(--dark2); color:var(--cream); }
                .ct-textarea { resize:vertical; min-height:150px; }
                .ct-submit { display:flex; align-items:center; justify-content:space-between; width:fit-content; min-width:240px; padding:18px 28px; background:var(--g3); border:none; color:var(--dark); font-family:'Space Grotesk',sans-serif; font-size:12px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; cursor:none; transition:background .3s ease,transform .3s ease; }
                .ct-submit:hover { background:var(--g4); transform:translateY(-2px); }
                .ct-submit:disabled { opacity:0.6; transform:none; }
                .ct-submit span:last-child { font-size:18px; }

                /* Success */
                .ct-success { display:flex; flex-direction:column; align-items:flex-start; gap:20px; padding:20px 0; animation:fadeSlideUp .5s ease both; }
                .ct-success-icon { font-size:36px; color:var(--g3); }
                .ct-success-title { font-family:'Bebas Neue',sans-serif; font-size:56px; color:var(--cream); line-height:.9; }
                .ct-success-body { font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:300; line-height:1.9; color:rgba(242,232,207,0.45); max-width:360px; }

                @media (max-width:900px) {
                    .ct-hero,.ct-form-wrap { padding-left:24px; padding-right:24px; }
                    .ct-body { grid-template-columns:1fr; }
                    .ct-aside { border-right:none; border-bottom:1px solid rgba(167,201,87,0.08); padding:40px 24px; }
                    .ct-form-row { grid-template-columns:1fr; }
                }
            `}</style>
        </>
    );
}

export default Contact;