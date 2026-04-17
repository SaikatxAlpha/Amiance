import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import { useCart } from "../context/CartContext";

/* ─── Product data ──────────────────────────────────────────── */
export const products = [
    {
        id: 1,
        name: "Oversized Utility Tee",
        price: 29,
        tag: "Drop 01",
        category: "tops",
        badge: "New",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
        description: "Premium cotton oversized t-shirt. Breathable, relaxed fit for all-day comfort.",
        hue: "120,40%,12%", accent: "88,47%,50%",
    },
    {
        id: 2,
        name: "Hooded Fleece Jacket",
        price: 79,
        tag: "Drop 02",
        category: "outerwear",
        badge: "Hot",
        image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
        description: "Warm and stylish hoodie with a soft interior fleece lining.",
        hue: "100,35%,10%", accent: "85,50%,45%",
    },
    {
        id: 3,
        name: "Structured Coach Jacket",
        price: 119,
        tag: "Drop 03",
        category: "outerwear",
        badge: "Limited",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
        description: "Classic structured jacket with a modern streetwear cut.",
        hue: "110,30%,11%", accent: "90,45%,55%",
    },
    {
        id: 4,
        name: "Cargo Wide-Leg Pant",
        price: 69,
        tag: "Drop 04",
        category: "bottoms",
        badge: null,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
        description: "Relaxed cargo pants with multiple utility pockets.",
        hue: "105,38%,13%", accent: "87,48%,48%",
    },
    {
        id: 5,
        name: "Relaxed Linen Shirt",
        price: 55,
        tag: "Drop 05",
        category: "tops",
        badge: null,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
        description: "Lightweight linen shirt with a relaxed drop-shoulder silhouette.",
        hue: "115,33%,12%", accent: "86,44%,52%",
    },
    {
        id: 6,
        name: "Graphic Statement Tee",
        price: 45,
        tag: "Drop 06",
        category: "tops",
        badge: "New",
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
        description: "Bold graphic tee made from 100% organic cotton.",
        hue: "120,42%,11%", accent: "89,46%,53%",
    },
];

const CATEGORIES = ["all", "tops", "bottoms", "outerwear"];

const FILTERS_LABEL = {
    all: "All Pieces",
    tops: "Tops",
    bottoms: "Bottoms",
    outerwear: "Outerwear",
};

