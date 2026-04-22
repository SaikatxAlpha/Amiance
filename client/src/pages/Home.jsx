import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import AuroraOrb from "../components/Effects/AuroraOrb";
import { useCart } from "../context/CartContext";
import { productsAPI } from "../services/api";
import { useState } from "react";

/* ─── Static data ─────────────────────────────────────────────── */
const MARQUEE_ITEMS = [
    { text: "Premium Quality", accent: false },
    { text: "SS 2026", accent: true },
    { text: "Limited Drops", accent: false },
    { text: "Organic Cotton", accent: false },
    { text: "Wear The Streets", accent: true },
    { text: "Fast Dispatch", accent: false },
    { text: "Zero Waste", accent: false },
    { text: "New Collection", accent: true },
    { text: "Streetwear Redefined", accent: false },
    { text: "AMIANCE", accent: true },
];

const STATS = [
    { num: "500+", label: "Happy Customers", desc: "Verified reviews from the community", count: 500 },
    { num: "48h", label: "Dispatch Time", desc: "Order before noon, ships same day" },
    { num: "100%", label: "Organic Cotton", desc: "Sustainably sourced every season" },
    { num: "30+", label: "Exclusive Drops", desc: "Limited runs, never restocked", count: 30 },
];

const FEATURES = [
    { num: "01", name: "Zero-Waste Manufacturing", detail: "Every offcut repurposed. Every batch limited. Production that respects the planet." },
    { num: "02", name: "Architect-Grade Tailoring", detail: "Silhouettes designed by ex-Maison Margiela pattern cutters for that elevated street edge." },
    { num: "03", name: "Drop Culture, Elevated", detail: "Exclusive limited releases. No restock. No hype. Just craft." },
    { num: "04", name: "48h Worldwide Dispatch", detail: "Carbon-neutral shipping partners with full tracking, every time." },
];

/* ─── Home Product Card ────────────────────────────────────────── */
function HomeProductCard({ product, index }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (product.badge === "SOLD OUT") return;
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const productId = product._id || product.id;
    const hue = product.colorHex ? null : "110,30%,11%";
    const accentHex = product.colorHex || "#a7c957";

    return (
        <div className="product-card">
            <Link to={`/product/${productId}`} className="product-img">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                ) : (
                    <svg width="100%" height="100%" viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <radialGradient id={`bg${index}`} cx="50%" cy="40%" r="60%">
                                <stop offset="0%" stopColor={`hsl(${hue})`} />
                                <stop offset="100%" stopColor="hsl(110,25%,7%)" />
                            </radialGradient>
                        </defs>
                        <rect width="320" height="400" fill={`url(#bg${index})`} />
                        <path
                            d="M100,60 L220,60 L240,110 L260,300 L200,310 L160,320 L120,310 L60,300 L80,110 Z"
                            fill={accentHex}
                            fillOpacity="0.12"
                            stroke={accentHex}
                            strokeOpacity="0.5"
                            strokeWidth="0.8"
                        />
                    </svg>
                )}
                <div className="product-overlay">
                    <button className="quick-add" onClick={handleAdd}>
                        {product.badge === "SOLD OUT" ? "Sold Out" : added ? "Added ✓" : "Quick Add"}
                    </button>
                </div>
            </Link>
            <div className="product-info">
                <div className="product-tag">{product.tag}</div>
                <div className="product-name">{product.name}</div>
                <div className="product-price">₹{product.price?.toLocaleString("en-IN")}</div>
            </div>
        </div>
    );
}

