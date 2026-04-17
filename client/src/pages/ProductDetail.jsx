import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import { useCart } from "../context/CartContext";
import { products } from "./Shop";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const TRUST = [
    { icon: "♻", label: "Organic Cotton" },
    { icon: "↩", label: "Free Returns" },
    { icon: "⚡", label: "48h Dispatch" },
    { icon: "✦", label: "Carbon Neutral" },
];

const TABS = [
    { id: "desc", label: "Description" },
    { id: "details", label: "Details & Fit" },
    { id: "care", label: "Care Guide" },
];

const TAB_CONTENT = {
    details: "Relaxed unisex fit — model is 6'1\" wearing size M. 100% GOTS-certified organic cotton, pre-washed for softness. Reinforced double-stitched seams. Made in Portugal under fair-wage conditions.",
    care: "Machine wash cold, gentle cycle. Do not bleach or tumble dry. Lay flat or hang to dry. Iron on medium heat inside out. Do not dry clean.",
};

function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [selectedSize, setSelectedSize] = useState(null);
    const [added, setAdded] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState("desc");
    const [zoomed, setZoomed] = useState(false);
    const [imgPos, setImgPos] = useState({ x: 50, y: 50 });
    const [activeThumb, setActiveThumb] = useState(0);

    const product = products.find(p => p.id === Number(id));

    /* ─── 404 ─── */
    if (!product) {
        return (
            <>
                <Navbar />
                <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", minHeight: "100vh", gap: "24px", textAlign: "center",
                }}>
                    <span style={{ fontSize: "72px" }}>🔍</span>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "56px", color: "var(--cream)" }}>
                        Product Not Found
                    </h2>
                    <p style={{ color: "var(--text-muted)", fontFamily: "'Space Grotesk', sans-serif" }}>
                        This item doesn't exist or has been removed.
                    </p>
                    <button className="btn-primary" onClick={() => navigate("/shop")}>
                        <span>Back to Collection</span>
                    </button>
                </div>
            </>
        );
    }

    const handleAdd = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1700);
    };

    const handleImgMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setImgPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    /* Generate 3 "thumbnails" from the same image (since we have one) */
    const thumbs = [product.image, product.image, product.image];

    return (
        <>
            <Navbar />

            <div className="pd-page">

                {/* ══════════════ LEFT — IMAGE PANEL ══════════════ */}
                <div className="pd-left">

                    {/* Main image */}
                    <div
                        className={`pd-main-img ${zoomed ? "pd-main-img--zoom" : ""}`}
                        onMouseEnter={() => setZoomed(true)}
                        onMouseLeave={() => setZoomed(false)}
                        onMouseMove={handleImgMove}
                    >
                        <img
                            src={thumbs[activeThumb]}
                            alt={product.name}
                            className="pd-img"
                            style={zoomed ? {
                                transformOrigin: `${imgPos.x}% ${imgPos.y}%`,
                                transform: "scale(1.65)",
                            } : {}}
                        />

                        {/* Drop label */}
                        <div className="pd-img-corner-tl">{product.tag}</div>

                        {/* Badge */}
                        {product.badge && product.badge !== "SOLD OUT" && (
                            <div className={`pd-img-badge pd-img-badge--${product.badge.toLowerCase()}`}>
                                {product.badge}
                            </div>
                        )}

                        {/* Zoom hint */}
                        <div className="pd-zoom-hint">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
                                <line x1="8" y1="8" x2="11" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                <line x1="5" y1="3" x2="5" y2="7" stroke="currentColor" strokeWidth="1" />
                                <line x1="3" y1="5" x2="7" y2="5" stroke="currentColor" strokeWidth="1" />
                            </svg>
                            Hover to zoom
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="pd-thumbs">
                        {thumbs.map((img, i) => (
                            <button
                                key={i}
                                className={`pd-thumb ${activeThumb === i ? "pd-thumb--active" : ""}`}
                                onClick={() => setActiveThumb(i)}
                            >
                                <img src={img} alt="" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ══════════════ RIGHT — INFO PANEL ══════════════ */}
                <div className="pd-right">
                    <div className="pd-right-inner">

                        {/* Breadcrumb */}
                        <nav className="pd-breadcrumb">
                            <Link to="/">Home</Link>
                            <span className="pd-bc-sep">·</span>
                            <Link to="/shop">Collections</Link>
                            <span className="pd-bc-sep">·</span>
                            <span className="pd-bc-current">{product.category}</span>
                        </nav>

                        {/* Back */}
                        <button className="pd-back" onClick={() => navigate(-1)}>
                            ← Back
                        </button>

                        {/* Title */}
                        <h1 className="pd-title">{product.name}</h1>

                        {/* Price row */}
                        <div className="pd-price-row">
                            <span className="pd-price">${product.price}</span>
                            <span className="pd-free-ship">Free shipping on orders $80+</span>
                        </div>

                        {/* Divider */}
                        <div className="pd-divider" />

                        {/* Color */}
                        <div className="pd-field">
                            <div className="pd-field-label">Colorway</div>
                            <div className="pd-color-row">
                                <div
                                    className="pd-color-dot pd-color-dot--selected"
                                    style={{ background: product.colorHex }}
                                />
                                <span className="pd-color-name">Signature Green</span>
                            </div>
                        </div>

                        {/* Size */}
                        <div className="pd-field">
                            <div className="pd-field-label-row">
                                <span className="pd-field-label">Size</span>
                                <span className="pd-size-guide-link">Size Guide →</span>
                            </div>
                            <div className="pd-sizes">
                                {SIZES.map(s => (
                                    <button
                                        key={s}
                                        className={`pd-size ${selectedSize === s ? "pd-size--active" : ""}`}
                                        onClick={() => setSelectedSize(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            {!selectedSize && (
                                <p className="pd-size-hint">Select a size to continue</p>
                            )}
                        </div>

                        {/* CTA buttons */}
                        <div className="pd-cta-row">
                            <button
                                className={`pd-add ${added ? "pd-add--done" : ""}`}
                                onClick={handleAdd}
                                disabled={product.badge === "SOLD OUT"}
                            >
                                <span className="pd-add-inner">
                                    {product.badge === "SOLD OUT"
                                        ? "Sold Out"
                                        : added
                                            ? "✓  Added to Cart"
                                            : "Add to Cart"}
                                </span>
                            </button>

                            <button
                                className={`pd-wish ${wishlisted ? "pd-wish--active" : ""}`}
                                onClick={() => setWishlisted(v => !v)}
                                title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
                            >
                                {wishlisted ? "♥" : "♡"}
                            </button>
                        </div>

                        {/* Trust strip */}
                        <div className="pd-trust">
                            {TRUST.map(t => (
                                <div key={t.label} className="pd-trust-item">
                                    <span className="pd-trust-icon">{t.icon}</span>
                                    <span>{t.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="pd-divider" />

                        {/* Info tabs */}
                        <div className="pd-tabs">
                            <div className="pd-tab-nav">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        className={`pd-tab-btn ${activeTab === tab.id ? "pd-tab-btn--active" : ""}`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="pd-tab-body">
                                {activeTab === "desc" && <p>{product.description}</p>}
                                {activeTab === "details" && <p>{TAB_CONTENT.details}</p>}
                                {activeTab === "care" && <p>{TAB_CONTENT.care}</p>}
                            </div>
                        </div>

                        {/* Drop info footer */}
                        <div className="pd-drop-footer">
                            <span className="pd-drop-tag">{product.tag} / SS26</span>
                            <span className="pd-drop-note">Once it's gone, it's gone.</span>
                        </div>

                    </div>
                </div>
            </div>

            {/* Related products teaser */}
            <div className="pd-related-strip">
                <div className="pd-related-label">
                    <span className="pd-related-line" />
                    Continue Browsing
                    <span className="pd-related-line" />
                </div>
                <div className="pd-related-cards">
                    {products
                        .filter(p => p.id !== product.id)
                        .slice(0, 3)
                        .map(p => (
                            <Link to={`/product/${p.id}`} key={p.id} className="pd-related-card">
                                <div className="pd-related-img">
                                    <img src={p.image} alt={p.name} />
                                </div>
                                <div className="pd-related-info">
                                    <span className="pd-related-tag">{p.tag}</span>
                                    <span className="pd-related-name">{p.name}</span>
                                    <span className="pd-related-price">${p.price}</span>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </>
    );
}

export default ProductDetail;