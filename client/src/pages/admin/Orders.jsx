import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { ordersAPI } from "../../services/api";

const FILTERS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLE = {
    Delivered: { c: "var(--g3)", bg: "rgba(167,201,87,0.08)", border: "rgba(167,201,87,0.2)" },
    Shipped: { c: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
    Processing: { c: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
    Cancelled: { c: "var(--red)", bg: "rgba(188,71,73,0.08)", border: "rgba(188,71,73,0.2)" },
};

const PAYMENT_LABEL = { cod: "💵 COD", card: "💳 Card", upi: "⚡ UPI" };

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        ordersAPI.getAll()
            .then(d => setOrders(d.orders || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const data = await ordersAPI.updateStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o._id === orderId ? data.order : o));
        } catch (err) {
            alert(err.message || "Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = orders
        .filter(o => filter === "All" || o.status === filter)
        .filter(o => {
            const s = search.toLowerCase();
            return (
                o._id.toLowerCase().includes(s) ||
                (o.user?.name || "").toLowerCase().includes(s) ||
                (o.shippingAddress?.name || "").toLowerCase().includes(s)
            );
        });

    return (
        <AdminLayout title="Orders" subtitle="Manage">
            <div className="ao-toolbar">
                <div className="ao-filters">
                    {FILTERS.map(f => (
                        <button key={f}
                            className={`ao-filter-btn ${filter === f ? "ao-filter-btn--active" : ""}`}
                            onClick={() => setFilter(f)}>
                            {f}
                            {f !== "All" && (
                                <span style={{ marginLeft: "6px", opacity: 0.6, fontSize: "9px" }}>
                                    ({orders.filter(o => o.status === f).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <input className="ao-search" placeholder="Search by ID or customer..."
                    value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {loading ? (
                <div style={{ padding: "60px", textAlign: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: "24px", color: "rgba(167,201,87,0.3)", letterSpacing: "0.2em" }}>
                    LOADING ORDERS...
                </div>
            ) : (
                <div className="ao-table-wrap">
                    <table className="ao-table">
                        <thead>
                            <tr>
                                {["Order ID", "Customer", "Date", "Items", "Amount", "Payment", "Status", "Actions"].map(h => (
                                    <th key={h} className="ao-th">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(o => {
                                const st = STATUS_STYLE[o.status] || STATUS_STYLE.Processing;
                                const name = o.user?.name || o.shippingAddress?.name || "Guest";
                                const email = o.user?.email || "—";
                                return (
                                    <tr key={o._id} className="ao-tr">
                                        <td className="ao-td ao-td--id">AMI-{o._id.slice(-6).toUpperCase()}</td>
                                        <td className="ao-td">
                                            <p className="ao-customer-name">{name}</p>
                                            <p className="ao-customer-email">{email}</p>
                                        </td>
                                        <td className="ao-td ao-td--muted">
                                            {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="ao-td ao-td--muted">{o.items?.length || 0}</td>
                                        <td className="ao-td ao-td--amount">₹{o.totalPrice.toLocaleString("en-IN")}</td>
                                        <td className="ao-td" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "10px", color: "rgba(242,232,207,0.45)" }}>
                                            {PAYMENT_LABEL[o.paymentMethod] || o.paymentMethod}
                                            {o.paymentMethod === "cod" && !o.isPaid && (
                                                <span style={{ display: "block", color: "#fbbf24", fontSize: "8px", marginTop: "2px", fontWeight: 700, letterSpacing: "0.1em" }}>UNPAID</span>
                                            )}
                                        </td>
                                        <td className="ao-td">
                                            <span className="ao-badge" style={{ color: st.c, background: st.bg, border: `1px solid ${st.border}` }}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="ao-td">
                                            <select
                                                value={o.status}
                                                onChange={e => handleStatusChange(o._id, e.target.value)}
                                                disabled={updatingId === o._id}
                                                style={{
                                                    background: "var(--dark)", border: "1px solid rgba(167,201,87,0.15)",
                                                    color: "rgba(242,232,207,0.6)", fontFamily: "'Space Grotesk',sans-serif",
                                                    fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em",
                                                    padding: "6px 10px", cursor: "pointer", outline: "none",
                                                    opacity: updatingId === o._id ? 0.5 : 1,
                                                }}>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="ao-empty">
                            {orders.length === 0 ? "No orders yet." : "No orders match your filters."}
                        </div>
                    )}
                </div>
            )}

            <style>{`
        .ao-toolbar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:20px;flex-wrap:wrap}
        .ao-filters{display:flex;gap:4px;flex-wrap:wrap}
        .ao-filter-btn{padding:8px 18px;border:1px solid rgba(167,201,87,0.12);background:transparent;color:rgba(242,232,207,0.35);font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;cursor:none;transition:all .25s ease}
        .ao-filter-btn:hover{color:var(--cream);border-color:rgba(167,201,87,0.3)}
        .ao-filter-btn--active{background:var(--g3);border-color:var(--g3);color:var(--dark)}
        .ao-search{background:var(--dark2);border:1px solid rgba(167,201,87,0.12);padding:10px 18px;color:var(--cream);font-family:'Space Grotesk',sans-serif;font-size:13px;font-weight:300;outline:none;width:260px;transition:border-color .3s ease}
        .ao-search::placeholder{color:rgba(242,232,207,0.2)}
        .ao-search:focus{border-color:rgba(167,201,87,0.3)}
        .ao-table-wrap{background:var(--dark2);border:1px solid rgba(167,201,87,0.07);overflow-x:auto}
        .ao-table{width:100%;border-collapse:collapse}
        .ao-th{font-family:'Space Grotesk',sans-serif;font-size:8px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(242,232,207,0.2);padding:16px 14px;text-align:left;border-bottom:1px solid rgba(167,201,87,0.06);white-space:nowrap}
        .ao-tr{border-bottom:1px solid rgba(167,201,87,0.04);transition:background .2s ease}
        .ao-tr:hover{background:rgba(167,201,87,0.025)}
        .ao-td{font-family:'Space Grotesk',sans-serif;padding:16px 14px;vertical-align:middle}
        .ao-td--id{font-size:11px;font-weight:600;color:var(--cream);letter-spacing:.04em;white-space:nowrap}
        .ao-td--muted{font-size:12px;font-weight:300;color:rgba(242,232,207,0.3)}
        .ao-td--amount{font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--g3);letter-spacing:.05em}
        .ao-customer-name{font-size:13px;font-weight:500;color:var(--cream);margin-bottom:2px}
        .ao-customer-email{font-size:10px;font-weight:300;color:rgba(242,232,207,0.3)}
        .ao-badge{font-size:8px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;padding:4px 10px;white-space:nowrap}
        .ao-empty{padding:60px;text-align:center;font-family:'Space Grotesk',sans-serif;font-size:14px;color:rgba(242,232,207,0.2)}
      `}</style>
        </AdminLayout>
    );
}

export default AdminOrders;