/* ─── Shop Component ────────────────────────────────────────── */
function Shop() {
    const { addToCart } = useCart();
    const [activeFilter, setActiveFilter] = useState("all");
    const [addedId, setAddedId] = useState(null);
    const headerRef = useRef(null);

    const filtered = activeFilter === "all"
        ? products
        : products.filter(p => p.category === activeFilter);

    /* Scroll-reveal on mount */
    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add("visible");
                    obs.unobserve(e.target);
                }
            }),
            { threshold: 0.1 }
        );
        document.querySelectorAll(".s-reveal").forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, [filtered]);

    function handleAdd(product, e) {
        e.preventDefault();
        addToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1400);
    }

    return (
        <>
            <style>{`
                /* ── SHOP PAGE OVERRIDES ── */
                .shop-page {
                    background: var(--dark);
                    min-height: 100vh;
                }

                /* Hero banner */
                .shop-hero {
                    padding: 160px 60px 80px;
                    position: relative;
                    overflow: hidden;
                    border-bottom: 1px solid rgba(167,201,87,0.08);
                }
                .shop-hero::before {
                    content: '';
                    position: absolute;
                    top: -200px; right: -200px;
                    width: 700px; height: 700px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(56,102,65,0.14) 0%, transparent 65%);
                    pointer-events: none;
                }
                .shop-hero-inner {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 40px;
                    position: relative;
                    z-index: 1;
                }
                .shop-hero-left {}
                .shop-eyebrow {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .shop-eyebrow-line {
                    width: 30px; height: 1px;
                    background: var(--g3);
                    flex-shrink: 0;
                }
                .shop-eyebrow-text {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.25em;
                    text-transform: uppercase;
                    color: var(--g3);
                    font-family: 'Space Grotesk', sans-serif;
                }
                .shop-hero-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(72px, 9vw, 130px);
                    line-height: 0.88;
                    letter-spacing: 0.02em;
                    color: var(--cream);
                    margin-bottom: 0;
                }
                .shop-hero-title em {
                    font-style: italic;
                    font-family: 'Playfair Display', serif;
                    font-size: 0.38em;
                    display: block;
                    color: var(--g3);
                    letter-spacing: 0.02em;
                    font-weight: 400;
                    margin-bottom: 8px;
                }
                .shop-hero-right {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 16px;
                    flex-shrink: 0;
                }
                .shop-count-pill {
                    padding: 10px 20px;
                    border: 1px solid rgba(167,201,87,0.2);
                    background: rgba(167,201,87,0.06);
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: var(--g3);
                    font-family: 'Space Grotesk', sans-serif;
                }
                .shop-hero-desc {
                    font-size: 13px;
                    font-weight: 300;
                    color: var(--text-muted);
                    max-width: 240px;
                    line-height: 1.8;
                    text-align: right;
                    font-family: 'Space Grotesk', sans-serif;
                }

                /* Filter bar */
                .shop-filters {
                    padding: 0 60px;
                    border-bottom: 1px solid rgba(167,201,87,0.06);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 40px;
                    background: var(--dark2);
                }
                .filter-tabs {
                    display: flex;
                    gap: 0;
                }
                .filter-tab {
                    padding: 20px 32px;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    font-family: 'Space Grotesk', sans-serif;
                    color: rgba(242,232,207,0.3);
                    background: transparent;
                    border: none;
                    border-bottom: 2px solid transparent;
                    cursor: none;
                    transition: color 0.3s ease, border-color 0.3s ease;
                    position: relative;
                }
                .filter-tab:hover {
                    color: var(--cream);
                }
                .filter-tab.active-tab {
                    color: var(--g3);
                    border-bottom-color: var(--g3);
                }
                .filter-count {
                    font-size: 10px;
                    color: var(--text-dim);
                    font-family: 'Space Grotesk', sans-serif;
                    letter-spacing: 0.1em;
                    font-weight: 400;
                }

                /* Product grid */
                .shop-grid-wrap {
                    padding: 60px 60px 100px;
                    background: var(--dark);
                }
                .shop-product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2px;
                }

                /* Product card enhanced */
                .sp-card {
                    background: var(--dark2);
                    border: 1px solid rgba(167,201,87,0.05);
                    position: relative;
                    overflow: hidden;
                    cursor: none;
                    transition: border-color 0.4s ease;
                }
                .sp-card:hover {
                    border-color: rgba(167,201,87,0.18);
                }
                .sp-img-wrap {
                    height: 380px;
                    overflow: hidden;
                    position: relative;
                    background: var(--dark3);
                }
                .sp-img-wrap img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.7s cubic-bezier(0.25,0.1,0.25,1);
                    display: block;
                }
                .sp-card:hover .sp-img-wrap img {
                    transform: scale(1.06);
                }
                .sp-badge {
                    position: absolute;
                    top: 16px; left: 16px;
                    padding: 5px 12px;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    font-family: 'Space Grotesk', sans-serif;
                    z-index: 2;
                }
                .sp-badge.badge-new {
                    background: var(--g3);
                    color: var(--dark);
                }
                .sp-badge.badge-hot {
                    background: var(--red);
                    color: #fff;
                }
                .sp-badge.badge-limited {
                    background: transparent;
                    border: 1px solid rgba(167,201,87,0.5);
                    color: var(--g3);
                }
                .sp-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(10,15,10,0.9) 0%, rgba(10,15,10,0.2) 40%, transparent 70%);
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 24px;
                    gap: 10px;
                }
                .sp-card:hover .sp-overlay {
                    opacity: 1;
                }
                .sp-add-btn {
                    width: 100%;
                    padding: 14px;
                    border: 1px solid rgba(167,201,87,0.6);
                    background: transparent;
                    color: var(--g3);
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    cursor: none;
                    transition: background 0.3s ease, color 0.3s ease;
                }
                .sp-add-btn:hover, .sp-add-btn.added {
                    background: var(--g3);
                    color: var(--dark);
                    border-color: var(--g3);
                }
                .sp-view-btn {
                    width: 100%;
                    padding: 11px;
                    border: 1px solid rgba(242,232,207,0.1);
                    background: rgba(242,232,207,0.05);
                    color: rgba(242,232,207,0.6);
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    cursor: none;
                    transition: color 0.3s ease, border-color 0.3s ease;
                }
                .sp-view-btn:hover {
                    color: var(--cream);
                    border-color: rgba(242,232,207,0.25);
                }
                .sp-info {
                    padding: 20px 20px 24px;
                    background: var(--dark2);
                    position: relative;
                }
                .sp-info::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 20px; right: 20px;
                    height: 1px;
                    background: linear-gradient(90deg, var(--g3), transparent);
                    opacity: 0.15;
                }
                .sp-tag {
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: var(--g3);
                    opacity: 0.6;
                    font-family: 'Space Grotesk', sans-serif;
                    margin-bottom: 6px;
                }
                .sp-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--cream);
                    letter-spacing: 0;
                    line-height: 1.3;
                    margin-bottom: 6px;
                    font-family: 'Space Grotesk', sans-serif;
                }
                .sp-cat {
                    font-size: 11px;
                    font-weight: 400;
                    color: var(--text-dim);
                    text-transform: capitalize;
                    font-family: 'Space Grotesk', sans-serif;
                    letter-spacing: 0.06em;
                    margin-bottom: 12px;
                }
                .sp-price-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .sp-price {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 26px;
                    letter-spacing: 0.05em;
                    background: linear-gradient(90deg, var(--g2), var(--g3));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .sp-detail-link {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: var(--text-dim);
                    font-family: 'Space Grotesk', sans-serif;
                    cursor: none;
                    transition: color 0.3s ease;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .sp-detail-link:hover { color: var(--g3); }
                .sp-detail-link::after {
                    content: '→';
                    transition: transform 0.3s ease;
                }
                .sp-detail-link:hover::after {
                    transform: translateX(4px);
                }

                /* scroll reveal */
                .s-reveal {
                    opacity: 0;
                    transform: translateY(24px);
                    transition: opacity 0.6s ease, transform 0.6s ease;
                }
                .s-reveal.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Brand strip */
                .shop-brand-strip {
                    border-top: 1px solid rgba(167,201,87,0.08);
                    border-bottom: 1px solid rgba(167,201,87,0.08);
                    padding: 60px;
                    display: grid;
                    grid-template-columns: repeat(3,1fr);
                    gap: 1px;
                    background: rgba(167,201,87,0.05);
                    margin: 0 0 0 0;
                }
                .sbs-item {
                    padding: 40px 48px;
                    background: var(--dark);
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .sbs-icon {
                    font-size: 28px;
                    margin-bottom: 4px;
                }
                .sbs-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 22px;
                    letter-spacing: 0.05em;
                    color: var(--cream);
                }
                .sbs-desc {
                    font-size: 13px;
                    font-weight: 300;
                    color: var(--text-muted);
                    line-height: 1.7;
                    font-family: 'Space Grotesk', sans-serif;
                }

                /* empty state */
                .shop-empty {
                    padding: 100px 0;
                    text-align: center;
                    color: var(--text-dim);
                }
                .shop-empty h3 {
                    font-size: 40px;
                    color: var(--cream);
                    margin-bottom: 12px;
                }
                .shop-empty p {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 14px;
                    font-weight: 300;
                }

                /* Responsive */
                @media (max-width: 900px) {
                    .shop-hero { padding: 130px 24px 60px; }
                    .shop-hero-inner { flex-direction: column; align-items: flex-start; gap: 24px; }
                    .shop-hero-right { align-items: flex-start; }
                    .shop-hero-desc { text-align: left; }
                    .shop-filters { padding: 0 24px; overflow-x: auto; }
                    .shop-grid-wrap { padding: 40px 24px 80px; }
                    .shop-brand-strip { grid-template-columns: 1fr; padding: 0; gap: 1px; }
                    .sbs-item { padding: 32px 24px; }
                }
                @media (max-width: 600px) {
                    .shop-product-grid { grid-template-columns: 1fr 1fr; gap: 1px; }
                    .sp-img-wrap { height: 260px; }
                    .filter-tab { padding: 16px 18px; }
                }
                @media (max-width: 420px) {
                    .shop-product-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="shop-page">
                <Navbar />

                {/* ── HERO ──────────────────────────────── */}
                <div className="shop-hero">
                    <div className="shop-hero-inner">
                        <div className="shop-hero-left s-reveal">
                            <div className="shop-eyebrow">
                                <span className="shop-eyebrow-line" />
                                <span className="shop-eyebrow-text">SS 2026 — New Collection</span>
                            </div>
                            <h1 className="shop-hero-title">
                                <em>The Full</em>
                                Collection.
                            </h1>
                        </div>
                        <div className="shop-hero-right s-reveal" style={{ transitionDelay: "0.1s" }}>
                            <div className="shop-count-pill">{products.length} Pieces Available</div>
                            <p className="shop-hero-desc">
                                Limited runs. Never restocked.<br />
                                Premium craft. Zero compromise.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── FILTERS ───────────────────────────── */}
                <div className="shop-filters">
                    <div className="filter-tabs">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`filter-tab${activeFilter === cat ? " active-tab" : ""}`}
                                onClick={() => setActiveFilter(cat)}
                            >
                                {FILTERS_LABEL[cat]}
                            </button>
                        ))}
                    </div>
                    <span className="filter-count">
                        {filtered.length} {filtered.length === 1 ? "result" : "results"}
                    </span>
                </div>

                {/* ── PRODUCT GRID ──────────────────────── */}
                <div className="shop-grid-wrap">
                    {filtered.length === 0 ? (
                        <div className="shop-empty">
                            <h3>Nothing Here Yet</h3>
                            <p>Check back soon for new drops.</p>
                        </div>
                    ) : (
                        <div className="shop-product-grid">
                            {filtered.map((p, i) => (
                                <div
                                    key={p.id}
                                    className="sp-card s-reveal"
                                    style={{ transitionDelay: `${i * 0.07}s` }}
                                >
                                    <div className="sp-img-wrap">
                                        <img src={p.image} alt={p.name} loading="lazy" />
                                        {p.badge && (
                                            <span className={`sp-badge badge-${p.badge.toLowerCase()}`}>
                                                {p.badge}
                                            </span>
                                        )}
                                        {/* Hover overlay */}
                                        <div className="sp-overlay">
                                            <button
                                                className={`sp-add-btn${addedId === p.id ? " added" : ""}`}
                                                onClick={(e) => handleAdd(p, e)}
                                            >
                                                {addedId === p.id ? "Added ✓" : "Quick Add"}
                                            </button>
                                            <Link to={`/product/${p.id}`}>
                                                <button className="sp-view-btn">View Details</button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="sp-info">
                                        <div className="sp-tag">{p.tag}</div>
                                        <div className="sp-name">{p.name}</div>
                                        <div className="sp-cat">{p.category}</div>
                                        <div className="sp-price-row">
                                            <span className="sp-price">${p.price}</span>
                                            <Link to={`/product/${p.id}`} className="sp-detail-link">
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── BRAND STRIP ───────────────────────── */}
                <div className="shop-brand-strip">
                    {[
                        { icon: "🌿", title: "Zero-Waste Made", desc: "Every offcut repurposed. Every batch limited. We never overproduce." },
                        { icon: "🚚", title: "48h Worldwide", desc: "Carbon-neutral shipping partners. Full tracking on every order, every time." },
                        { icon: "↩", title: "30-Day Returns", desc: "Not your vibe? Send it back. No questions, no hassle, no exceptions." },
                    ].map((item, i) => (
                        <div key={i} className="sbs-item s-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                            <span className="sbs-icon">{item.icon}</span>
                            <div className="sbs-title">{item.title}</div>
                            <p className="sbs-desc">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Shop;