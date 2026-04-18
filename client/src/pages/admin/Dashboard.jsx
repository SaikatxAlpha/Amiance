import AdminLayout from "./AdminLayout";

const STATS = [
    { label: "Total Revenue", value: "$12,480", change: "+18%", up: true },
    { label: "Orders Today", value: "34", change: "+6%", up: true },
    { label: "Active Customers", value: "512", change: "+12%", up: true },
    { label: "Sold Out Items", value: "3", change: "-2", up: false },
];

const RECENT_ORDERS = [
    { id: "AMI-001", customer: "Alex Monroe", product: "Oversized Utility Tee", amount: 29, status: "Delivered" },
    { id: "AMI-002", customer: "Zara Kim", product: "Cargo Wide-Leg Pant", amount: 59, status: "Shipped" },
    { id: "AMI-003", customer: "Leo Nour", product: "Phantom Fleece Hoodie", amount: 49, status: "Processing" },
    { id: "AMI-004", customer: "Mira West", product: "Aged Denim Jacket", amount: 79, status: "Delivered" },
    { id: "AMI-005", customer: "Sam Hayes", product: "Graphic Tee Vol.2", amount: 35, status: "Cancelled" },
];

const TOP_PRODUCTS = [
    { name: "Oversized Utility Tee", sold: 142, revenue: 4118, badge: "BESTSELLER" },
    { name: "Phantom Fleece Hoodie", sold: 98, revenue: 4802, badge: "NEW" },
    { name: "Cargo Wide-Leg Pant", sold: 76, revenue: 4484, badge: null },
    { name: "Graphic Tee Vol.2", sold: 65, revenue: 2275, badge: null },
];

