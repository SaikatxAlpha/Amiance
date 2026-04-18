import { Link, useLocation } from "react-router-dom";

const NAV = [
    { label: "Dashboard", path: "/admin", icon: "⊞" },
    { label: "Products", path: "/admin/products", icon: "◈" },
    { label: "Orders", path: "/admin/orders", icon: "◉" },
    { label: "Customers", path: "/admin/customers", icon: "⊙" },
];

function AdminLayout({ children, title, subtitle }) {
    const location = useLocation();

    return (
        <div className="adm-shell">
            {/* Sidebar */}
            <aside className="adm-sidebar">
                <div className="adm-sidebar-top">
                    <Link to="/" className="adm-logo">AMIANCE</Link>
                    <span className="adm-tag">Admin Panel</span>
                </div>

                <nav className="adm-nav">
                    {NAV.map(n => (
                        <Link
                            key={n.path}
                            to={n.path}
                            className={`adm-nav-link ${location.pathname === n.path ? "adm-nav-link--active" : ""}`}
                        >
                            <span className="adm-nav-icon">{n.icon}</span>
                            <span>{n.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="adm-sidebar-foot">
                    <Link to="/" className="adm-foot-link">← Back to Store</Link>
                </div>
            </aside>

            {/* Main */}
            <div className="adm-main">
                <header className="adm-topbar">
                    <div>
                        <p className="adm-topbar-eyebrow">{subtitle}</p>
                        <h1 className="adm-topbar-title">{title}</h1>
                    </div>
                    <div className="adm-topbar-right">
                        <div className="adm-avatar">A</div>
                    </div>
                </header>
                <div className="adm-content">
                    {children}
                </div>
            </div>

            <style>{`
                .adm-shell { display:grid; grid-template-columns:240px 1fr; min-height:100vh; background:var(--dark); font-family:'Space Grotesk',sans-serif; }
                .adm-sidebar { background:var(--dark2); border-right:1px solid rgba(167,201,87,0.08); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; overflow-y:auto; }
                .adm-sidebar-top { padding:32px 28px 24px; border-bottom:1px solid rgba(167,201,87,0.07); }
                .adm-logo { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:0.22em; background:linear-gradient(135deg,var(--g3) 0%,var(--cream) 60%,var(--g3) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; text-decoration:none; cursor:none; display:block; margin-bottom:6px; }
                .adm-tag { font-size:8px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; color:rgba(167,201,87,0.35); }
                .adm-nav { flex:1; padding:20px 16px; display:flex; flex-direction:column; gap:2px; }
                .adm-nav-link { display:flex; align-items:center; gap:12px; padding:12px 16px; text-decoration:none; color:rgba(242,232,207,0.35); font-size:12px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; cursor:none; transition:color .25s ease,background .25s ease; border-left:2px solid transparent; }
                .adm-nav-link:hover { color:var(--cream); background:rgba(167,201,87,0.04); }
                .adm-nav-link--active { color:var(--g3); background:rgba(167,201,87,0.07); border-left-color:var(--g3); }
                .adm-nav-icon { font-size:16px; flex-shrink:0; }
                .adm-sidebar-foot { padding:20px 28px; border-top:1px solid rgba(167,201,87,0.07); }
                .adm-foot-link { font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(242,232,207,0.2); text-decoration:none; cursor:none; transition:color .2s ease; }
                .adm-foot-link:hover { color:var(--g3); }
                .adm-main { display:flex; flex-direction:column; min-height:100vh; }
                .adm-topbar { display:flex; justify-content:space-between; align-items:center; padding:28px 48px; border-bottom:1px solid rgba(167,201,87,0.08); background:var(--dark2); }
                .adm-topbar-eyebrow { font-size:9px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; color:rgba(167,201,87,0.4); margin-bottom:6px; }
                .adm-topbar-title { font-family:'Bebas Neue',sans-serif; font-size:36px; color:var(--cream); line-height:.9; }
                .adm-topbar-right { display:flex; align-items:center; gap:16px; }
                .adm-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,rgba(56,102,65,0.6),rgba(167,201,87,0.2)); border:1px solid rgba(167,201,87,0.2); display:flex; align-items:center; justify-content:center; font-family:'Bebas Neue',sans-serif; font-size:16px; color:var(--g3); cursor:none; }
                .adm-content { padding:36px 48px; flex:1; }
            `}</style>
        </div>
    );
}

export default AdminLayout;