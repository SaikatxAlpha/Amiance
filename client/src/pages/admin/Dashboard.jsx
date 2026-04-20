import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { ordersAPI, productsAPI, usersAPI } from "../../services/api";

const STATUS_COLOR = {
    Delivered: { c: "var(--g3)", bg: "rgba(167,201,87,0.08)" },
    Shipped: { c: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
    Processing: { c: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
    Cancelled: { c: "var(--red)", bg: "rgba(188,71,73,0.08)" },
};

const PAYMENT_LABEL = { cod: "COD", card: "Card", upi: "UPI" };

function Dashboard() {
    const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0, products: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [ordersData, productsData] = await Promise.allSettled([
                    ordersAPI.getAll(),
                    productsAPI.getAll(),
                ]);

                const orders = ordersData.status === "fulfilled" ? ordersData.value.orders || [] : [];
                const products = productsData.status === "fulfilled" ? productsData.value.products || [] : [];

                const revenue = orders
                    .filter(o => o.isPaid)
                    .reduce((sum, o) => sum + o.totalPrice, 0);

                setStats({
                    revenue,
                    orders: orders.length,
                    products: products.length,
                    customers: new Set(orders.map(o => o.user?._id || o.user)).size,
                });
                setRecentOrders(orders.slice(0, 7));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const STAT_CARDS = [
        { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: "₹", up: true },
        { label: "Total Orders", value: stats.orders, icon: "◉", up: true },
        { label: "Unique Customers", value: stats.customers, icon: "⊙", up: true },
        { label: "Active Products", value: stats.products, icon: "◈", up: true },
    ];

    return (
        <AdminLayout title="Dashboard" subtitle="Overview">
            {loading ? (
                <div style={{ padding: "60px 0", textAlign: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: "28px", color: "rgba(167,201,87,0.3)", letterSpacing: "0.2em" }}>
                    LOADING DATA...
                </div>
            ) : (
                <>
                    {/* Stat cards */}
                    <div className="dash-stats">
                        {STAT_CARDS.map(s => (
                            <div key={s.label} className="dash-stat">
                                <p className="dash-stat-label">{s.label}</p>
                                <p className="dash-stat-val">{s.value}</p>
                                <p className="dash-stat-change dash-stat-change--up">Live data from MongoDB</p>
                            </div>
                        ))}
                    </div>

                    {/* Recent orders */}
                    <div className="dash-card" style={{ marginTop: "24px" }}>
                        <div className="dash-card-head">
                            <h3 className="dash-card-title">Recent Orders</h3>
                            <a href="/admin/orders" className="dash-card-link">View All →</a>
                        </div>
                        {recentOrders.length === 0 ? (
                            <div style={{ padding: "40px", textAlign: "center", color: "rgba(242,232,207,0.2)", fontFamily: "'Space Grotesk',sans-serif", fontSize: "14px" }}>
                                No orders yet. Share the site!
                            </div>
                        ) : (
                            <table className="dash-table">
                                <thead>
                                    <tr>
                                        {["Order ID", "Customer", "Amount", "Method", "Status"].map(h => (
                                            <th key={h} className="dash-th">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(o => {
                                        const st = STATUS_COLOR[o.status] || STATUS_COLOR.Processing;
                                        const customerName = o.user?.name || o.shippingAddress?.name || "Guest";
                                        return (
                                            <tr key={o._id} className="dash-tr">
                                                <td className="dash-td dash-td--id">AMI-{o._id.slice(-6).toUpperCase()}</td>
                                                <td className="dash-td">{customerName}</td>
                                                <td className="dash-td dash-td--green">₹{o.totalPrice.toLocaleString("en-IN")}</td>
                                                <td className="dash-td" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "10px", color: "rgba(242,232,207,0.4)" }}>
                                                    {PAYMENT_LABEL[o.paymentMethod] || o.paymentMethod}
                                                    {o.paymentMethod === "cod" && !o.isPaid && (
                                                        <span style={{ color: "#fbbf24", marginLeft: "6px", fontSize: "8px" }}>PENDING</span>
                                                    )}
                                                </td>
                                                <td className="dash-td">
                                                    <span className="dash-badge" style={{ color: st.c, background: st.bg }}>{o.status}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}

            <style>{`
        .dash-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
        .dash-stat{background:var(--dark2);border:1px solid rgba(167,201,87,0.07);padding:28px 24px;position:relative;overflow:hidden;transition:border-color .3s ease}
        .dash-stat:hover{border-color:rgba(167,201,87,0.18)}
        .dash-stat-label{font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(242,232,207,0.3);margin-bottom:12px}
        .dash-stat-val{font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:.03em;background:linear-gradient(135deg,var(--g3),var(--g4));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:8px}
        .dash-stat-change{font-size:10px;font-weight:300;color:rgba(242,232,207,0.25)}
        .dash-stat-change--up{color:rgba(167,201,87,0.5)}
        .dash-card{background:var(--dark2);border:1px solid rgba(167,201,87,0.07);padding:28px}
        .dash-card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        .dash-card-title{font-family:'Bebas Neue',sans-serif;font-size:22px;color:var(--cream);letter-spacing:.02em}
        .dash-card-link{font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(167,201,87,0.45);text-decoration:none;cursor:none;transition:color .2s ease}
        .dash-card-link:hover{color:var(--g3)}
        .dash-table{width:100%;border-collapse:collapse}
        .dash-th{font-size:8px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(242,232,207,0.2);padding:0 12px 14px 0;text-align:left}
        .dash-tr{border-top:1px solid rgba(167,201,87,0.05);transition:background .2s ease}
        .dash-tr:hover{background:rgba(167,201,87,0.03)}
        .dash-td{font-size:12px;font-weight:300;color:rgba(242,232,207,0.5);padding:12px 12px 12px 0;font-family:'Space Grotesk',sans-serif}
        .dash-td--id{font-weight:600;color:var(--cream);font-size:11px;letter-spacing:.04em}
        .dash-td--green{font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--g3);letter-spacing:.05em}
        .dash-badge{font-size:8px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;padding:4px 10px}
        @media(max-width:1100px){.dash-stats{grid-template-columns:1fr 1fr}}
      `}</style>
        </AdminLayout>
    );
}

export default Dashboard;