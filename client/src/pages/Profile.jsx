import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import { useAuth } from "../context/AuthContext";

const NAV_TABS = ["Profile", "Orders", "Wishlist", "Addresses", "Security"];

function Profile() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("Profile");
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || "Alex Monroe",
        email: user?.email || "alex@example.com",
        phone: "",
        bio: "",
    });

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    return (
        <>
            <Navbar />
            <div className="pf-page">

                {/* Sidebar */}
                <aside className="pf-sidebar">
                    <div className="pf-sidebar-top">
                        <div className="pf-avatar">
                            <span>{form.name.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <div>
                            <p className="pf-username">{form.name}</p>
                            <p className="pf-useremail">{form.email}</p>
                        </div>
                    </div>

                    <nav className="pf-nav">
                        {NAV_TABS.map(tab => (
                            <button
                                key={tab}
                                className={`pf-nav-btn ${activeTab === tab ? "pf-nav-btn--active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                <span>{tab}</span>
                                {activeTab === tab && <span className="pf-nav-arrow">→</span>}
                            </button>
                        ))}
                    </nav>

                    <div className="pf-sidebar-foot">
                        <Link to="/shop" className="pf-sidebar-link">Browse Collection →</Link>
                        <button className="pf-logout" onClick={logout}>Sign Out</button>
                    </div>
                </aside>

                {/* Main */}
                <main className="pf-main">
                    {activeTab === "Profile" && (
                        <div className="pf-section">
                            <div className="pf-section-head">
                                <p className="pf-section-eyebrow">Account</p>
                                <h2 className="pf-section-title">Personal Information</h2>
                            </div>
                            <div className="pf-form-grid">
                                <div className="pf-field">
                                    <label className="pf-label">Full Name</label>
                                    <input className="pf-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="pf-field">
                                    <label className="pf-label">Email Address</label>
                                    <input className="pf-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                </div>
                                <div className="pf-field">
                                    <label className="pf-label">Phone Number</label>
                                    <input className="pf-input" type="tel" placeholder="+44 000 0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                                </div>
                                <div className="pf-field pf-field--full">
                                    <label className="pf-label">Style Bio</label>
                                    <textarea className="pf-input pf-textarea" placeholder="Tell us about your style..." rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                                </div>
                            </div>
                            <button className={`pf-save ${saved ? "pf-save--done" : ""}`} onClick={handleSave}>
                                <span>{saved ? "✓ Saved" : "Save Changes"}</span>
                            </button>
                        </div>
                    )}

                    {activeTab === "Orders" && (
                        <div className="pf-section">
                            <div className="pf-section-head">
                                <p className="pf-section-eyebrow">Purchase History</p>
                                <h2 className="pf-section-title">Your Orders</h2>
                            </div>
                            <div className="pf-redirect-card">
                                <p>View your complete order history, track shipments, and manage returns.</p>
                                <Link to="/orders"><button className="pf-save">View All Orders →</button></Link>
                            </div>
                        </div>
                    )}

                    {activeTab === "Wishlist" && (
                        <div className="pf-section">
                            <div className="pf-section-head">
                                <p className="pf-section-eyebrow">Saved Pieces</p>
                                <h2 className="pf-section-title">Your Wishlist</h2>
                            </div>
                            <div className="pf-redirect-card">
                                <p>Your saved pieces are waiting. Don't let them go to someone else.</p>
                                <Link to="/wishlist"><button className="pf-save">View Wishlist →</button></Link>
                            </div>
                        </div>
                    )}

                    {activeTab === "Addresses" && (
                        <div className="pf-section">
                            <div className="pf-section-head">
                                <p className="pf-section-eyebrow">Delivery</p>
                                <h2 className="pf-section-title">Saved Addresses</h2>
                            </div>
                            <div className="pf-address-card">
                                <div className="pf-address-tag">Default</div>
                                <p className="pf-address-name">Alex Monroe</p>
                                <p className="pf-address-line">12 Fabric Lane, Flat 3</p>
                                <p className="pf-address-line">London, W1 4AB</p>
                                <p className="pf-address-line">United Kingdom</p>
                                <button className="pf-address-edit">Edit →</button>
                            </div>
                            <button className="pf-add-address">+ Add New Address</button>
                        </div>
                    )}

                    {activeTab === "Security" && (
                        <div className="pf-section">
                            <div className="pf-section-head">
                                <p className="pf-section-eyebrow">Security</p>
                                <h2 className="pf-section-title">Password & Access</h2>
                            </div>
                            <div className="pf-form-grid">
                                <div className="pf-field">
                                    <label className="pf-label">Current Password</label>
                                    <input className="pf-input" type="password" placeholder="••••••••" />
                                </div>
                                <div className="pf-field">
                                    <label className="pf-label">New Password</label>
                                    <input className="pf-input" type="password" placeholder="Min. 8 characters" />
                                </div>
                                <div className="pf-field">
                                    <label className="pf-label">Confirm New Password</label>
                                    <input className="pf-input" type="password" placeholder="Repeat new password" />
                                </div>
                            </div>
                            <button className="pf-save">Update Password</button>
                        </div>
                    )}
                </main>
            </div>

            <style>{`
                .pf-page { display:grid; grid-template-columns:280px 1fr; min-height:100vh; padding-top:72px; background:var(--dark); }
                .pf-sidebar { background:var(--dark2); border-right:1px solid rgba(167,201,87,0.08); padding:48px 32px; display:flex; flex-direction:column; gap:0; position:sticky; top:72px; height:calc(100vh - 72px); overflow-y:auto; }
                .pf-sidebar-top { display:flex; flex-direction:column; gap:16px; padding-bottom:32px; border-bottom:1px solid rgba(167,201,87,0.08); margin-bottom:32px; }
                .pf-avatar { width:68px; height:68px; border-radius:50%; background:linear-gradient(135deg,rgba(56,102,65,0.6),rgba(167,201,87,0.2)); border:1px solid rgba(167,201,87,0.2); display:flex; align-items:center; justify-content:center; }
                .pf-avatar span { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:.05em; color:var(--g3); }
                .pf-username { font-family:'Space Grotesk',sans-serif; font-size:16px; font-weight:600; color:var(--cream); margin-bottom:2px; letter-spacing:0; }
                .pf-useremail { font-family:'Space Grotesk',sans-serif; font-size:11px; font-weight:300; color:rgba(242,232,207,0.3); }
                .pf-nav { display:flex; flex-direction:column; gap:2px; flex:1; }
                .pf-nav-btn { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border:none; background:transparent; color:rgba(242,232,207,0.35); font-family:'Space Grotesk',sans-serif; font-size:12px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; cursor:none; text-align:left; transition:color .25s ease,background .25s ease; }
                .pf-nav-btn:hover { color:var(--cream); background:rgba(167,201,87,0.04); }
                .pf-nav-btn--active { color:var(--g3); background:rgba(167,201,87,0.06); border-left:2px solid var(--g3); }
                .pf-nav-arrow { font-size:14px; }
                .pf-sidebar-foot { padding-top:24px; border-top:1px solid rgba(167,201,87,0.08); margin-top:24px; display:flex; flex-direction:column; gap:12px; }
                .pf-sidebar-link { font-family:'Space Grotesk',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:rgba(167,201,87,0.4); text-decoration:none; cursor:none; transition:color .2s ease; }
                .pf-sidebar-link:hover { color:var(--g3); }
                .pf-logout { background:none; border:none; color:rgba(188,71,73,0.45); font-family:'Space Grotesk',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; cursor:none; padding:0; text-align:left; transition:color .2s ease; }
                .pf-logout:hover { color:var(--red); }
                .pf-main { padding:56px 60px 80px; overflow-y:auto; animation:fade-in .4s ease both; }
                .pf-section-head { margin-bottom:40px; }
                .pf-section-eyebrow { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:var(--g3); margin-bottom:12px; }
                .pf-section-title { font-family:'Bebas Neue',sans-serif; font-size:48px; color:var(--cream); line-height:.9; }
                .pf-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:32px; }
                .pf-field { display:flex; flex-direction:column; gap:8px; }
                .pf-field--full { grid-column:1/-1; }
                .pf-label { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(242,232,207,0.3); }
                .pf-input { background:var(--dark2); border:1px solid rgba(167,201,87,0.12); padding:16px 20px; color:var(--cream); font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:300; outline:none; transition:border-color .3s ease,box-shadow .3s ease; border-radius:0; width:100%; }
                .pf-input::placeholder { color:rgba(242,232,207,0.2); }
                .pf-input:focus { border-color:rgba(167,201,87,0.4); box-shadow:0 0 0 3px rgba(167,201,87,0.05); }
                .pf-textarea { resize:vertical; }
                .pf-save { display:flex; align-items:center; gap:10px; padding:16px 32px; background:var(--g3); border:none; color:var(--dark); font-family:'Space Grotesk',sans-serif; font-size:12px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; cursor:none; transition:background .3s ease,transform .3s ease; }
                .pf-save:hover { background:var(--g4); transform:translateY(-2px); }
                .pf-save--done { background:rgba(167,201,87,0.2); color:var(--g3); }
                .pf-redirect-card { background:var(--dark2); border:1px solid rgba(167,201,87,0.08); padding:32px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; gap:24px; }
                .pf-redirect-card p { font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:300; color:rgba(242,232,207,0.4); max-width:380px; line-height:1.7; }
                .pf-address-card { background:var(--dark2); border:1px solid rgba(167,201,87,0.08); padding:28px 32px; margin-bottom:12px; position:relative; }
                .pf-address-tag { font-family:'Space Grotesk',sans-serif; font-size:8px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:var(--g3); background:rgba(167,201,87,0.1); border:1px solid rgba(167,201,87,0.2); padding:3px 10px; display:inline-block; margin-bottom:14px; }
                .pf-address-name { font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:600; color:var(--cream); margin-bottom:6px; }
                .pf-address-line { font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:300; color:rgba(242,232,207,0.4); line-height:1.7; }
                .pf-address-edit { position:absolute; top:28px; right:32px; background:none; border:none; font-family:'Space Grotesk',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.12em; color:rgba(167,201,87,0.4); cursor:none; transition:color .2s ease; }
                .pf-address-edit:hover { color:var(--g3); }
                .pf-add-address { background:none; border:1px dashed rgba(167,201,87,0.2); width:100%; padding:16px; font-family:'Space Grotesk',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:rgba(167,201,87,0.35); cursor:none; transition:border-color .3s ease,color .3s ease; }
                .pf-add-address:hover { border-color:rgba(167,201,87,0.4); color:var(--g3); }
                @media (max-width:900px) { .pf-page { grid-template-columns:1fr; } .pf-sidebar { position:static; height:auto; } .pf-main { padding:40px 24px 60px; } .pf-form-grid { grid-template-columns:1fr; } }
            `}</style>
        </>
    );
}

export default Profile;