import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { products } from "../../pages/Shop";

function AdminProduct() {
    const [items, setItems] = useState(products);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", price: "", category: "tops", badge: "", description: "" });

    const filtered = items.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    const openEdit = (product) => {
        setEditing(product.id);
        setForm({ name: product.name, price: product.price, category: product.category, badge: product.badge || "", description: product.description || "" });
        setShowModal(true);
    };

    const openNew = () => {
        setEditing(null);
        setForm({ name: "", price: "", category: "tops", badge: "", description: "" });
        setShowModal(true);
    };

    const handleSave = () => {
        if (editing) {
            setItems(prev => prev.map(p => p.id === editing ? { ...p, ...form, price: Number(form.price) } : p));
        } else {
            setItems(prev => [...prev, { ...form, id: Date.now(), price: Number(form.price), tag: `Drop 0${prev.length + 1}`, image: prev[0].image, colorHex: "#a7c957" }]);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => { setItems(prev => prev.filter(p => p.id !== id)); };

    const BADGE_COLORS = { BESTSELLER: { c: "var(--cream)", bg: "rgba(242,232,207,0.1)" }, NEW: { c: "var(--g3)", bg: "rgba(167,201,87,0.1)" }, LIMITED: { c: "var(--red)", bg: "rgba(188,71,73,0.1)" }, "SOLD OUT": { c: "rgba(188,71,73,0.7)", bg: "rgba(188,71,73,0.06)" } };

    return (
        <AdminLayout title="Products" subtitle="Manage">
            {/* Toolbar */}
            <div className="ap-toolbar">
                <input className="ao-search" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                <button className="ap-add-btn" onClick={openNew}>+ Add Product</button>
            </div>

            {/* Grid */}
            <div className="ap-grid">
                {filtered.map(p => {
                    const bc = p.badge ? BADGE_COLORS[p.badge] : null;
                    return (
                        <div key={p.id} className="ap-card">
                            <div className="ap-card-img-wrap">
                                <img src={p.image} alt={p.name} className="ap-card-img" />
                                {p.badge && bc && (
                                    <span className="ap-badge" style={{ color: bc.c, background: bc.bg }}>{p.badge}</span>
                                )}
                            </div>
                            <div className="ap-card-body">
                                <p className="ap-card-cat">{p.category} · {p.tag}</p>
                                <h3 className="ap-card-name">{p.name}</h3>
                                <p className="ap-card-price">${p.price}</p>
                            </div>
                            <div className="ap-card-actions">
                                <button className="ap-edit-btn" onClick={() => openEdit(p)}>Edit</button>
                                <button className="ap-del-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="ap-modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="ap-modal" onClick={e => e.stopPropagation()}>
                        <div className="ap-modal-head">
                            <h3 className="ap-modal-title">{editing ? "Edit Product" : "New Product"}</h3>
                            <button className="ap-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-form">
                            <div className="ap-mfield">
                                <label className="ap-mlabel">Product Name</label>
                                <input className="ck-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Oversized Utility Tee" />
                            </div>
                            <div className="ap-mrow">
                                <div className="ap-mfield">
                                    <label className="ap-mlabel">Price ($)</label>
                                    <input className="ck-input" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="29" />
                                </div>
                                <div className="ap-mfield">
                                    <label className="ap-mlabel">Category</label>
                                    <select className="ck-input ct-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                        <option value="tops">Tops</option>
                                        <option value="bottoms">Bottoms</option>
                                        <option value="outerwear">Outerwear</option>
                                        <option value="accessories">Accessories</option>
                                    </select>
                                </div>
                            </div>
                            <div className="ap-mfield">
                                <label className="ap-mlabel">Badge (optional)</label>
                                <select className="ck-input ct-select" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}>
                                    <option value="">None</option>
                                    <option value="NEW">NEW</option>
                                    <option value="BESTSELLER">BESTSELLER</option>
                                    <option value="LIMITED">LIMITED</option>
                                    <option value="SOLD OUT">SOLD OUT</option>
                                </select>
                            </div>
                            <div className="ap-mfield">
                                <label className="ap-mlabel">Description</label>
                                <textarea className="ck-input ct-textarea" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description..." />
                            </div>
                        </div>
                        <div className="ap-modal-foot">
                            <button className="ao-action-btn" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="ap-add-btn" onClick={handleSave}>
                                {editing ? "Save Changes" : "Add Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .ap-toolbar { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:24px; }
                .ap-add-btn { padding:12px 28px; background:var(--g3); border:none; color:var(--dark); font-family:'Space Grotesk',sans-serif; font-size:11px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; cursor:none; transition:background .3s ease,transform .3s ease; white-space:nowrap; }
                .ap-add-btn:hover { background:var(--g4); transform:translateY(-2px); }
                .ap-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
                .ap-card { background:var(--dark2); border:1px solid rgba(167,201,87,0.07); overflow:hidden; transition:border-color .3s ease,transform .3s ease; }
                .ap-card:hover { border-color:rgba(167,201,87,0.2); transform:translateY(-3px); }
                .ap-card-img-wrap { position:relative; height:200px; overflow:hidden; background:var(--dark3); }
                .ap-card-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s ease; }
                .ap-card:hover .ap-card-img { transform:scale(1.05); }
                .ap-badge { position:absolute; top:10px; left:10px; font-size:8px; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; padding:3px 8px; }
                .ap-card-body { padding:16px 18px 14px; }
                .ap-card-cat { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:rgba(167,201,87,0.45); margin-bottom:6px; }
                .ap-card-name { font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:600; color:var(--cream); margin-bottom:8px; letter-spacing:0; line-height:1.3; }
                .ap-card-price { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:.05em; background:linear-gradient(90deg,var(--g2),var(--g3)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
                .ap-card-actions { display:flex; border-top:1px solid rgba(167,201,87,0.06); }
                .ap-edit-btn,.ap-del-btn { flex:1; padding:12px; background:none; border:none; font-family:'Space Grotesk',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; cursor:none; transition:all .2s ease; }
                .ap-edit-btn { color:rgba(167,201,87,0.5); border-right:1px solid rgba(167,201,87,0.06); }
                .ap-edit-btn:hover { color:var(--g3); background:rgba(167,201,87,0.04); }
                .ap-del-btn { color:rgba(188,71,73,0.4); }
                .ap-del-btn:hover { color:var(--red); background:rgba(188,71,73,0.04); }
                .ap-modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); z-index:9000; display:flex; align-items:center; justify-content:center; padding:24px; }
                .ap-modal { background:var(--dark2); border:1px solid rgba(167,201,87,0.15); width:100%; max-width:520px; animation:fadeSlideUp .3s ease both; }
                .ap-modal-head { display:flex; justify-content:space-between; align-items:center; padding:24px 28px; border-bottom:1px solid rgba(167,201,87,0.08); }
                .ap-modal-title { font-family:'Bebas Neue',sans-serif; font-size:28px; color:var(--cream); letter-spacing:.02em; }
                .ap-modal-close { background:none; border:none; color:rgba(242,232,207,0.35); font-size:18px; cursor:none; transition:color .2s ease; }
                .ap-modal-close:hover { color:var(--cream); }
                .ap-modal-form { padding:24px 28px; display:flex; flex-direction:column; gap:16px; }
                .ap-mfield { display:flex; flex-direction:column; gap:7px; }
                .ap-mrow { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
                .ap-mlabel { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(242,232,207,0.3); }
                .ap-modal-foot { display:flex; justify-content:flex-end; gap:12px; padding:16px 28px 24px; border-top:1px solid rgba(167,201,87,0.08); }
                .ck-input { background:var(--dark); border:1px solid rgba(167,201,87,0.12); padding:14px 18px; color:var(--cream); font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:300; outline:none; transition:border-color .3s ease; border-radius:0; width:100%; }
                .ck-input::placeholder { color:rgba(242,232,207,0.2); }
                .ck-input:focus { border-color:rgba(167,201,87,0.35); }
                .ct-select { appearance:none; cursor:none; }
                .ct-select option { background:var(--dark2); color:var(--cream); }
                .ct-textarea { resize:vertical; }
                .ao-search { background:var(--dark2); border:1px solid rgba(167,201,87,0.12); padding:10px 18px; color:var(--cream); font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:300; outline:none; width:260px; transition:border-color .3s ease; }
                .ao-search::placeholder { color:rgba(242,232,207,0.2); }
                .ao-search:focus { border-color:rgba(167,201,87,0.3); }
                .ao-action-btn { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:rgba(167,201,87,0.5); background:none; border:1px solid rgba(167,201,87,0.12); padding:10px 20px; cursor:none; transition:all .2s ease; }
                .ao-action-btn:hover { color:var(--g3); border-color:rgba(167,201,87,0.35); }
                @media (max-width:1100px) { .ap-grid { grid-template-columns:repeat(2,1fr); } }
                @media (max-width:700px) { .ap-grid { grid-template-columns:1fr; } }
            `}</style>
        </AdminLayout>
    );
}

export default AdminProduct;