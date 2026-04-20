import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { usersAPI } from "../../services/api";

const STATUS_STYLE = {
    Admin: { c: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
    Verified: { c: "var(--g3)", bg: "rgba(167,201,87,0.08)" },
    Unverified: { c: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
};

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        usersAPI.getAll()
            .then(d => setCustomers(d.users || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const getStatus = (u) => u.role === "admin" ? "Admin" : u.isVerified ? "Verified" : "Unverified";

    const filtered = customers
        .filter(c => filterStatus === "All" || getStatus(c) === filterStatus)
        .filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
        );

    const SUMMARY = [
        { label: "Total Customers", val: customers.length },
        { label: "Admins", val: customers.filter(c => c.role === "admin").length },
        { label: "Verified", val: customers.filter(c => c.isVerified).length },
        { label: "Unverified", val: customers.filter(c => !c.isVerified).length },
    ];

    return (
        <AdminLayout title="Customers" subtitle="Manage">
            <div className="ac-summary">
                {SUMMARY.map(s => (
                    <div key={s.label} className="ac-summary-card">
                        <p className="ac-summary-label">{s.label}</p>
                        <p className="ac-summary-val">{s.val}</p>
                    </div>
                ))}
            </div>

            <div className="ac-toolbar">
                <div className="ac-filters">
                    {["All", "Admin", "Verified", "Unverified"].map(f => (
                        <button key={f}
                            className={`ao-filter-btn ${filterStatus === f ? "ao-filter-btn--active" : ""}`}
                            onClick={() => setFilterStatus(f)}>{f}</button>
                    ))}
                </div>
                <input className="ao-search" placeholder="Search customer..."
                    value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {loading ? (
                <div style={{ padding: "60px", textAlign: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: "24px", color: "rgba(167,201,87,0.3)", letterSpacing: "0.2em" }}>
                    LOADING CUSTOMERS...
                </div>
            ) : (
                <div className="ao-table-wrap">
                    <table className="ao-table">
                        <thead>
                            <tr>
                                {["Customer", "Joined", "Phone", "Status", "Actions"].map(h => (
                                    <th key={h} className="ao-th">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => {
                                const status = getStatus(c);
                                const st = STATUS_STYLE[status];
                                const joined = new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                                return (
                                    <tr key={c._id} className="ao-tr">
                                        <td className="ao-td">
                                            <div className="ac-customer-cell">
                                                <div className="ac-avatar">{c.name.split(" ").map(n => n[0]).join("")}</div>
                                                <div>
                                                    <p className="ao-customer-name">{c.name}</p>
                                                    <p className="ao-customer-email">{c.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="ao-td ao-td--muted">{joined}</td>
                                        <td className="ao-td ao-td--muted">{c.phone || "—"}</td>
                                        <td className="ao-td">
                                            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                                <span className="ao-badge" style={{ color: st.c, background: st.bg }}>{status}</span>
                                                {!c.isVerified && c.role !== "admin" && (
                                                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "8px", color: "rgba(242,232,207,0.25)", letterSpacing: "0.1em" }}>
                                                        Email not verified
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="ao-td">
                                            <div className="ao-actions">
                                                <button className="ao-action-btn">View</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="ao-empty">
                            {customers.length === 0 ? "No customers yet." : "No customers match your search."}
                        </div>
                    )}
                </div>
            )}

            <style>{`
        .ac-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
        .ac-summary-card{background:var(--dark2);border:1px solid rgba(167,201,87,0.07);padding:24px;transition:border-color .3s ease}
        .ac-summary-card:hover{border-color:rgba(167,201,87,0.18)}
        .ac-summary-label{font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(242,232,207,0.3);margin-bottom:10px}
        .ac-summary-val{font-family:'Bebas Neue',sans-serif;font-size:38px;letter-spacing:.03em;background:linear-gradient(135deg,var(--g3),var(--g4));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
        .ac-toolbar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:16px;flex-wrap:wrap}
        .ac-filters{display:flex;gap:4px;flex-wrap:wrap}
        .ac-customer-cell{display:flex;align-items:center;gap:12px}
        .ac-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,rgba(56,102,65,0.5),rgba(167,201,87,0.15));border:1px solid rgba(167,201,87,0.15);display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:13px;color:var(--g3);flex-shrink:0}
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
        .ao-td--muted{font-size:12px;font-weight:300;color:rgba(242,232,207,0.3)}
        .ao-customer-name{font-size:13px;font-weight:500;color:var(--cream);margin-bottom:2px}
        .ao-customer-email{font-size:10px;font-weight:300;color:rgba(242,232,207,0.3)}
        .ao-badge{font-size:8px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;padding:4px 10px}
        .ao-actions{display:flex;gap:8px}
        .ao-action-btn{font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(167,201,87,0.5);background:none;border:1px solid rgba(167,201,87,0.12);padding:5px 12px;cursor:none;transition:all .2s ease}
        .ao-action-btn:hover{color:var(--g3);border-color:rgba(167,201,87,0.35)}
        .ao-empty{padding:60px;text-align:center;font-family:'Space Grotesk',sans-serif;font-size:14px;color:rgba(242,232,207,0.2)}
        @media(max-width:1000px){.ac-summary{grid-template-columns:1fr 1fr}}
      `}</style>
        </AdminLayout>
    );
}

export default Customers;