/* ─── Component ────────────────────────────────────────────────── */
function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    /* Fetch real products for home section */
    useEffect(() => {
        productsAPI.getAll()
            .then((data) => {
                if (data.products?.length > 0) {
                    setFeaturedProducts(data.products.slice(0, 5));
                }
            })
            .catch(() => {
                /* Silently fall back to empty — Shop page has full static fallback */
            });
    }, []);

    /* ── Scroll reveal ─────────────────────────────────────── */
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add("visible");
                        obs.unobserve(e.target);
                    }
                }),
            { threshold: 0.15 }
        );
        document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    /* ── Stat counters ─────────────────────────────────────── */
    useEffect(() => {
        const animCount = (el, target) => {
            const dur = 1800;
            const start = performance.now();
            (function tick(now) {
                const p = Math.min((now - start) / dur, 1);
                el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + "+";
                if (p < 1) requestAnimationFrame(tick);
            })(performance.now());
        };
        const obs = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        const el = e.target.querySelector(".stat-num-wrap[data-count]");
                        if (el) animCount(el, +el.dataset.count);
                        obs.unobserve(e.target);
                    }
                }),
            { threshold: 0.5 }
        );
        document.querySelectorAll(".stat-cell").forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    /* ── Magnetic buttons ──────────────────────────────────── */
    useEffect(() => {
        const btns = document.querySelectorAll(".btn-primary, .cta-btn, .nav-cta");
        const handlers = [];
        btns.forEach((btn) => {
            const onMove = (e) => {
                const r = btn.getBoundingClientRect();
                btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px) translateY(-3px)`;
            };
            const onLeave = () => {
                btn.style.transform = "";
            };
            btn.addEventListener("mousemove", onMove);
            btn.addEventListener("mouseleave", onLeave);
            handlers.push({ btn, onMove, onLeave });
        });
        return () =>
            handlers.forEach(({ btn, onMove, onLeave }) => {
                btn.removeEventListener("mousemove", onMove);
                btn.removeEventListener("mouseleave", onLeave);
            });
    }, []);

    const marqueeAll = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

    return (
        <>
            <div className="noise" />
            <Navbar />

            {/* ── HERO ────────────────────────────────── */}
            <section id="hero">
                <div className="hero-left">
                    <div className="eyebrow">
                        <span className="eyebrow-line" />
                        <span className="eyebrow-text">New Collection — SS 2026</span>
                    </div>
                    <h1 className="hero-title">
                        <span className="line-1">Wear</span>
                        <span className="line-2">The</span>
                        <span className="line-3">Streets.</span>
                    </h1>
                    <p className="hero-desc">
                        Premium streetwear crafted for those who move with{" "}
                        <em>intention.</em> Minimal by design. Bold by nature.
                    </p>
                    <div className="hero-actions">
                        <Link to="/shop">
                            <button className="btn-primary">
                                <span>Shop Collection</span>
                            </button>
                        </Link>
                        <Link to="/shop">
                            <button className="btn-ghost">
                                View Lookbook<span className="arrow" />
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="hero-right">
                    <AuroraOrb />
                    <span className="hero-vert-text">SS 2026 — Premium Streetwear — Limited Drops</span>
                </div>

                <div className="scroll-indicator">
                    <div className="scroll-line" />
                    <span className="scroll-text">Scroll</span>
                </div>
                <div className="year-stamp">© 2026</div>
            </section>

            {/* ── MARQUEE ─────────────────────────────── */}
            <div className="marquee-wrap">
                <div className="marquee-track">
                    {marqueeAll.map((item, i) => (
                        <div
                            key={i}
                            className={`marquee-item${item.accent ? " accent" : ""}`}
                        >
                            <span className="marquee-dot" />
                            {item.text}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── STATS ───────────────────────────────── */}
            <section id="stats">
                {STATS.map((s, i) => (
                    <div
                        key={i}
                        className="stat-cell reveal"
                        style={{ transitionDelay: `${i * 0.1}s` }}
                    >
                        <div
                            className="stat-num-wrap"
                            {...(s.count ? { "data-count": s.count } : {})}
                        >
                            {s.num}
                        </div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-desc">{s.desc}</div>
                    </div>
                ))}
            </section>

            {/* ── FEATURES ────────────────────────────── */}
            <section id="features">
                <div className="feat-heading reveal">
                    <div className="section-label">
                        <span>Why AMIANCE</span>
                    </div>
                    <h2 className="feat-title-large">
                        <em>Built for</em>The Bold<br />Ones.
                    </h2>
                    <p className="feat-body">
                        Every stitch. Every silhouette. Considered in obsessive detail for
                        people who don't follow — they lead.
                    </p>
                    <Link to="/shop">
                        <button className="btn-primary">
                            <span>Explore Brand</span>
                        </button>
                    </Link>
                </div>
                <div className="feat-list-col reveal" style={{ transitionDelay: "0.15s" }}>
                    {FEATURES.map((f, i) => (
                        <div key={i} className="feat-item">
                            <div className="feat-num">{f.num}</div>
                            <div className="feat-name">{f.name}</div>
                            <div className="feat-detail">{f.detail}</div>
                            <span className="feat-arrow">→</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── PRODUCTS ────────────────────────────── */}
            {featuredProducts.length > 0 && (
                <section id="products">
                    <div className="products-header reveal">
                        <h2 className="products-title">
                            <small>New Arrivals</small>The Drop.
                        </h2>
                        <Link to="/shop" className="see-all">
                            All Pieces<span className="see-all-line" />
                        </Link>
                    </div>
                    <div className="products-scroll">
                        {featuredProducts.map((product, i) => (
                            <HomeProductCard
                                key={product._id || product.id}
                                product={product}
                                index={i}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* ── CTA ─────────────────────────────────── */}
            <section id="cta" className="reveal">
                <span className="cta-eyebrow">Limited Drop — While Stocks Last</span>
                <h2 className="cta-title">
                    Own The<span>Moment.</span>
                </h2>
                <p className="cta-sub">
                    Join the community redefining what streetwear means. Curated drops.
                    Zero compromise.
                </p>
                <Link to="/shop">
                    <button className="cta-btn">
                        <span>Join The Movement</span>
                    </button>
                </Link>
            </section>

            {/* ── FOOTER ──────────────────────────────── */}
            <footer className="site-footer">
                <div className="foot-brand">
                    <span className="logo-mark">AMIANCE</span>
                    <p className="foot-desc">
                        Premium streetwear for those who move with intention. Minimal by
                        design. Bold by nature.
                    </p>
                </div>
                <div className="foot-col">
                    <h4>Shop</h4>
                    <ul>
                        <li><Link to="/shop">New Arrivals</Link></li>
                        <li><Link to="/shop">Tops</Link></li>
                        <li><Link to="/shop">Bottoms</Link></li>
                        <li><Link to="/shop">Outerwear</Link></li>
                        <li><Link to="/shop">Accessories</Link></li>
                    </ul>
                </div>
                <div className="foot-col">
                    <h4>Brand</h4>
                    <ul>
                        <li><Link to="/about">Our Story</Link></li>
                        <li><Link to="/shop">Lookbook</Link></li>
                        <li><Link to="/shop">Journal</Link></li>
                        <li><Link to="/shop">Sustainability</Link></li>
                    </ul>
                </div>
                <div className="foot-col">
                    <h4>Support</h4>
                    <ul>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/orders">Track Order</Link></li>
                        <li><Link to="/profile">My Account</Link></li>
                        <li><Link to="/wishlist">Wishlist</Link></li>
                    </ul>
                </div>
            </footer>
            <div className="foot-bottom">
                <span className="foot-copy">© 2026 AMIANCE. All rights reserved.</span>
                <div className="foot-social">
                    <a href="/about">LinkedIn</a>
                    <a href="/about">Instagram</a>
                    <a href="/about">Twitter</a>
                    <a href="/about">TikTok</a>
                </div>
            </div>
        </>
    );
}

export default Home;