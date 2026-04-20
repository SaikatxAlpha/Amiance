import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import { ordersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const STATUS_STYLE = {
    Delivered: { color: "var(--g3)", bg: "rgba(167,201,87,0.08)", border: "rgba(167,201,87,0.2)" },
    Shipped: { color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
    Cancelled: { color: "var(--red)", bg: "rgba(188,71,73,0.08)", border: "rgba(188,71,73,0.2)" },
    Processing: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
};

const PAYMENT_LABEL = { cod: "Cash on Delivery", card: "Card", upi: "UPI" };

function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) { setLoading(false); return; }
            try {
                const data = await ordersAPI.getMyOrders();
                setOrders(data.orders || []);
            } catch (err) {
                setError(err.message || "Could not load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (!user) {
        return (
            <>
                <Navbar />
                <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", padding: "120px 24px", background: "var(--dark)" }}>
                    <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "56px", color: "var(--cream)" }}>Sign In Required</h2>
                    <p style={{ color: "var(--text-muted)", fontFamily: "'Space Grotesk',sans-serif" }}>
                        Please sign in to view your orders.
                    </p>
                    <Link to="/login"><button className="btn-primary"><span>Sign In</span></button></Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="ord-page">
                <div className="ord-header">
                    <div>
                        <p className="ord-eyebrow">Your Purchases</p>
                        <h1 className="ord-title">Order History</h1>
                    </div>
                    <Link to="/shop">
                        <button className="btn-ghost">Continue Shopping <span className="arrow" /></button>
                    </Link>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "80px 0" }}>
                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "32px", color: "rgba(167,201,87,0.4)", letterSpacing: "0.2em" }}>
                            LOADING...
                        </div>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: "center", padding: "80px 0" }}>
                        <p style={{ color: "var(--red)", fontFamily: "'Space Grotesk',sans-serif" }}>{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="ord-empty">
                        <span className="ord-empty-icon">📦</span>
                        <h2>No Orders Yet</h2>
                        <p>Your first drop is waiting. Go get it.</p>
                        <Link to="/shop"><button className="btn-primary"><span>Shop Now</span></button></Link>
                    </div>
                ) : (
                    <div className="ord-list">
                        {orders.map((order) => {
                            const st = STATUS_STYLE[order.status] || STATUS_STYLE.Processing;
                            return (
                                <div key={order._id} className="ord-card">
                                    <div className="ord-card-head">
                                        <div className="ord-card-meta">
                                            <span className="ord-id">
                                                AMI-{order._id.slice(-6).toUpperCase()}
                                            </span>
                                            <span className="ord-date">
                                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit", month: "short", year: "numeric"
                                                })}
                                                {" · "}
                                                {PAYMENT_LABEL[order.paymentMethod] || order.paymentMethod}
                                                {order.paymentMethod === "cod" && !order.isPaid && (
                                                    <span style={{ color: "#fbbf24", marginLeft: "8px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em" }}>
                                                        · PAYMENT PENDING
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="ord-card-right">
                                            <span className="ord-status" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
                                                {order.status}
                                            </span>
                                            <span className="ord-total">
                                                ₹{order.totalPrice.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="ord-items">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="ord-item">
                                                <img className="ord-item-img" src={item.image} alt={item.name} />
                                                <div className="ord-item-info">
                                                    <p className="ord-item-name">{item.name}</p>
                                                    <p className="ord-item-meta">
                                                        {item.size && `Size: ${item.size} · `}Qty: {item.qty} · ₹{item.price.toLocaleString("en-IN")} each
                                                    </p>
                                                </div>
                                                <p className="ord-item-total">
                                                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="ord-card-foot">
                                        {order.status === "Shipped" && (
                                            <button className="ord-track-btn">Track Shipment →</button>
                                        )}
                                        {order.status === "Delivered" && (
                                            <button className="ord-track-btn">Leave a Review →</button>
                                        )}
                                        {order.status === "Processing" && order.paymentMethod === "cod" && (
                                            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "11px", color: "#fbbf24", fontWeight: 600 }}>
                                                💵 Keep ₹{order.totalPrice.toLocaleString("en-IN")} ready for delivery
                                            </span>
                                        )}
                                        <button className="ord-detail-btn">View Details</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <style>{`
        .ord-page { padding:120px 60px 80px;background:var(--dark);min-height:100vh;animation:fade-in .4s ease both; }
        .ord-header { display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px;border-bottom:1px solid rgba(167,201,87,0.08);padding-bottom:32px; }
        .ord-eyebrow { font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:var(--g3);margin-bottom:12px; }
        .ord-title { font-family:'Bebas Neue',sans-serif;font-size:clamp(48px,6vw,84px);color:var(--cream);line-height:.9; }
        .ord-empty { text-align:center;padding:100px 0;display:flex;flex-direction:column;align-items:center;gap:20px; }
        .ord-empty-icon { font-size:60px;animation:float 3s ease-in-out infinite; }
        .ord-empty h2 { font-family:'Bebas Neue',sans-serif;font-size:44px;color:var(--cream); }
        .ord-empty p { font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:300;color:var(--text-dim);margin-bottom:16px; }
        .ord-list { display:flex;flex-direction:column;gap:16px; }
        .ord-card { background:var(--dark2);border:1px solid rgba(167,201,87,0.07);overflow:hidden;transition:border-color .3s ease;animation:fadeSlideUp .5s ease both; }
        .ord-card:hover { border-color:rgba(167,201,87,0.18); }
        .ord-card-head { display:flex;justify-content:space-between;align-items:center;padding:24px 28px;border-bottom:1px solid rgba(167,201,87,0.06); }
        .ord-card-meta { display:flex;flex-direction:column;gap:4px; }
        .ord-id { font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;color:var(--cream);letter-spacing:0.06em; }
        .ord-date { font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:300;color:rgba(242,232,207,0.3); }
        .ord-card-right { display:flex;align-items:center;gap:20px; }
        .ord-status { font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;padding:6px 12px; }
        .ord-total { font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:.05em;background:linear-gradient(90deg,var(--g2),var(--g3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .ord-items { padding:20px 28px;display:flex;flex-direction:column;gap:16px; }
        .ord-item { display:grid;grid-template-columns:64px 1fr auto;gap:18px;align-items:center; }
        .ord-item-img { width:64px;height:64px;object-fit:cover;background:var(--dark3); }
        .ord-item-name { font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:600;color:var(--cream);margin-bottom:4px;letter-spacing:0; }
        .ord-item-meta { font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:300;color:rgba(242,232,207,0.35); }
        .ord-item-total { font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:.05em;color:var(--g3); }
        .ord-card-foot { padding:16px 28px 20px;border-top:1px solid rgba(167,201,87,0.06);display:flex;gap:16px;align-items:center; }
        .ord-track-btn { font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--g3);background:none;border:none;cursor:none;padding:0;transition:color .2s ease; }
        .ord-track-btn:hover { color:var(--g4); }
        .ord-detail-btn { font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(242,232,207,0.25);background:none;border:none;cursor:none;padding:0;margin-left:auto;transition:color .2s ease; }
        .ord-detail-btn:hover { color:var(--cream); }
        @media (max-width:768px) { .ord-page{padding:100px 24px 60px} .ord-header{flex-direction:column;align-items:flex-start;gap:20px} .ord-card-head{flex-direction:column;align-items:flex-start;gap:14px} }
      `}</style>
        </>
    );
}

export default Orders;