const STATUS_COLOR = {
    Delivered: { c: "var(--g3)", bg: "rgba(167,201,87,0.08)" },
    Shipped: { c: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
    Processing: { c: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
    Cancelled: { c: "var(--red)", bg: "rgba(188,71,73,0.08)" },
};

function Dashboard() {
    return (
        <AdminLayout title="Dashboard" subtitle="Overview">
            {/* Stat cards */}
            <div className="dash-stats">
                {STATS.map(s => (
                    <div key={s.label} className="dash-stat">
                        <p className="dash-stat-label">{s.label}</p>
                        <p className="dash-stat-val">{s.value}</p>
                        <p className={`dash-stat-change ${s.up ? "dash-stat-change--up" : "dash-stat-change--dn"}`}>
                            {s.up ? "↑" : "↓"} {s.change} vs last week
                        </p>
                    </div>
                ))}
            </div>

            {/* Two-col lower */}
            <div className="dash-grid">
                {/* Recent orders */}
                <div className="dash-card">
                    <div className="dash-card-head">
                        <h3 className="dash-card-title">Recent Orders</h3>
                        <a href="/admin/orders" className="dash-card-link">View All →</a>
                    </div>
                    <table className="dash-table">
                        <thead>
                            <tr>
                                {["Order ID", "Customer", "Product", "Amount", "Status"].map(h => (
                                    <th key={h} className="dash-th">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {RECENT_ORDERS.map(o => {
                                const st = STATUS_COLOR[o.status];
                                return (
                                    <tr key={o.id} className="dash-tr">
                                        <td className="dash-td dash-td--id">{o.id}</td>
                                        <td className="dash-td">{o.customer}</td>
                                        <td className="dash-td dash-td--muted">{o.product}</td>
                                        <td className="dash-td dash-td--green">${o.amount}</td>
                                        <td className="dash-td">
                                            <span className="dash-badge" style={{ color: st.c, background: st.bg }}>{o.status}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Top products */}
                <div className="dash-card">
                    <div className="dash-card-head">
                        <h3 className="dash-card-title">Top Products</h3>
                        <a href="/admin/products" className="dash-card-link">Manage →</a>
                    </div>
                    <div className="dash-product-list">
                        {TOP_PRODUCTS.map((p, i) => (
                            <div key={p.name} className="dash-product-row">
                                <span className="dash-product-rank">0{i + 1}</span>
                                <div className="dash-product-info">
                                    <p className="dash-product-name">{p.name}</p>
                                    <p className="dash-product-meta">{p.sold} sold · ${p.revenue.toLocaleString()} rev.</p>
                                </div>
                                {p.badge && <span className="dash-product-badge">{p.badge}</span>}
                                <div className="dash-product-bar-wrap">
                                    <div className="dash-product-bar" style={{ width: `${(p.sold / 142) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .dash-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:24px; }
                .dash-stat { background:var(--dark2); border:1px solid rgba(167,201,87,0.07); padding:28px 24px; position:relative; overflow:hidden; transition:border-color .3s ease; }
                .dash-stat:hover { border-color:rgba(167,201,87,0.18); }
                .dash-stat::after { content:''; position:absolute; inset:0; background:radial-gradient(circle at 80% 20%,rgba(167,201,87,0.04),transparent 60%); pointer-events:none; }
                .dash-stat-label { font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(242,232,207,0.3); margin-bottom:12px; }
                .dash-stat-val { font-family:'Bebas Neue',sans-serif; font-size:42px; letter-spacing:.03em; background:linear-gradient(135deg,var(--g3),var(--g4)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1; margin-bottom:8px; }
                .dash-stat-change { font-size:11px; font-weight:300; color:rgba(242,232,207,0.3); }
                .dash-stat-change--up { color:rgba(167,201,87,0.6); }
                .dash-stat-change--dn { color:rgba(188,71,73,0.6); }
                .dash-grid { display:grid; grid-template-columns:1.4fr 1fr; gap:16px; }
                .dash-card { background:var(--dark2); border:1px solid rgba(167,201,87,0.07); padding:28px; }
                .dash-card-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
                .dash-card-title { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--cream); letter-spacing:.02em; }
                .dash-card-link { font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(167,201,87,0.45); text-decoration:none; cursor:none; transition:color .2s ease; }
                .dash-card-link:hover { color:var(--g3); }
                .dash-table { width:100%; border-collapse:collapse; }
                .dash-th { font-size:8px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(242,232,207,0.2); padding:0 12px 14px 0; text-align:left; }
                .dash-tr { border-top:1px solid rgba(167,201,87,0.05); transition:background .2s ease; }
                .dash-tr:hover { background:rgba(167,201,87,0.03); }
                .dash-td { font-size:12px; font-weight:300; color:rgba(242,232,207,0.5); padding:12px 12px 12px 0; }
                .dash-td--id { font-weight:600; color:var(--cream); font-size:11px; letter-spacing:.04em; }
                .dash-td--muted { color:rgba(242,232,207,0.3); }
                .dash-td--green { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--g3); letter-spacing:.05em; }
                .dash-badge { font-size:8px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; padding:4px 10px; }
                .dash-product-list { display:flex; flex-direction:column; gap:20px; }
                .dash-product-row { display:grid; grid-template-columns:24px 1fr auto; gap:12px; align-items:center; position:relative; }
                .dash-product-rank { font-family:'Bebas Neue',sans-serif; font-size:18px; color:rgba(167,201,87,0.25); letter-spacing:.05em; }
                .dash-product-name { font-size:13px; font-weight:600; color:var(--cream); margin-bottom:2px; letter-spacing:0; }
                .dash-product-meta { font-size:10px; font-weight:300; color:rgba(242,232,207,0.3); }
                .dash-product-badge { font-size:7px; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; color:var(--g3); background:rgba(167,201,87,0.08); padding:3px 8px; }
                .dash-product-bar-wrap { position:absolute; bottom:-8px; left:36px; right:0; height:1px; background:rgba(167,201,87,0.06); }
                .dash-product-bar { height:100%; background:linear-gradient(90deg,var(--g2),var(--g3)); transition:width .6s ease; }
                @media (max-width:1100px) { .dash-stats { grid-template-columns:1fr 1fr; } .dash-grid { grid-template-columns:1fr; } }
            `}</style>
        </AdminLayout>
    );
}

export default Dashboard;