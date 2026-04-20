import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ordersAPI } from "../services/api";

const STEPS = ["Delivery", "Payment", "Confirm"];

const PAYMENT_METHODS = [
    {
        id: "cod",
        icon: "💵",
        label: "Cash on Delivery",
        sub: "Pay when your order arrives",
    },
    {
        id: "card",
        icon: "💳",
        label: "Credit / Debit Card",
        sub: "Visa, Mastercard, RuPay accepted",
    },
    {
        id: "upi",
        icon: "⚡",
        label: "UPI Payment",
        sub: "GPay, PhonePe, Paytm & more",
    },
];

function Checkout() {
    const { cart, cartCount, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [placing, setPlacing] = useState(false);
    const [placed, setPlaced] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [error, setError] = useState("");

    const [delivery, setDelivery] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.addresses?.[0]?.line1 || "",
        city: user?.addresses?.[0]?.city || "",
        postcode: user?.addresses?.[0]?.postcode || "",
        state: "",
        country: "India",
    });

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
    const [upiId, setUpiId] = useState("");

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = subtotal >= 2000 ? 0 : cart.length > 0 ? 99 : 0;
    const total = subtotal + shipping;

    const handlePlaceOrder = async () => {
        setPlacing(true); setError("");
        try {
            const orderData = {
                items: cart.map((item) => ({
                    product: item.id || item._id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    qty: item.qty,
                    size: item.size || "M",
                })),
                shippingAddress: {
                    name: delivery.name,
                    address: delivery.address,
                    city: delivery.city,
                    postcode: delivery.postcode,
                    country: delivery.country,
                },
                paymentMethod,
                subtotal,
                shippingPrice: shipping,
                totalPrice: total,
            };

            const data = await ordersAPI.create(orderData);
            setOrderId(data.order._id);
            clearCart?.();
            setPlaced(true);
        } catch (err) {
            setError(err.message || "Order placement failed. Please try again.");
        } finally {
            setPlacing(false);
        }
    };

    if (cart.length === 0 && !placed) {
        return (
            <>
                <Navbar />
                <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", padding: "120px 24px", background: "var(--dark)" }}>
                    <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "56px", color: "var(--cream)" }}>Cart Is Empty</h2>
                    <Link to="/shop"><button className="btn-primary"><span>Browse Collection</span></button></Link>
                </div>
            </>
        );
    }

    if (placed) {
        return (
            <>
                <Navbar />
                <div className="ck-success-page">
                    <div className="ck-success-inner">
                        <div className="ck-success-icon">✦</div>
                        <p className="ck-success-eyebrow">Order Confirmed</p>
                        <h1 className="ck-success-title">It's On Its Way.</h1>
                        <p className="ck-success-body">
                            Your order has been placed successfully. A confirmation email has been sent to{" "}
                            <strong style={{ color: "var(--g3)" }}>{delivery.email}</strong>.
                            {paymentMethod === "cod" && (
                                <><br /><br />
                                    <span style={{ color: "rgba(167,201,87,0.7)" }}>
                                        💵 Please keep ₹{total.toLocaleString("en-IN")} ready for Cash on Delivery.
                                    </span>
                                </>
                            )}
                        </p>
                        <div className="ck-success-order">
                            Order #{orderId ? `AMI-${orderId.slice(-6).toUpperCase()}` : `AMI-${Date.now().toString().slice(-6)}`}
                        </div>
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                            <Link to="/orders"><button className="btn-primary"><span>View Orders</span></button></Link>
                            <Link to="/shop"><button className="btn-ghost">Continue Shopping <span className="arrow" /></button></Link>
                        </div>
                    </div>
                </div>
                <style>{successStyles}</style>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="ck-page">
                {/* Steps */}
                <div className="ck-steps">
                    {STEPS.map((s, i) => (
                        <div key={s} className={`ck-step ${i === step ? "ck-step--active" : ""} ${i < step ? "ck-step--done" : ""}`}>
                            <span className="ck-step-num">{i < step ? "✓" : i + 1}</span>
                            <span className="ck-step-label">{s}</span>
                            {i < STEPS.length - 1 && <span className="ck-step-line" />}
                        </div>
                    ))}
                </div>

                <div className="ck-body">
                    {/* Left — form */}
                    <div className="ck-left">

                        {/* STEP 0 — DELIVERY */}
                        {step === 0 && (
                            <div className="ck-section">
                                <h2 className="ck-section-title">Delivery Details</h2>
                                <div className="ck-form-grid">
                                    <div className="ck-field ck-field--full">
                                        <label className="ck-label">Full Name</label>
                                        <input className="ck-input" placeholder="Alex Monroe" value={delivery.name}
                                            onChange={e => setDelivery(d => ({ ...d, name: e.target.value }))} />
                                    </div>
                                    <div className="ck-field">
                                        <label className="ck-label">Email</label>
                                        <input className="ck-input" type="email" placeholder="you@example.com" value={delivery.email}
                                            onChange={e => setDelivery(d => ({ ...d, email: e.target.value }))} />
                                    </div>
                                    <div className="ck-field">
                                        <label className="ck-label">Phone Number</label>
                                        <input className="ck-input" placeholder="+91 98765 43210" value={delivery.phone}
                                            onChange={e => setDelivery(d => ({ ...d, phone: e.target.value }))} />
                                    </div>
                                    <div className="ck-field ck-field--full">
                                        <label className="ck-label">Street Address</label>
                                        <input className="ck-input" placeholder="Flat 3, 12 Fabric Lane" value={delivery.address}
                                            onChange={e => setDelivery(d => ({ ...d, address: e.target.value }))} />
                                    </div>
                                    <div className="ck-field">
                                        <label className="ck-label">City</label>
                                        <input className="ck-input" placeholder="Mumbai" value={delivery.city}
                                            onChange={e => setDelivery(d => ({ ...d, city: e.target.value }))} />
                                    </div>
                                    <div className="ck-field">
                                        <label className="ck-label">State</label>
                                        <input className="ck-input" placeholder="Maharashtra" value={delivery.state}
                                            onChange={e => setDelivery(d => ({ ...d, state: e.target.value }))} />
                                    </div>
                                    <div className="ck-field">
                                        <label className="ck-label">PIN Code</label>
                                        <input className="ck-input" placeholder="400001" value={delivery.postcode}
                                            onChange={e => setDelivery(d => ({ ...d, postcode: e.target.value }))} />
                                    </div>
                                    <div className="ck-field">
                                        <label className="ck-label">Country</label>
                                        <input className="ck-input" value="India" readOnly style={{ opacity: 0.5 }} />
                                    </div>
                                </div>
                                <button className="ck-next"
                                    disabled={!delivery.name || !delivery.email || !delivery.address || !delivery.city}
                                    onClick={() => setStep(1)}>
                                    <span>Continue to Payment</span><span>→</span>
                                </button>
                            </div>
                        )}

                        {/* STEP 1 — PAYMENT */}
                        {step === 1 && (
                            <div className="ck-section">
                                <h2 className="ck-section-title">Payment Method</h2>

                                {/* Payment Method Selector */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                                    {PAYMENT_METHODS.map(pm => (
                                        <button key={pm.id}
                                            className={`ck-pm-btn ${paymentMethod === pm.id ? "ck-pm-btn--active" : ""}`}
                                            onClick={() => setPaymentMethod(pm.id)}>
                                            <span className="ck-pm-icon">{pm.icon}</span>
                                            <div style={{ flex: 1, textAlign: "left" }}>
                                                <p className="ck-pm-label">{pm.label}</p>
                                                <p className="ck-pm-sub">{pm.sub}</p>
                                            </div>
                                            <span className="ck-pm-radio" />
                                        </button>
                                    ))}
                                </div>

                                {/* Card details */}
                                {paymentMethod === "card" && (
                                    <div className="ck-form-grid" style={{ marginBottom: "28px" }}>
                                        <div className="ck-field ck-field--full">
                                            <label className="ck-label">Card Number</label>
                                            <input className="ck-input" placeholder="0000 0000 0000 0000"
                                                value={card.number} onChange={e => setCard(c => ({ ...c, number: e.target.value }))} maxLength={19} />
                                        </div>
                                        <div className="ck-field ck-field--full">
                                            <label className="ck-label">Cardholder Name</label>
                                            <input className="ck-input" placeholder="Alex Monroe"
                                                value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
                                        </div>
                                        <div className="ck-field">
                                            <label className="ck-label">Expiry</label>
                                            <input className="ck-input" placeholder="MM / YY"
                                                value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))} maxLength={7} />
                                        </div>
                                        <div className="ck-field">
                                            <label className="ck-label">CVV</label>
                                            <input className="ck-input" placeholder="•••" type="password"
                                                value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))} maxLength={4} />
                                        </div>
                                    </div>
                                )}

                                {/* UPI details */}
                                {paymentMethod === "upi" && (
                                    <div style={{ marginBottom: "28px" }}>
                                        <div className="ck-field">
                                            <label className="ck-label">UPI ID</label>
                                            <input className="ck-input" placeholder="yourname@upi"
                                                value={upiId} onChange={e => setUpiId(e.target.value)} />
                                        </div>
                                        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", color: "rgba(242,232,207,0.3)", marginTop: "10px" }}>
                                            You'll receive a payment request on your UPI app after placing the order.
                                        </p>
                                    </div>
                                )}

                                {paymentMethod === "cod" && (
                                    <div className="ck-cod-notice">
                                        <span style={{ fontSize: "20px" }}>💵</span>
                                        <div>
                                            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, color: "var(--cream)", marginBottom: "4px" }}>
                                                Cash on Delivery
                                            </p>
                                            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 300, color: "rgba(242,232,207,0.4)", lineHeight: 1.7 }}>
                                                Please keep ₹{total.toLocaleString("en-IN")} ready at the time of delivery.
                                                No advance payment required.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="ck-btn-row">
                                    <button className="ck-back" onClick={() => setStep(0)}>← Back</button>
                                    <button className="ck-next" onClick={() => setStep(2)}>
                                        <span>Review Order</span><span>→</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2 — CONFIRM */}
                        {step === 2 && (
                            <div className="ck-section">
                                <h2 className="ck-section-title">Confirm Order</h2>
                                <div className="ck-review-block">
                                    <p className="ck-review-label">Shipping To</p>
                                    <p className="ck-review-val">{delivery.name}</p>
                                    <p className="ck-review-val">{delivery.address}</p>
                                    <p className="ck-review-val">{delivery.city}{delivery.state ? `, ${delivery.state}` : ""} — {delivery.postcode}</p>
                                    <p className="ck-review-val">{delivery.country}</p>
                                    {delivery.phone && <p className="ck-review-val">📞 {delivery.phone}</p>}
                                </div>
                                <div className="ck-review-block">
                                    <p className="ck-review-label">Payment Method</p>
                                    <p className="ck-review-val">
                                        {paymentMethod === "cod" && "💵 Cash on Delivery"}
                                        {paymentMethod === "card" && `💳 Card ending in ····${card.number.slice(-4) || "?????"}`}
                                        {paymentMethod === "upi" && `⚡ UPI — ${upiId || "Pending"}`}
                                    </p>
                                </div>
                                {error && <p className="auth-error" style={{ marginBottom: "16px" }}>{error}</p>}
                                <div className="ck-btn-row">
                                    <button className="ck-back" onClick={() => setStep(1)}>← Back</button>
                                    <button className="ck-place" onClick={handlePlaceOrder} disabled={placing}>
                                        <span>{placing ? "Placing Order..." : `Place Order · ₹${total.toLocaleString("en-IN")}`}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — order summary */}
                    <div className="ck-summary">
                        <h3 className="ck-summary-title">Order Summary</h3>
                        <div className="ck-summary-items">
                            {cart.map(item => (
                                <div key={item.id || item._id} className="ck-summary-item">
                                    <div className="ck-summary-img-wrap">
                                        <img src={item.image} alt={item.name} className="ck-summary-img" />
                                        <span className="ck-summary-qty">{item.qty}</span>
                                    </div>
                                    <div className="ck-summary-info">
                                        <p className="ck-summary-name">{item.name}</p>
                                        {item.size && <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "10px", color: "rgba(242,232,207,0.3)", marginTop: "2px" }}>Size: {item.size}</p>}
                                    </div>
                                    <p className="ck-summary-price">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                                </div>
                            ))}
                        </div>
                        <div className="ck-summary-rows">
                            <div className="ck-summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                            <div className="ck-summary-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? <span style={{ color: "var(--g3)", fontWeight: 700 }}>Free</span> : `₹${shipping}`}</span>
                            </div>
                            {subtotal > 0 && subtotal < 2000 && (
                                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "10px", color: "rgba(167,201,87,0.55)", padding: "8px 0", lineHeight: 1.6 }}>
                                    Add ₹{(2000 - subtotal).toLocaleString("en-IN")} more for free shipping
                                </div>
                            )}
                        </div>
                        <div className="ck-summary-total">
                            <span>Total</span>
                            <span className="ck-summary-total-price">₹{total.toLocaleString("en-IN")}</span>
                        </div>
                        {paymentMethod === "cod" && (
                            <div style={{ marginTop: "12px", padding: "12px 16px", background: "rgba(167,201,87,0.06)", border: "1px solid rgba(167,201,87,0.12)", fontFamily: "'Space Grotesk',sans-serif", fontSize: "10px", color: "rgba(167,201,87,0.6)", letterSpacing: "0.06em" }}>
                                💵 Pay on delivery — no advance needed
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .ck-page { padding-top:72px;background:var(--dark);min-height:100vh; }
        .ck-steps { display:flex;align-items:center;padding:32px 60px;border-bottom:1px solid rgba(167,201,87,0.08);background:var(--dark2); }
        .ck-step { display:flex;align-items:center;gap:10px;flex:1; }
        .ck-step-num { width:28px;height:28px;border:1px solid rgba(167,201,87,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;color:rgba(242,232,207,0.3);transition:all .3s ease;flex-shrink:0; }
        .ck-step--active .ck-step-num { border-color:var(--g3);color:var(--g3);box-shadow:0 0 16px rgba(167,201,87,0.2); }
        .ck-step--done .ck-step-num { background:var(--g3);border-color:var(--g3);color:var(--dark); }
        .ck-step-label { font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(242,232,207,0.25);transition:color .3s ease; }
        .ck-step--active .ck-step-label { color:var(--cream); }
        .ck-step--done .ck-step-label { color:rgba(167,201,87,0.5); }
        .ck-step-line { flex:1;height:1px;background:rgba(167,201,87,0.1); }
        .ck-body { display:grid;grid-template-columns:1fr 380px;gap:0;min-height:calc(100vh - 72px - 93px); }
        .ck-left { padding:56px 60px; }
        .ck-section { max-width:540px;animation:fadeSlideUp .5s ease both; }
        .ck-section-title { font-family:'Bebas Neue',sans-serif;font-size:42px;color:var(--cream);margin-bottom:36px;line-height:.9; }
        .ck-form-grid { display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px; }
        .ck-field { display:flex;flex-direction:column;gap:8px; }
        .ck-field--full { grid-column:1/-1; }
        .ck-label { font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(242,232,207,0.3); }
        .ck-input { background:var(--dark2);border:1px solid rgba(167,201,87,0.12);padding:16px 20px;color:var(--cream);font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:300;outline:none;transition:border-color .3s ease,box-shadow .3s ease;border-radius:0;width:100%; }
        .ck-input::placeholder { color:rgba(242,232,207,0.2); }
        .ck-input:focus { border-color:rgba(167,201,87,0.4);box-shadow:0 0 0 3px rgba(167,201,87,0.05); }
        .ck-pm-btn { display:flex;align-items:center;gap:16px;padding:18px 20px;border:1px solid rgba(167,201,87,0.12);background:var(--dark2);cursor:none;width:100%;transition:all .3s ease;position:relative;overflow:hidden; }
        .ck-pm-btn:hover { border-color:rgba(167,201,87,0.3); }
        .ck-pm-btn--active { border-color:var(--g3);background:rgba(167,201,87,0.05);box-shadow:0 0 20px rgba(167,201,87,0.08); }
        .ck-pm-icon { font-size:24px;flex-shrink:0; }
        .ck-pm-label { font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:600;color:var(--cream);margin:0 0 3px; }
        .ck-pm-sub { font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:300;color:rgba(242,232,207,0.35);margin:0; }
        .ck-pm-radio { width:16px;height:16px;border-radius:50%;border:2px solid rgba(167,201,87,0.3);flex-shrink:0;transition:all .3s ease;position:relative; }
        .ck-pm-btn--active .ck-pm-radio { border-color:var(--g3);background:var(--g3);box-shadow:inset 0 0 0 3px var(--dark2); }
        .ck-cod-notice { display:flex;gap:16px;padding:20px;background:rgba(167,201,87,0.05);border:1px solid rgba(167,201,87,0.12);margin-bottom:28px; }
        .ck-btn-row { display:flex;align-items:center;gap:16px; }
        .ck-next { display:flex;align-items:center;gap:12px;padding:18px 32px;background:var(--g3);border:none;color:var(--dark);font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;cursor:none;transition:background .3s ease,transform .3s ease; }
        .ck-next:hover:not(:disabled) { background:var(--g4);transform:translateY(-2px); }
        .ck-next:disabled { opacity:0.5;cursor:not-allowed; }
        .ck-next span:last-child { font-size:18px; }
        .ck-back { background:none;border:none;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(242,232,207,0.3);cursor:none;padding:0;transition:color .2s ease; }
        .ck-back:hover { color:var(--cream); }
        .ck-place { display:flex;align-items:center;gap:12px;padding:18px 32px;background:var(--g3);border:none;color:var(--dark);font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;cursor:none;transition:background .3s ease,transform .3s ease; }
        .ck-place:hover:not(:disabled) { background:var(--g4);transform:translateY(-2px); }
        .ck-place:disabled { opacity:0.6;transform:none;cursor:not-allowed; }
        .ck-review-block { background:var(--dark2);border:1px solid rgba(167,201,87,0.08);padding:20px 24px;margin-bottom:12px; }
        .ck-review-label { font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(167,201,87,0.5);margin-bottom:8px; }
        .ck-review-val { font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:300;color:rgba(242,232,207,0.6);line-height:1.7; }
        .ck-summary { background:var(--dark2);border-left:1px solid rgba(167,201,87,0.08);padding:56px 40px;position:sticky;top:72px;height:calc(100vh - 72px - 93px);overflow-y:auto; }
        .ck-summary-title { font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--cream);margin-bottom:32px;letter-spacing:.02em; }
        .ck-summary-items { display:flex;flex-direction:column;gap:16px;margin-bottom:28px;border-bottom:1px solid rgba(167,201,87,0.08);padding-bottom:28px; }
        .ck-summary-item { display:grid;grid-template-columns:56px 1fr auto;gap:14px;align-items:center; }
        .ck-summary-img-wrap { position:relative; }
        .ck-summary-img { width:56px;height:56px;object-fit:cover;background:var(--dark3);display:block; }
        .ck-summary-qty { position:absolute;top:-6px;right:-6px;width:18px;height:18px;background:var(--g3);color:var(--dark);border-radius:50%;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;font-family:'Space Grotesk',sans-serif; }
        .ck-summary-name { font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:500;color:var(--cream); }
        .ck-summary-price { font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--g3);letter-spacing:.05em; }
        .ck-summary-rows { display:flex;flex-direction:column;gap:0; }
        .ck-summary-row { display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(167,201,87,0.06);font-family:'Space Grotesk',sans-serif;font-size:13px;color:rgba(242,232,207,0.4); }
        .ck-summary-total { display:flex;justify-content:space-between;padding:20px 0;font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:600;color:var(--cream); }
        .ck-summary-total-price { font-family:'Bebas Neue',sans-serif;font-size:28px;background:linear-gradient(135deg,var(--g2),var(--g3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:.05em; }
        .auth-error { font-family:'Space Grotesk',sans-serif;font-size:11px;color:var(--red);letter-spacing:0.06em;padding:10px 16px;border:1px solid rgba(188,71,73,0.2);background:rgba(188,71,73,0.05); }
        @media (max-width:900px) { .ck-body{grid-template-columns:1fr} .ck-summary{position:static;height:auto} .ck-left,.ck-summary{padding:40px 24px} .ck-steps{padding:24px} .ck-form-grid{grid-template-columns:1fr} }
      `}</style>
        </>
    );
}

const successStyles = `
  .ck-success-page { min-height:100vh;display:flex;align-items:center;justify-content:center;padding:120px 60px;background:var(--dark); }
  .ck-success-inner { max-width:540px;text-align:center;animation:fadeSlideUp .6s ease both;display:flex;flex-direction:column;align-items:center;gap:20px; }
  .ck-success-icon { font-size:48px;color:var(--g3); }
  .ck-success-eyebrow { font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:var(--g3); }
  .ck-success-title { font-family:'Bebas Neue',sans-serif;font-size:clamp(56px,8vw,96px);color:var(--cream);line-height:.9; }
  .ck-success-body { font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:300;line-height:1.9;color:rgba(242,232,207,0.4); }
  .ck-success-order { font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.2em;color:rgba(167,201,87,0.5);background:rgba(167,201,87,0.05);border:1px solid rgba(167,201,87,0.12);padding:10px 24px; }
`;

export default Checkout;