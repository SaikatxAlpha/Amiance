import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { ordersAPI, usersAPI } from "../services/api";

const STATUS_STYLE = {
    Delivered: { color: "var(--g3)", bg: "rgba(167,201,87,0.08)", border: "rgba(167,201,87,0.2)" },
    Shipped: { color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
    Cancelled: { color: "var(--red)", bg: "rgba(188,71,73,0.08)", border: "rgba(188,71,73,0.2)" },
    Processing: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
};

const PAYMENT_LABEL = { cod: "💵 Cash on Delivery", card: "💳 Card", upi: "⚡ UPI" };

const NAV_TABS = [
    { id: "profile", label: "Profile", icon: "◎" },
    { id: "orders", label: "Orders", icon: "◉" },
    { id: "wishlist", label: "Wishlist", icon: "♡" },
    { id: "addresses", label: "Addresses", icon: "⊕" },
    { id: "security", label: "Security", icon: "⊗" },
];

const PREF_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function AddressModal({ initial, onSave, onClose }) {
    const [form, setForm] = useState(initial || { name: "", line1: "", city: "", postcode: "", country: "India" });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    return (
        <div className="pf-modal-backdrop" onClick={onClose}>
            <div className="pf-modal" onClick={e => e.stopPropagation()}>
                <div className="pf-modal-head">
                    <h3 className="pf-modal-title">{initial ? "Edit Address" : "Add Address"}</h3>
                    <button className="pf-modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="pf-modal-body">
                    {[
                        { label: "Full Name", key: "name", placeholder: "Alex Monroe" },
                        { label: "Street Address", key: "line1", placeholder: "Flat 3, 12 Fabric Lane" },
                        { label: "City", key: "city", placeholder: "Mumbai" },
                        { label: "PIN Code", key: "postcode", placeholder: "400001" },
                        { label: "Country", key: "country", placeholder: "India" },
                    ].map(({ label, key, placeholder }) => (
                        <div key={key} className="pf-field">
                            <label className="pf-label">{label}</label>
                            <input className="pf-input" placeholder={placeholder}
                                value={form[key]} onChange={e => set(key, e.target.value)} />
                        </div>
                    ))}
                </div>
                <div className="pf-modal-foot">
                    <button className="pf-ghost-btn" onClick={onClose}>Cancel</button>
                    <button className="pf-save" onClick={() => { if (form.name && form.line1 && form.city) onSave(form); }}>
                        <span>{initial ? "Save Changes" : "Add Address"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function Profile() {
    const { user, logout, updateUser, addresses, addAddress, updateAddress, removeAddress, setDefaultAddress, refreshUser } = useAuth();
    const { cart, addToCart, cartTotal } = useCart();
    const { wishlist, removeFromWishlist } = useWishlist();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("profile");
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const [form, setForm] = useState({ name: "", email: "", phone: "", bio: "" });
    const [saveStatus, setSaveStatus] = useState("idle");

    const [secForm, setSecForm] = useState({ current: "", next: "", confirm: "" });
    const [secStatus, setSecStatus] = useState("idle");
    const [secError, setSecError] = useState("");

    const [addrModal, setAddrModal] = useState(null);
    const [prefSize, setPrefSize] = useState("M");
    const [addrSaving, setAddrSaving] = useState(false);

    // Sync form with user
    useEffect(() => {
        if (user) {
            setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "", bio: user.bio || "" });
            setPrefSize(user.preferences?.defaultSize || "M");
        }
    }, [user]);

    // Load real orders when tab opens
    useEffect(() => {
        if (activeTab === "orders" && user) {
            setOrdersLoading(true);
            ordersAPI.getMyOrders()
                .then(d => setOrders(d.orders || []))
                .catch(() => setOrders([]))
                .finally(() => setOrdersLoading(false));
        }
    }, [activeTab, user]);

    const handleSaveProfile = async () => {
        setSaveStatus("saving");
        try {
            await updateUser({ name: form.name, email: form.email, phone: form.phone, bio: form.bio });
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 2500);
        } catch {
            setSaveStatus("idle");
        }
    };

    const handleChangePassword = async () => {
        setSecError("");
        if (!secForm.current) { setSecError("Enter your current password."); setSecStatus("error"); return; }
        if (secForm.next.length < 6) { setSecError("New password must be at least 6 characters."); setSecStatus("error"); return; }
        if (secForm.next !== secForm.confirm) { setSecError("Passwords do not match."); setSecStatus("error"); return; }
        setSecStatus("saving");
        try {
            await usersAPI.updatePassword({ currentPassword: secForm.current, newPassword: secForm.next });
            setSecForm({ current: "", next: "", confirm: "" });
            setSecStatus("saved");
            setTimeout(() => setSecStatus("idle"), 2500);
        } catch (err) {
            setSecError(err.message || "Failed to update password.");
            setSecStatus("error");
        }
    };

    const handleAddrSave = async (data) => {
        setAddrSaving(true);
        try {
            if (addrModal === "new") await addAddress(data);
            else await updateAddress(addrModal._id || addrModal.id, data);
            setAddrModal(null);
            await refreshUser?.();
        } catch { } finally { setAddrSaving(false); }
    };

    const handleMoveToCart = (item) => {
        addToCart(item);
        removeFromWishlist(item.id || item._id);
    };

    if (!user) {
        return (
            <>
                <Navbar />
                <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", padding: "120px 24px", background: "var(--dark)" }}>
                    <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "56px", color: "var(--cream)" }}>Sign In Required</h2>
                    <p style={{ color: "var(--text-muted)", fontFamily: "'Space Grotesk',sans-serif" }}>Sign in to view your profile.</p>
                    <div style={{ display: "flex", gap: "16px" }}>
                        <Link to="/login"><button className="btn-primary"><span>Sign In</span></button></Link>
                        <Link to="/signup"><button className="btn-ghost">Create Account <span className="arrow" /></button></Link>
                    </div>
                </div>
            </>
        );
    }

    const initials = form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <>
            <Navbar />
            <div className="pf-page">

                {/* SIDEBAR */}
                <aside className="pf-sidebar">
                    <div className="pf-sidebar-top">
                        <div className="pf-avatar">
                            <span>{initials}</span>
                            <div className="pf-avatar-ring" />
                        </div>
                        <p className="pf-username">{form.name}</p>
                        <p className="pf-useremail">{form.email}</p>
                        {!user.isVerified && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", marginTop: "8px" }}>
                                <span style={{ fontSize: "10px" }}>⚠</span>
                                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", color: "#fbbf24" }}>EMAIL NOT VERIFIED</span>
                            </div>
                        )}
                        {user.role === "admin" && (
                            <span className="pf-role-badge">Admin</span>
                        )}
                    </div>

                    {/* Quick stats */}
                    <div className="pf-sidebar-stats">
                        <div className="pf-stat">
                            <strong>{orders.length || "—"}</strong>
                            <span>Orders</span>
                        </div>
                        <div className="pf-stat-divider" />
                        <div className="pf-stat">
                            <strong>{wishlist.length}</strong>
                            <span>Saved</span>
                        </div>
                        <div className="pf-stat-divider" />
                        <div className="pf-stat">
                            <strong>{cart.reduce((a, i) => a + i.qty, 0)}</strong>
                            <span>In Cart</span>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="pf-nav">
                        {NAV_TABS.map(tab => (
                            <button key={tab.id}
                                className={`pf-nav-btn ${activeTab === tab.id ? "pf-nav-btn--active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}>
                                <span className="pf-nav-icon">{tab.icon}</span>
                                <span>{tab.label}</span>
                                {tab.id === "wishlist" && wishlist.length > 0 && (
                                    <span className="pf-nav-count">{wishlist.length}</span>
                                )}
                                {tab.id === "orders" && orders.length > 0 && (
                                    <span className="pf-nav-count">{orders.length}</span>
                                )}
                                {activeTab === tab.id && <span className="pf-nav-arrow">→</span>}
                            </button>
                        ))}
                    </nav>

                    <div className="pf-sidebar-foot">
                        {cart.length > 0 && (
                            <button className="pf-cart-shortcut" onClick={() => navigate("/cart")}>
                                <span>🛒 Cart · ₹{cartTotal?.toLocaleString("en-IN") || "0"}</span>
                                <span className="pf-cart-badge">{cart.reduce((a, i) => a + i.qty, 0)}</span>
                            </button>
                        )}
                        <Link to="/shop" className="pf-sidebar-link">Browse Collection →</Link>
                        {user.role === "admin" && (
                            <Link to="/admin" className="pf-sidebar-link" style={{ color: "rgba(167,201,87,0.6)" }}>Admin Dashboard →</Link>
                        )}
                        <button className="pf-logout" onClick={() => { logout(); navigate("/"); }}>
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="pf-main">

                    {/* PROFILE TAB */}
                    {activeTab === "profile" && (
                        <div className="pf-section" key="profile">
                            <div className="pf-section-head">
                                <p className="pf-section-eyebrow">Account</p>
                                <h2 className="pf-section-title">Personal Information</h2>
                            </div>

                            {!user.isVerified && (
                                <div style={{ padding: "16px 20px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", marginBottom: "28px", display: "flex", alignItems: "center", gap: "12px" }}>
                                    <span style={{ fontSize: "20px" }}>📧</span>
                                    <div>
                                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "12px", fontWeight: 700, color: "#fbbf24", marginBottom: "3px" }}>Verify your email</p>
                                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "11px", fontWeight: 300, color: "rgba(242,232,207,0.4)" }}>
                                            Check your inbox for a verification link.{" "}
                                            <button
                                                style={{ background: "none", border: "none", color: "var(--g3)", cursor: "pointer", fontSize: "11px", fontFamily: "'Space Grotesk',sans-serif", padding: 0, fontWeight: 600 }}
                                                onClick={async () => {
                                                    try {
                                                        await fetch("http://localhost:5000/api/auth/resend-verification", {
                                                            method: "POST", headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ email: user.email }),
                                                        });
                                                        alert("Verification email sent!");
                                                    } catch { alert("Failed to resend."); }
                                                }}
                                            >Resend →</button>
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="pf-form-grid">
                                <div className="pf-field">
                                    <label className="pf-label">Full Name</label>
                                    <input className="pf-input" value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="pf-field">
                                    <label className="pf-label">Email Address</label>
                                    <input className="pf-input" type="email" value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                </div>
                                <div className="pf-field">
                                    <label className="pf-label">Phone Number</label>
                                    <input className="pf-input" type="tel" placeholder="+91 98765 43210" value={form.phone}
                                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                                </div>
                                <div className="pf-field pf-field--full">
                                    <label className="pf-label">Style Bio</label>
                                    <textarea className="pf-input pf-textarea" placeholder="Tell us about your style..." rows={4} value={form.bio}
                                        onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                                </div>
                            </div>

                            <div className="pf-action-row">
                                <button className={`pf-save ${saveStatus === "saved" ? "pf-save--done" : ""}`}
                                    onClick={handleSaveProfile} disabled={saveStatus === "saving"}>
                                    <span>{saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "✓ Saved" : "Save Changes"}</span>
                                </button>
                            </div>

                            <div className="pf-danger-zone">
                                <p className="pf-danger-label">Danger Zone</p>
                                <div className="pf-danger-row">
                                    <div>
                                        <p className="pf-danger-title">Delete Account</p>
                                        <p className="pf-danger-desc">Permanently remove your account and all data. This cannot be undone.</p>
                                    </div>
                                    <button className="pf-danger-btn">Delete Account</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ORDERS TAB */}
                    {activeTab === "orders" && (
                        <div className="pf-section" key="orders">
                            <div className="pf-section-head">
                                <p className="pf-section-eyebrow">Purchase History</p>
                                <h2 className="pf-section-title">Your Orders</h2>
                            </div>

                            {ordersLoading ? (
                                <div style={{ padding: "60px 0", textAlign: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: "24px", color: "rgba(167,201,87,0.3)", letterSpacing: "0.2em" }}>
                                    LOADING...
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="pf-empty-state">
                                    <span className="pf-empty-icon">📦</span>
                                    <h3>No Orders Yet</h3>
                                    <p>Your first drop is waiting.</p>
                                    <Link to="/shop"><button className="pf-save"><span>Browse Collection</span></button></Link>
                                </div>
                            ) : (
                                <div className="pf-orders-list">
                                    {orders.map(order => {
                                        const st = STATUS_STYLE[order.status] || STATUS_STYLE.Processing;
                                        return (
                                            <div key={order._id} className="pf-order-card">
                                                <div className="pf-order-head">
                                                    <div>
                                                        <p className="pf-order-id">AMI-{order._id.slice(-6).toUpperCase()}</p>
                                                        <p className="pf-order-date">
                                                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                                            {" · "}
                                                            {PAYMENT_LABEL[order.paymentMethod] || order.paymentMethod}
                                                        </p>
                                                    </div>
                                                    <div className="pf-order-head-right">
                                                        <span className="pf-order-status" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                                                            {order.status}
                                                        </span>
                                                        <span className="pf-order-total">₹{order.totalPrice.toLocaleString("en-IN")}</span>
                                                    </div>
                                                </div>
                                                <div className="pf-order-items">
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="pf-order-item">
                                                            <img src={item.image} alt={item.name} className="pf-order-img" />
                                                            <div>
                                                                <p className="pf-order-item-name">{item.name}</p>
                                                                <p className="pf-order-item-meta">
                                                                    {item.size && `Size ${item.size} · `}Qty {item.qty} · ₹{item.price.toLocaleString("en-IN")} each
                                                                </p>
                                                            </div>
                                                            <span className="pf-order-item-total">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pf-order-foot">
                                                    {order.paymentMethod === "cod" && order.status === "Processing" && !order.isPaid && (
                                                        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "10px", color: "#fbbf24", fontWeight: 600 }}>
                                                            💵 Keep ₹{order.totalPrice.toLocaleString("en-IN")} ready
                                                        </span>
                                                    )}
                                                    {order.status === "Shipped" && <button className="pf-link-btn">Track →</button>}
                                                    {order.status === "Delivered" && <button className="pf-link-btn">Review →</button>}
                                                    <button className="pf-ghost-btn" style={{ marginLeft: "auto", padding: "8px 16px", fontSize: "9px" }}>Receipt</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* WISHLIST TAB */}
                    {activeTab === "wishlist" && (
                        <div className="pf-section" key="wishlist">
                            <div className="pf-section-head">
                                <p className="pf-section-eyebrow">Saved Pieces</p>
                                <h2 className="pf-section-title">Your Wishlist</h2>
                            </div>
                            {wishlist.length === 0 ? (
                                <div className="pf-empty-state">
                                    <span className="pf-empty-icon">♡</span>
                                    <h3>Nothing saved yet</h3>
                                    <p>Explore and save pieces before they're gone.</p>
                                    <Link to="/shop"><button className="pf-save"><span>Browse Collection</span></button></Link>
                                </div>
                            ) : (
                                <div className="pf-wishlist-grid">
                                    {wishlist.map(item => (
                                        <div key={item.id || item._id} className="pf-wish-card">
                                            <Link to={`/product/${item._id || item.id}`} className="pf-wish-img-wrap">
                                                <img src={item.image} alt={item.name} className="pf-wish-img" />
                                                {item.badge && <span className={`pf-wish-badge pf-wish-badge--${item.badge.toLowerCase().replace(" ", "-")}`}>{item.badge}</span>}
                                            </Link>
                                            <div className="pf-wish-info">
                                                <p className="pf-wish-tag">{item.tag}</p>
                                                <p className="pf-wish-name">{item.name}</p>
                                                <p className="pf-wish-price">₹{item.price?.toLocaleString("en-IN")}</p>
                                                <div className="pf-wish-actions">
                                                    <button className="pf-wish-add" onClick={() => handleMoveToCart(item)} disabled={item.badge === "SOLD OUT"}>
                                                        {item.badge === "SOLD OUT" ? "Sold Out" : "Move to Cart →"}
                                                    </button>
                                                    <button className="pf-wish-remove" onClick={() => removeFromWishlist(item.id || item._id)}>Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ADDRESSES TAB */}
                    {activeTab === "addresses" && (
                        <div className="pf-section" key="addresses">
                            <div className="pf-section-head">
                                <p className="pf-section-eyebrow">Delivery</p>
                                <h2 className="pf-section-title">Saved Addresses</h2>
                            </div>
                            <div className="pf-addr-list">
                                {(addresses || []).map(addr => (
                                    <div key={addr._id || addr.id} className={`pf-addr-card ${addr.isDefault ? "pf-addr-card--default" : ""}`}>
                                        <div className="pf-addr-card-top">
                                            {addr.isDefault && <span className="pf-addr-tag">Default</span>}
                                            <div className="pf-addr-actions-inline">
                                                <button className="pf-link-btn" onClick={() => setAddrModal(addr)}>Edit</button>
                                                {!addr.isDefault && (
                                                    <>
                                                        <button className="pf-link-btn" onClick={() => setDefaultAddress(addr._id || addr.id)}>Set Default</button>
                                                        <button className="pf-danger-link" onClick={() => removeAddress(addr._id || addr.id)}>Remove</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <p className="pf-addr-name">{addr.name}</p>
                                        <p className="pf-addr-line">{addr.line1}</p>
                                        <p className="pf-addr-line">{addr.city}{addr.postcode ? `, ${addr.postcode}` : ""}</p>
                                        <p className="pf-addr-line">{addr.country}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="pf-add-address" onClick={() => setAddrModal("new")}>+ Add New Address</button>
                            {addrModal !== null && (
                                <AddressModal
                                    initial={addrModal === "new" ? null : addrModal}
                                    onSave={handleAddrSave}
                                    onClose={() => setAddrModal(null)}
                                />
                            )}
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === "security" && (
                        <div className="pf-section" key="security">
                            <div className="pf-section-head">
                                <p className="pf-section-eyebrow">Security</p>
                                <h2 className="pf-section-title">Password & Access</h2>
                            </div>
                            <div className="pf-form-grid">
                                <div className="pf-field pf-field--full">
                                    <label className="pf-label">Current Password</label>
                                    <input className="pf-input" type="password" placeholder="••••••••"
                                        value={secForm.current} onChange={e => setSecForm(f => ({ ...f, current: e.target.value }))} />
                                </div>
                                <div className="pf-field">
                                    <label className="pf-label">New Password</label>
                                    <input className="pf-input" type="password" placeholder="Min. 6 characters"
                                        value={secForm.next} onChange={e => setSecForm(f => ({ ...f, next: e.target.value }))} />
                                </div>
                                <div className="pf-field">
                                    <label className="pf-label">Confirm New Password</label>
                                    <input className="pf-input" type="password" placeholder="Repeat new password"
                                        value={secForm.confirm} onChange={e => setSecForm(f => ({ ...f, confirm: e.target.value }))} />
                                </div>
                            </div>
                            {secForm.next && (
                                <div className="pf-strength-wrap">
                                    <div className="pf-strength-bar">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`pf-strength-seg ${secForm.next.length >= i * 3 ? "pf-strength-seg--on" : ""}`} />
                                        ))}
                                    </div>
                                    <span className="pf-strength-label">
                                        {secForm.next.length < 6 ? "Too short" : secForm.next.length < 9 ? "Fair" : secForm.next.length < 12 ? "Good" : "Strong"}
                                    </span>
                                </div>
                            )}
                            {secStatus === "error" && <p className="pf-error-msg">{secError}</p>}
                            {secStatus === "saved" && <p className="pf-success-msg">✓ Password updated successfully.</p>}
                            <div className="pf-action-row">
                                <button className={`pf-save ${secStatus === "saved" ? "pf-save--done" : ""}`}
                                    onClick={handleChangePassword} disabled={secStatus === "saving"}>
                                    <span>{secStatus === "saving" ? "Updating..." : secStatus === "saved" ? "✓ Updated" : "Update Password"}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <style>{profileStyles}</style>
        </>
    );
}

const profileStyles = `
  .pf-page{display:grid;grid-template-columns:300px 1fr;min-height:100vh;padding-top:72px;background:var(--dark)}
  .pf-sidebar{background:var(--dark2);border-right:1px solid rgba(167,201,87,0.08);padding:40px 28px;display:flex;flex-direction:column;gap:0;position:sticky;top:72px;height:calc(100vh - 72px);overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(167,201,87,0.15) transparent}
  .pf-sidebar-top{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding-bottom:24px;border-bottom:1px solid rgba(167,201,87,0.07);margin-bottom:20px}
  .pf-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,rgba(56,102,65,0.6),rgba(167,201,87,0.2));border:2px solid rgba(167,201,87,0.25);display:flex;align-items:center;justify-content:center;position:relative;flex-shrink:0}
  .pf-avatar span{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:.05em;color:var(--g3)}
  .pf-avatar-ring{position:absolute;inset:-4px;border-radius:50%;border:1px dashed rgba(167,201,87,0.2);animation:spin 12s linear infinite;pointer-events:none}
  @keyframes spin{to{transform:rotate(360deg)}}
  .pf-username{font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:600;color:var(--cream);letter-spacing:0}
  .pf-useremail{font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:300;color:rgba(242,232,207,0.3)}
  .pf-role-badge{font-family:'Space Grotesk',sans-serif;font-size:8px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:var(--g3);background:rgba(167,201,87,0.1);border:1px solid rgba(167,201,87,0.25);padding:3px 10px}
  .pf-sidebar-stats{display:flex;align-items:center;justify-content:center;gap:0;padding:16px 0;margin-bottom:12px}
  .pf-stat{display:flex;flex-direction:column;align-items:center;gap:2px;flex:1}
  .pf-stat strong{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:.05em;background:linear-gradient(135deg,var(--g3),var(--g4));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
  .pf-stat span{font-family:'Space Grotesk',sans-serif;font-size:8px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,232,207,0.25)}
  .pf-stat-divider{width:1px;height:28px;background:rgba(167,201,87,0.1)}
  .pf-nav{display:flex;flex-direction:column;gap:2px;flex:1;margin-bottom:16px}
  .pf-nav-btn{display:flex;align-items:center;gap:10px;padding:12px 14px;border:none;background:transparent;color:rgba(242,232,207,0.35);font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:none;text-align:left;transition:color .25s ease,background .25s ease;border-left:2px solid transparent;width:100%}
  .pf-nav-btn:hover{color:var(--cream);background:rgba(167,201,87,0.04)}
  .pf-nav-btn--active{color:var(--g3);background:rgba(167,201,87,0.07);border-left-color:var(--g3)}
  .pf-nav-icon{font-size:14px;flex-shrink:0;width:18px;text-align:center}
  .pf-nav-count{margin-left:auto;font-size:9px;font-weight:800;background:rgba(167,201,87,0.15);color:var(--g3);border-radius:9px;padding:1px 7px}
  .pf-nav-arrow{font-size:12px;margin-left:auto}
  .pf-nav-btn--active .pf-nav-count{display:none}
  .pf-sidebar-foot{padding-top:16px;border-top:1px solid rgba(167,201,87,0.07);display:flex;flex-direction:column;gap:10px}
  .pf-cart-shortcut{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border:1px solid rgba(167,201,87,0.2);background:rgba(167,201,87,0.04);color:var(--g3);font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:600;cursor:none;transition:background .25s ease;width:100%}
  .pf-cart-shortcut:hover{background:rgba(167,201,87,0.1)}
  .pf-cart-badge{background:var(--red);color:#fff;border-radius:9px;font-size:9px;font-weight:800;padding:1px 7px}
  .pf-sidebar-link{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(242,232,207,0.25);text-decoration:none;cursor:none;transition:color .2s ease}
  .pf-sidebar-link:hover{color:var(--g3)}
  .pf-logout{background:none;border:none;color:rgba(188,71,73,0.45);font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;cursor:none;padding:0;text-align:left;transition:color .2s ease}
  .pf-logout:hover{color:var(--red)}
  .pf-main{padding:52px 56px 80px;overflow-y:auto;animation:fade-in .4s ease both}
  .pf-section{animation:fadeSlideUp .4s ease both}
  .pf-section-head{margin-bottom:36px}
  .pf-section-eyebrow{font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:var(--g3);margin-bottom:12px}
  .pf-section-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(40px,4vw,60px);color:var(--cream);line-height:.9}
  .pf-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:28px}
  .pf-field{display:flex;flex-direction:column;gap:8px}
  .pf-field--full{grid-column:1/-1}
  .pf-label{font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(242,232,207,0.3)}
  .pf-input{background:var(--dark2);border:1px solid rgba(167,201,87,0.12);padding:14px 18px;color:var(--cream);font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:300;outline:none;transition:border-color .3s ease,box-shadow .3s ease;border-radius:0;width:100%}
  .pf-input::placeholder{color:rgba(242,232,207,0.2)}
  .pf-input:focus{border-color:rgba(167,201,87,0.4);box-shadow:0 0 0 3px rgba(167,201,87,0.05)}
  .pf-textarea{resize:vertical;min-height:100px}
  .pf-action-row{display:flex;align-items:center;gap:12px;margin-bottom:36px}
  .pf-save{display:inline-flex;align-items:center;gap:10px;padding:15px 30px;background:var(--g3);border:none;color:var(--dark);font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;cursor:none;transition:background .3s ease,transform .3s ease}
  .pf-save:hover:not(:disabled){background:var(--g4);transform:translateY(-2px)}
  .pf-save:disabled{opacity:0.6;cursor:not-allowed}
  .pf-save--done{background:rgba(167,201,87,0.15);color:var(--g3)}
  .pf-ghost-btn{background:none;border:1px solid rgba(167,201,87,0.15);padding:14px 24px;color:rgba(242,232,207,0.4);font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;cursor:none;transition:all .25s ease}
  .pf-ghost-btn:hover{color:var(--cream);border-color:rgba(167,201,87,0.35)}
  .pf-link-btn{background:none;border:none;color:rgba(167,201,87,0.55);font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;cursor:none;padding:0;transition:color .2s ease}
  .pf-link-btn:hover{color:var(--g3)}
  .pf-danger-link{background:none;border:none;color:rgba(188,71,73,0.45);font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;cursor:none;padding:0;transition:color .2s ease}
  .pf-danger-link:hover{color:var(--red)}
  .pf-error-msg{font-family:'Space Grotesk',sans-serif;font-size:11px;color:var(--red);letter-spacing:0.06em;padding:10px 16px;border:1px solid rgba(188,71,73,0.2);background:rgba(188,71,73,0.05);margin-bottom:16px}
  .pf-success-msg{font-family:'Space Grotesk',sans-serif;font-size:11px;color:var(--g3);letter-spacing:0.06em;padding:10px 16px;border:1px solid rgba(167,201,87,0.2);background:rgba(167,201,87,0.05);margin-bottom:16px}
  .pf-danger-zone{border:1px solid rgba(188,71,73,0.15);padding:24px 28px}
  .pf-danger-label{font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(188,71,73,0.5);margin-bottom:16px}
  .pf-danger-row{display:flex;align-items:center;justify-content:space-between;gap:24px}
  .pf-danger-title{font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:600;color:var(--cream);margin-bottom:4px}
  .pf-danger-desc{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:300;color:rgba(242,232,207,0.35)}
  .pf-danger-btn{padding:10px 20px;border:1px solid rgba(188,71,73,0.35);background:transparent;color:rgba(188,71,73,0.65);font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;cursor:none;transition:all .25s ease;white-space:nowrap;flex-shrink:0}
  .pf-danger-btn:hover{background:rgba(188,71,73,0.1);color:var(--red);border-color:var(--red)}
  .pf-orders-list{display:flex;flex-direction:column;gap:12px}
  .pf-order-card{background:var(--dark2);border:1px solid rgba(167,201,87,0.07);overflow:hidden;transition:border-color .3s ease}
  .pf-order-card:hover{border-color:rgba(167,201,87,0.18)}
  .pf-order-head{display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-bottom:1px solid rgba(167,201,87,0.06)}
  .pf-order-id{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;color:var(--cream);letter-spacing:0.06em;margin-bottom:2px}
  .pf-order-date{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:300;color:rgba(242,232,207,0.3)}
  .pf-order-head-right{display:flex;align-items:center;gap:16px}
  .pf-order-status{font-family:'Space Grotesk',sans-serif;font-size:8px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;padding:4px 10px}
  .pf-order-total{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:.05em;background:linear-gradient(90deg,var(--g2),var(--g3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .pf-order-items{padding:16px 22px;display:flex;flex-direction:column;gap:12px}
  .pf-order-item{display:grid;grid-template-columns:52px 1fr auto;gap:14px;align-items:center}
  .pf-order-img{width:52px;height:52px;object-fit:cover;background:var(--dark3)}
  .pf-order-item-name{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:600;color:var(--cream);margin-bottom:2px}
  .pf-order-item-meta{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:300;color:rgba(242,232,207,0.3)}
  .pf-order-item-total{font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--g3);letter-spacing:.05em}
  .pf-order-foot{padding:12px 22px 16px;border-top:1px solid rgba(167,201,87,0.05);display:flex;align-items:center;gap:16px}
  .pf-wishlist-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .pf-wish-card{background:var(--dark2);border:1px solid rgba(167,201,87,0.06);overflow:hidden;transition:border-color .3s ease,transform .3s ease}
  .pf-wish-card:hover{border-color:rgba(167,201,87,0.2);transform:translateY(-3px)}
  .pf-wish-img-wrap{display:block;position:relative;height:200px;overflow:hidden;background:var(--dark3)}
  .pf-wish-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}
  .pf-wish-card:hover .pf-wish-img{transform:scale(1.05)}
  .pf-wish-badge{position:absolute;top:10px;left:10px;font-family:'Space Grotesk',sans-serif;font-size:8px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;padding:3px 8px}
  .pf-wish-badge--new{background:var(--g3);color:var(--dark)}
  .pf-wish-badge--limited{background:rgba(188,71,73,0.9);color:#fff}
  .pf-wish-badge--sold-out{background:rgba(20,20,20,0.85);border:1px solid rgba(188,71,73,0.4);color:rgba(188,71,73,0.8)}
  .pf-wish-info{padding:14px 16px 16px}
  .pf-wish-tag{font-family:'Space Grotesk',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(167,201,87,0.5);margin-bottom:4px}
  .pf-wish-name{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:600;color:var(--cream);margin-bottom:6px;letter-spacing:0}
  .pf-wish-price{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:.05em;background:linear-gradient(90deg,var(--g2),var(--g3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:12px}
  .pf-wish-actions{display:flex;flex-direction:column;gap:6px}
  .pf-wish-add{display:flex;align-items:center;justify-content:center;width:100%;padding:10px;border:1px solid rgba(167,201,87,0.3);background:transparent;color:var(--g3);font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;cursor:none;position:relative;overflow:hidden;transition:color .3s ease}
  .pf-wish-add::before{content:'';position:absolute;inset:0;background:var(--g3);transform:scaleX(0);transform-origin:left;transition:transform .32s ease}
  .pf-wish-add:hover{color:var(--dark)}
  .pf-wish-add:hover::before{transform:scaleX(1)}
  .pf-wish-add span,.pf-wish-add{position:relative;z-index:1}
  .pf-wish-add:disabled{border-color:rgba(188,71,73,0.3);color:rgba(188,71,73,0.5);cursor:not-allowed}
  .pf-wish-add:disabled::before{display:none}
  .pf-wish-remove{background:none;border:none;color:rgba(188,71,73,0.4);font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;cursor:none;padding:4px 0;text-align:left;transition:color .2s ease}
  .pf-wish-remove:hover{color:var(--red)}
  .pf-empty-state{text-align:center;padding:80px 0;display:flex;flex-direction:column;align-items:center;gap:16px}
  .pf-empty-icon{font-size:52px;color:rgba(188,71,73,0.35);animation:float 3s ease-in-out infinite}
  .pf-empty-state h3{font-family:'Bebas Neue',sans-serif;font-size:36px;color:var(--cream)}
  .pf-empty-state p{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:300;color:var(--text-dim)}
  .pf-addr-list{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
  .pf-addr-card{background:var(--dark2);border:1px solid rgba(167,201,87,0.08);padding:22px 26px;transition:border-color .3s ease}
  .pf-addr-card--default{border-color:rgba(167,201,87,0.22)}
  .pf-addr-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .pf-addr-tag{font-family:'Space Grotesk',sans-serif;font-size:8px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:var(--g3);background:rgba(167,201,87,0.1);border:1px solid rgba(167,201,87,0.22);padding:3px 10px}
  .pf-addr-actions-inline{display:flex;gap:14px;align-items:center}
  .pf-addr-name{font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:600;color:var(--cream);margin-bottom:4px}
  .pf-addr-line{font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:300;color:rgba(242,232,207,0.4);line-height:1.7}
  .pf-add-address{background:none;border:1px dashed rgba(167,201,87,0.2);width:100%;padding:16px;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(167,201,87,0.35);cursor:none;transition:border-color .3s ease,color .3s ease}
  .pf-add-address:hover{border-color:rgba(167,201,87,0.4);color:var(--g3)}
  .pf-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);z-index:9000;display:flex;align-items:center;justify-content:center;padding:24px}
  .pf-modal{background:var(--dark2);border:1px solid rgba(167,201,87,0.15);width:100%;max-width:480px;animation:fadeSlideUp .3s ease both}
  .pf-modal-head{display:flex;justify-content:space-between;align-items:center;padding:22px 26px;border-bottom:1px solid rgba(167,201,87,0.08)}
  .pf-modal-title{font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--cream);letter-spacing:.02em}
  .pf-modal-close{background:none;border:none;color:rgba(242,232,207,0.35);font-size:16px;cursor:none;transition:color .2s ease}
  .pf-modal-close:hover{color:var(--cream)}
  .pf-modal-body{padding:22px 26px;display:flex;flex-direction:column;gap:14px}
  .pf-modal-foot{display:flex;justify-content:flex-end;gap:10px;padding:14px 26px 22px;border-top:1px solid rgba(167,201,87,0.08)}
  .pf-strength-wrap{display:flex;align-items:center;gap:12px;margin:-8px 0 16px}
  .pf-strength-bar{display:flex;gap:4px}
  .pf-strength-seg{width:40px;height:3px;background:rgba(167,201,87,0.1);border-radius:2px;transition:background .3s ease}
  .pf-strength-seg--on{background:var(--g3)}
  .pf-strength-label{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.1em;color:rgba(242,232,207,0.35)}
  @media(max-width:1100px){.pf-wishlist-grid{grid-template-columns:1fr 1fr}}
  @media(max-width:900px){.pf-page{grid-template-columns:1fr}.pf-sidebar{position:static;height:auto}.pf-main{padding:36px 24px 60px}.pf-form-grid{grid-template-columns:1fr}.pf-wishlist-grid{grid-template-columns:1fr}.pf-danger-row{flex-direction:column;align-items:flex-start}}
`;

export default Profile;