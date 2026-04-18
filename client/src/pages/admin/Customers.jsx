import { useState } from "react";
import AdminLayout from "./AdminLayout";

const CUSTOMERS = [
    { id: 1, name: "Alex Monroe", email: "alex@example.com", joined: "Jan 2024", orders: 4, spent: 342, status: "Active" },
    { id: 2, name: "Zara Kim", email: "zara@example.com", joined: "Feb 2024", orders: 2, spent: 138, status: "Active" },
    { id: 3, name: "Leo Nour", email: "leo@example.com", joined: "Mar 2024", orders: 1, spent: 49, status: "New" },
    { id: 4, name: "Mira West", email: "mira@example.com", joined: "Dec 2023", orders: 7, spent: 689, status: "VIP" },
    { id: 5, name: "Sam Hayes", email: "sam@example.com", joined: "Mar 2024", orders: 1, spent: 35, status: "New" },
    { id: 6, name: "Jordan Ray", email: "jordan@example.com", joined: "Nov 2023", orders: 9, spent: 902, status: "VIP" },
    { id: 7, name: "Nia Cole", email: "nia@example.com", joined: "Jan 2024", orders: 3, spent: 203, status: "Active" },
    { id: 8, name: "Drew Park", email: "drew@example.com", joined: "Feb 2024", orders: 0, spent: 0, status: "Inactive" },
];

const STATUS_STYLE = {
    VIP: { c: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
    Active: { c: "var(--g3)", bg: "rgba(167,201,87,0.08)" },
    New: { c: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
    Inactive: { c: "rgba(242,232,207,0.2)", bg: "rgba(242,232,207,0.04)" },
};

function Customers() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const filtered = CUSTOMERS
        .filter(c => filterStatus === "All" || c.status === filterStatus)
        .filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <AdminLayout title="Customers" subtitle="Manage">
            {/* Summary */}
            <div className="ac-summary">
                {[
                    { label: "Total Customers", val: CUSTOMERS.length },
                    { label: "VIP Members", val: CUSTOMERS.filter(c => c.status === "VIP").length },
                    { label: "New This Month", val: CUSTOMERS.filter(c => c.status === "New").length },
                    { label: "Total Revenue", val: `$${CUSTOMERS.reduce((a, c) => a + c.spent, 0).toLocaleString()}` },
                ].map(s => (
                    <div key={s.label} className="ac-summary-card">
                        <p className="ac-summary-label">{s.label}</p>
                        <p className="ac-summary-val">{s.val}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="ac-toolbar">
                <div className="ac-filters">
                    {["All", "VIP", "Active", "New", "Inactive"].map(f => (
                        <button key={f} className={`ao-filter-btn ${filterStatus === f ? "ao-filter-btn--active" : ""}`} onClick={() => setFilterStatus(f)}>{f}</button>
                    ))}
                </div>
                <input className="ao-search" placeholder="Search customer..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Table */}
            <div className="ao-table-wrap">
                <table className="ao-table">
                    <thead>
                        <tr>
                            {["Customer", "Joined", "Orders", "Spent", "Status", "Actions"].map(h => (
                                <th key={h} className="ao-th">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => {
                            const st = STATUS_STYLE[c.status];
                            return (
                                <tr key={c.id} className="ao-tr">
                                    <td className="ao-td">
                                        <div className="ac-customer-cell">
                                            <div className="ac-avatar">
                                                {c.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="ao-customer-name">{c.name}</p>
                                                <p className="ao-customer-email">{c.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="ao-td ao-td--muted">{c.joined}</td>
                                    <td className="ao-td ao-td--muted">{c.orders}</td>
                                    <td className="ao-td ao-td--amount">${c.spent}</td>
                                    <td className="ao-td">
                                        <span className="ao-badge" style={{ color: st.c, background: st.bg }}>{c.status}</span>
                                    </td>
                                    <td className="ao-td">
                                        <div className="ao-actions">
                                            <button className="ao-action-btn">Profile</button>
                                            <button className="ao-action-btn">Orders</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="ao-empty">No customers found.</div>}
            </div>

            <style>{`
                .ac-summary { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:24px; }
                .ac-summary-card { background:var(--dark2); border:1px solid rgba(167,201,87,0.07); padding:24px; transition:border-color .3s ease; }
                .ac-summary-card:hover { border-color:rgba(167,201,87,0.18); }
                .ac-summary-label { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(242,232,207,0.3); margin-bottom:10px; }
                .ac-summary-val { font-family:'Bebas Neue',sans-serif; font-size:38px; letter-spacing:.03em; background:linear-gradient(135deg,var(--g3),var(--g4)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1; }
                .ac-toolbar { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:16px; flex-wrap:wrap; }
                .ac-filters { display:flex; gap:4px; flex-wrap:wrap; }
                .ac-customer-cell { display:flex; align-items:center; gap:12px; }
                .ac-avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,rgba(56,102,65,0.5),rgba(167,201,87,0.15)); border:1px solid rgba(167,201,87,0.15); display:flex; align-items:center; justify-content:center; font-family:'Bebas Neue',sans-serif; font-size:13px; color:var(--g3); flex-shrink:0; }
                /* Reuse ao-* styles from admin orders */
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
                .ao-td--muted { font-size:12px; font-weight:300; color:rgba(242,232,207,0.3); }
                .ao-td--amount { font-family:'Bebas Neue',sans-serif; font-size:20px; color:var(--g3); letter-spacing:.05em; }
                .ao-customer-name { font-size:13px; font-weight:500; color:var(--cream); margin-bottom:2px; }
                .ao-customer-email { font-size:10px; font-weight:300; color:rgba(242,232,207,0.3); }
                .ao-badge { font-size:8px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; padding:4px 10px; }
                .ao-actions { display:flex; gap:8px; }
                .ao-action-btn { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(167,201,87,0.5); background:none; border:1px solid rgba(167,201,87,0.12); padding:5px 12px; cursor:none; transition:all .2s ease; }
                .ao-action-btn:hover { color:var(--g3); border-color:rgba(167,201,87,0.35); }
                .ao-empty { padding:60px; text-align:center; font-family:'Space Grotesk',sans-serif; font-size:14px; color:rgba(242,232,207,0.2); }
                @media (max-width:1000px) { .ac-summary { grid-template-columns:1fr 1fr; } }
            `}</style>
        </AdminLayout>
    );
}

export default Customers;