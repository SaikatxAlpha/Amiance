import { useState } from "react";
import AdminLayout from "./AdminLayout";

const ALL_ORDERS = [
    { id: "AMI-20240312-001", customer: "Alex Monroe", email: "alex@ex.com", items: 3, amount: 108, status: "Delivered", date: "12 Mar 2024" },
    { id: "AMI-20240311-002", customer: "Zara Kim", email: "zara@ex.com", items: 1, amount: 59, status: "Shipped", date: "11 Mar 2024" },
    { id: "AMI-20240310-003", customer: "Leo Nour", email: "leo@ex.com", items: 2, amount: 78, status: "Processing", date: "10 Mar 2024" },
    { id: "AMI-20240309-004", customer: "Mira West", email: "mira@ex.com", items: 1, amount: 79, status: "Delivered", date: "09 Mar 2024" },
    { id: "AMI-20240308-005", customer: "Sam Hayes", email: "sam@ex.com", items: 1, amount: 35, status: "Cancelled", date: "08 Mar 2024" },
    { id: "AMI-20240307-006", customer: "Jordan Ray", email: "jordan@ex.com", items: 4, amount: 192, status: "Delivered", date: "07 Mar 2024" },
    { id: "AMI-20240306-007", customer: "Nia Cole", email: "nia@ex.com", items: 2, amount: 84, status: "Shipped", date: "06 Mar 2024" },
];

const FILTERS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLE = {
    Delivered: { c: "var(--g3)", bg: "rgba(167,201,87,0.08)", border: "rgba(167,201,87,0.2)" },
    Shipped: { c: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
    Processing: { c: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
    Cancelled: { c: "var(--red)", bg: "rgba(188,71,73,0.08)", border: "rgba(188,71,73,0.2)" },
};

function AdminOrders() {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    const filtered = ALL_ORDERS
        .filter(o => filter === "All" || o.status === filter)
        .filter(o =>
            o.customer.toLowerCase().includes(search.toLowerCase()) ||
            o.id.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <AdminLayout title="Orders" subtitle="Manage">
            {/* Toolbar */}
            <div className="ao-toolbar">
                <div className="ao-filters">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            className={`ao-filter-btn ${filter === f ? "ao-filter-btn--active" : ""}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <input
                    className="ao-search"
                    placeholder="Search by ID or customer..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="ao-table-wrap">
                <table className="ao-table">
                    <thead>
                        <tr>
                            {["Order ID", "Customer", "Date", "Items", "Amount", "Status", "Actions"].map(h => (
                                <th key={h} className="ao-th">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(o => {
                            const st = STATUS_STYLE[o.status];
                            return (
                                <tr key={o.id} className="ao-tr">
                                    <td className="ao-td ao-td--id">{o.id}</td>
                                    <td className="ao-td">
                                        <p className="ao-customer-name">{o.customer}</p>
                                        <p className="ao-customer-email">{o.email}</p>
                                    </td>
                                    <td className="ao-td ao-td--muted">{o.date}</td>
                                    <td className="ao-td ao-td--muted">{o.items}</td>
                                    <td className="ao-td ao-td--amount">${o.amount.toFixed(2)}</td>
                                    <td className="ao-td">
                                        <span className="ao-badge" style={{ color: st.c, background: st.bg, border: `1px solid ${st.border}` }}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="ao-td">
                                        <div className="ao-actions">
                                            <button className="ao-action-btn">View</button>
                                            <button className="ao-action-btn">Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="ao-empty">No orders match your filters.</div>
                )}
            </div>

            <style>{`
                .ao-toolbar { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:20px; flex-wrap:wrap; }
                .ao-filters { display:flex; gap:4px; }
                .ao-filter-btn { padding:8px 18px; border:1px solid rgba(167,201,87,0.12); background:transparent; color:rgba(242,232,207,0.35); font-family:'Space Grotesk',sans-serif; font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; cursor:none; transition:all .25s ease; }
                .ao-filter-btn:hover { color:var(--cream); border-color:rgba(167,201,87,0.3); }
                .ao-filter-btn--active { background:var(--g3); border-color:var(--g3); color:var(--dark); }
                .ao-search { background:var(--dark2); border:1px solid rgba(167,201,87,0.12); padding:10px 18px; color:var(--cream); font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:300; outline:none; width:260px; transition:border-color .3s ease; }
                .ao-search::placeholder { color:rgba(242,232,207,0.2); }
                .ao-search:focus { border-color:rgba(167,201,87,0.3); }
                .ao-table-wrap { background:var(--dark2); border:1px solid rgba(167,201,87,0.07); overflow-x:auto; }
                .ao-table { width:100%; border-collapse:collapse; }
                .ao-th { font-family:'Space Grotesk',sans-serif; font-size:8px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(242,232,207,0.2); padding:16px 14px; text-align:left; border-bottom:1px solid rgba(167,201,87,0.06); white-space:nowrap; }
                .ao-tr { border-bottom:1px solid rgba(167,201,87,0.04); transition:background .2s ease; }
                .ao-tr:hover { background:rgba(167,201,87,0.025); }
                .ao-td { font-family:'Space Grotesk',sans-serif; padding:16px 14px; vertical-align:middle; }
                .ao-td--id { font-size:11px; font-weight:600; color:var(--cream); letter-spacing:.04em; white-space:nowrap; }
                .ao-td--muted { font-size:12px; font-weight:300; color:rgba(242,232,207,0.3); }
                .ao-td--amount { font-family:'Bebas Neue',sans-serif; font-size:20px; color:var(--g3); letter-spacing:.05em; }
                .ao-customer-name { font-size:13px; font-weight:500; color:var(--cream); margin-bottom:2px; }
                .ao-customer-email { font-size:10px; font-weight:300; color:rgba(242,232,207,0.3); }
                .ao-badge { font-size:8px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; padding:4px 10px; white-space:nowrap; }
                .ao-actions { display:flex; gap:8px; }
                .ao-action-btn { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(167,201,87,0.5); background:none; border:1px solid rgba(167,201,87,0.12); padding:5px 12px; cursor:none; transition:all .2s ease; }
                .ao-action-btn:hover { color:var(--g3); border-color:rgba(167,201,87,0.35); }
                .ao-empty { padding:60px; text-align:center; font-family:'Space Grotesk',sans-serif; font-size:14px; color:rgba(242,232,207,0.2); }
            `}</style>
        </AdminLayout>
    );
}

export default AdminOrders;