import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import { useCart } from "../context/CartContext";

const STEPS = ["Delivery", "Payment", "Confirm"];

function Checkout() {
    const { cart, cartCount } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [placing, setPlacing] = useState(false);
    const [placed, setPlaced] = useState(false);

    const [delivery, setDelivery] = useState({ name: "", email: "", address: "", city: "", postcode: "", country: "GB" });
    const [payment, setPayment] = useState({ card: "", expiry: "", cvv: "", name: "" });

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = cart.length > 0 ? 5 : 0;
    const total = subtotal + shipping;

    const handlePlaceOrder = () => {
        setPlacing(true);
        setTimeout(() => { setPlacing(false); setPlaced(true); }, 1400);
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
                            Your order has been placed. You'll receive a confirmation email shortly.
                            Remember — once it's gone, it's gone. Good choice.
                        </p>
                        <div className="ck-success-order">Order #AMI-{Date.now().toString().slice(-6)}</div>
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                            <Link to="/orders"><button className="btn-primary"><span>View Orders</span></button></Link>
                            <Link to="/shop"><button className="btn-ghost">Continue Shopping <span className="arrow" /></button></Link>
                        </div>
                    </div>
                </div>
                <style>{`
                    .ck-success-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:120px 60px; background:var(--dark); }
                    .ck-success-inner { max-width:540px; text-align:center; animation:fadeSlideUp .6s ease both; display:flex; flex-direction:column; align-items:center; gap:20px; }
                    .ck-success-icon { font-size:48px; color:var(--g3); }
                    .ck-success-eyebrow { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:var(--g3); }
                    .ck-success-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(56px,8vw,96px); color:var(--cream); line-height:.9; }
                    .ck-success-body { font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:300; line-height:1.9; color:rgba(242,232,207,0.4); }
                    .ck-success-order { font-family:'Space Grotesk',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.2em; color:rgba(167,201,87,0.5); background:rgba(167,201,87,0.05); border:1px solid rgba(167,201,87,0.12); padding:10px 24px; }
                `}</style>
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

                        {step === 0 && (
                            <div className="ck-section">
                                <h2 className="ck-section-title">Delivery Details</h2>
                                <div className="ck-form-grid">
                                    <div className="ck-field ck-field--full">
                                        <label className="ck-label">Full Name</label>
                                        <input className="ck-input" placeholder="Alex Monroe" value={delivery.name} onChange={e => setDelivery(d => ({ ...d, name: e.target.value }))} />
                                    </div>
                                    <div className="ck-field ck-field--full">
                                        <label className="ck-label">Email</label>
                                        <input className="ck-input" type="email" placeholder="you@example.com" value={delivery.email} onChange={e => setDelivery(d => ({ ...d, email: e.target.value }))} />
                                    </div>
                                    <div className="ck-field ck-field--full">
                                        <label className="ck-label">Street Address</label>
                                        <input className="ck-input" placeholder="12 Fabric Lane, Flat 3" value={delivery.address} onChange={e => setDelivery(d => ({ ...d, address: e.target.value }))} />
                                    </div>
                                    <div className="ck-field">
                                        <label className="ck-label">City</label>
                                        <input className="ck-input" placeholder="London" value={delivery.city} onChange={e => setDelivery(d => ({ ...d, city: e.target.value }))} />
                                    </div>
                                    <div className="ck-field">
                                        <label className="ck-label">Postcode</label>
                                        <input className="ck-input" placeholder="W1 4AB" value={delivery.postcode} onChange={e => setDelivery(d => ({ ...d, postcode: e.target.value }))} />
                                    </div>
                                </div>
                                <button className="ck-next" onClick={() => setStep(1)}>
                                    <span>Continue to Payment</span>
                                    <span>→</span>
                                </button>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="ck-section">
                                <h2 className="ck-section-title">Payment</h2>
                                <div className="ck-form-grid">
                                    <div className="ck-field ck-field--full">
                                        <label className="ck-label">Card Number</label>
                                        <input className="ck-input" placeholder="0000 0000 0000 0000" value={payment.card} onChange={e => setPayment(p => ({ ...p, card: e.target.value }))} maxLength={19} />
                                    </div>
                                    <div className="ck-field ck-field--full">
                                        <label className="ck-label">Cardholder Name</label>
                                        <input className="ck-input" placeholder="Alex Monroe" value={payment.name} onChange={e => setPayment(p => ({ ...p, name: e.target.value }))} />
                                    </div>
                                    <div className="ck-field">
                                        <label className="ck-label">Expiry</label>
                                        <input className="ck-input" placeholder="MM / YY" value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} maxLength={7} />
                                    </div>
                                    <div className="ck-field">
                                        <label className="ck-label">CVV</label>
                                        <input className="ck-input" placeholder="•••" type="password" value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} maxLength={4} />
                                    </div>
                                </div>
                                <div className="ck-btn-row">
                                    <button className="ck-back" onClick={() => setStep(0)}>← Back</button>
                                    <button className="ck-next" onClick={() => setStep(2)}>
                                        <span>Review Order</span>
                                        <span>→</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="ck-section">
                                <h2 className="ck-section-title">Confirm Order</h2>
                                <div className="ck-review-block">
                                    <p className="ck-review-label">Shipping To</p>
                                    <p className="ck-review-val">{delivery.name || "—"}</p>
                                    <p className="ck-review-val">{delivery.address}, {delivery.city} {delivery.postcode}</p>
                                </div>
                                <div className="ck-review-block">
                                    <p className="ck-review-label">Payment</p>
                                    <p className="ck-review-val">•••• •••• •••• {payment.card.slice(-4) || "?????"}</p>
                                </div>
                                <div className="ck-btn-row">
                                    <button className="ck-back" onClick={() => setStep(1)}>← Back</button>
                                    <button className="ck-place" onClick={handlePlaceOrder} disabled={placing}>
                                        <span>{placing ? "Placing Order..." : `Place Order · $${total.toFixed(2)}`}</span>
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
                                <div key={item.id} className="ck-summary-item">
                                    <div className="ck-summary-img-wrap">
                                        <img src={item.image} alt={item.name} className="ck-summary-img" />
                                        <span className="ck-summary-qty">{item.qty}</span>
                                    </div>
                                    <div className="ck-summary-info">
                                        <p className="ck-summary-name">{item.name}</p>
                                    </div>
                                    <p className="ck-summary-price">${(item.price * item.qty).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="ck-summary-rows">
                            <div className="ck-summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                            <div className="ck-summary-row"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                        </div>
                        <div className="ck-summary-total">
                            <span>Total</span>
                            <span className="ck-summary-total-price">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .ck-page { padding-top:72px; background:var(--dark); min-height:100vh; }
                .ck-steps { display:flex; align-items:center; padding:32px 60px; border-bottom:1px solid rgba(167,201,87,0.08); background:var(--dark2); }
                .ck-step { display:flex; align-items:center; gap:10px; flex:1; }
                .ck-step-num { width:28px; height:28px; border:1px solid rgba(167,201,87,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:11px; font-weight:700; color:rgba(242,232,207,0.3); transition:all .3s ease; flex-shrink:0; }
                .ck-step--active .ck-step-num { border-color:var(--g3); color:var(--g3); box-shadow:0 0 16px rgba(167,201,87,0.2); }
                .ck-step--done .ck-step-num { background:var(--g3); border-color:var(--g3); color:var(--dark); }
                .ck-step-label { font-family:'Space Grotesk',sans-serif; font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(242,232,207,0.25); transition:color .3s ease; }
                .ck-step--active .ck-step-label { color:var(--cream); }
                .ck-step--done .ck-step-label { color:rgba(167,201,87,0.5); }
                .ck-step-line { flex:1; height:1px; background:rgba(167,201,87,0.1); }
                .ck-body { display:grid; grid-template-columns:1fr 380px; gap:0; min-height:calc(100vh - 72px - 93px); }
                .ck-left { padding:56px 60px; }
                .ck-section { max-width:520px; animation:fadeSlideUp .5s ease both; }
                .ck-section-title { font-family:'Bebas Neue',sans-serif; font-size:42px; color:var(--cream); margin-bottom:36px; line-height:.9; }
                .ck-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:32px; }
                .ck-field { display:flex; flex-direction:column; gap:8px; }
                .ck-field--full { grid-column:1/-1; }
                .ck-label { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(242,232,207,0.3); }
                .ck-input { background:var(--dark2); border:1px solid rgba(167,201,87,0.12); padding:16px 20px; color:var(--cream); font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:300; outline:none; transition:border-color .3s ease,box-shadow .3s ease; border-radius:0; width:100%; }
                .ck-input::placeholder { color:rgba(242,232,207,0.2); }
                .ck-input:focus { border-color:rgba(167,201,87,0.4); box-shadow:0 0 0 3px rgba(167,201,87,0.05); }
                .ck-btn-row { display:flex; align-items:center; gap:16px; }
                .ck-next { display:flex; align-items:center; gap:12px; padding:18px 32px; background:var(--g3); border:none; color:var(--dark); font-family:'Space Grotesk',sans-serif; font-size:12px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; cursor:none; transition:background .3s ease,transform .3s ease; }
                .ck-next:hover { background:var(--g4); transform:translateY(-2px); }
                .ck-next span:last-child { font-size:18px; }
                .ck-back { background:none; border:none; font-family:'Space Grotesk',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:rgba(242,232,207,0.3); cursor:none; padding:0; transition:color .2s ease; }
                .ck-back:hover { color:var(--cream); }
                .ck-place { display:flex; align-items:center; gap:12px; padding:18px 32px; background:var(--g3); border:none; color:var(--dark); font-family:'Space Grotesk',sans-serif; font-size:12px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; cursor:none; transition:background .3s ease,transform .3s ease; }
                .ck-place:hover { background:var(--g4); transform:translateY(-2px); }
                .ck-place:disabled { opacity:0.6; transform:none; }
                .ck-review-block { background:var(--dark2); border:1px solid rgba(167,201,87,0.08); padding:20px 24px; margin-bottom:12px; }
                .ck-review-label { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(167,201,87,0.5); margin-bottom:8px; }
                .ck-review-val { font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:300; color:rgba(242,232,207,0.6); line-height:1.7; }
                .ck-summary { background:var(--dark2); border-left:1px solid rgba(167,201,87,0.08); padding:56px 40px; position:sticky; top:72px; height:calc(100vh - 72px - 93px); overflow-y:auto; }
                .ck-summary-title { font-family:'Bebas Neue',sans-serif; font-size:28px; color:var(--cream); margin-bottom:32px; letter-spacing:.02em; }
                .ck-summary-items { display:flex; flex-direction:column; gap:16px; margin-bottom:28px; border-bottom:1px solid rgba(167,201,87,0.08); padding-bottom:28px; }
                .ck-summary-item { display:grid; grid-template-columns:56px 1fr auto; gap:14px; align-items:center; }
                .ck-summary-img-wrap { position:relative; }
                .ck-summary-img { width:56px; height:56px; object-fit:cover; background:var(--dark3); display:block; }
                .ck-summary-qty { position:absolute; top:-6px; right:-6px; width:18px; height:18px; background:var(--g3); color:var(--dark); border-radius:50%; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; }
                .ck-summary-name { font-family:'Space Grotesk',sans-serif; font-size:12px; font-weight:500; color:var(--cream); letter-spacing:0; }
                .ck-summary-price { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--g3); letter-spacing:.05em; }
                .ck-summary-rows { display:flex; flex-direction:column; gap:0; }
                .ck-summary-row { display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid rgba(167,201,87,0.06); font-family:'Space Grotesk',sans-serif; font-size:13px; color:rgba(242,232,207,0.4); }
                .ck-summary-total { display:flex; justify-content:space-between; padding:20px 0; font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:600; color:var(--cream); }
                .ck-summary-total-price { font-family:'Bebas Neue',sans-serif; font-size:28px; background:linear-gradient(135deg,var(--g2),var(--g3)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:.05em; }
                @media (max-width:900px) { .ck-body { grid-template-columns:1fr; } .ck-summary { position:static; height:auto; } .ck-left,.ck-summary { padding:40px 24px; } .ck-steps { padding:24px; } }
            `}</style>
        </>
    );
}

export default Checkout;