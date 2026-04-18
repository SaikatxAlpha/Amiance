import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import AuroraOrb from "../components/Effects/AuroraOrb";

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

const PRODUCTS = [
    { tag: "Drop 01", name: "Oversized Utility Tee", price: "₹1,899", hue: "120,40%,12%", accent: "88,47%,50%" },
    { tag: "Drop 02", name: "Cargo Wide-Leg Pant", price: "₹3,299", hue: "100,35%,10%", accent: "85,50%,45%" },
    { tag: "Drop 03", name: "Hooded Fleece Jacket", price: "₹4,899", hue: "110,30%,11%", accent: "90,45%,55%" },
    { tag: "Drop 04", name: "Structured Coach Jacket", price: "₹5,499", hue: "105,38%,13%", accent: "87,48%,48%" },
    { tag: "Drop 05", name: "Relaxed Linen Shirt", price: "₹2,199", hue: "115,33%,12%", accent: "86,44%,52%" },
];

/* ─── Cart helpers ─────────────────────────────────────────────── */
const getCart = () => JSON.parse(localStorage.getItem("urbn_cart") || "[]");
const saveCart = (c) => localStorage.setItem("urbn_cart", JSON.stringify(c));
function addToCart(name, price, setBadge) {
    const cart = getCart();
    const ex = cart.find(i => i.name === name);
    if (ex) ex.qty++; else cart.push({ name, price, qty: 1 });
    saveCart(cart);
    setBadge(cart.reduce((s, i) => s + i.qty, 0));
}

/* ─── Component ────────────────────────────────────────────────── */
function Home() {
    /* ── Scroll reveal ─────────────────────────────────────── */
    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
            }),
            { threshold: 0.15 }
        );
        document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    /* ── Stat counters ─────────────────────────────────────── */
    useEffect(() => {
        const animCount = (el, target) => {
            const dur = 1800, start = performance.now();
            (function tick(now) {
                const p = Math.min((now - start) / dur, 1);
                el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + "+";
                if (p < 1) requestAnimationFrame(tick);
            })(performance.now());
        };
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target.querySelector(".stat-num-wrap[data-count]");
                    if (el) animCount(el, +el.dataset.count);
                    obs.unobserve(e.target);
                }
            }),
            { threshold: 0.5 }
        );
        document.querySelectorAll(".stat-cell").forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    /* ── Magnetic buttons ──────────────────────────────────── */
    useEffect(() => {
        const btns = document.querySelectorAll(".btn-primary, .cta-btn, .nav-cta");
        const handlers = [];
        btns.forEach(btn => {
            const onMove = e => { const r = btn.getBoundingClientRect(); btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px) translateY(-3px)`; };
            const onLeave = () => { btn.style.transform = ""; };
            btn.addEventListener("mousemove", onMove);
            btn.addEventListener("mouseleave", onLeave);
            handlers.push({ btn, onMove, onLeave });
        });
        return () => handlers.forEach(({ btn, onMove, onLeave }) => {
            btn.removeEventListener("mousemove", onMove);
            btn.removeEventListener("mouseleave", onLeave);
        });
    }, []);

    const marqueeAll = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

    return (
        <>
            {/* Noise overlay */}
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
                            <button className="btn-primary"><span>Shop Collection</span></button>
                        </Link>
                        <Link to="/shop">
                            <button className="btn-ghost">View Lookbook<span className="arrow" /></button>
                        </Link>
                    </div>
                </div>

                {/* ── AURORA ORB ── */}
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
                        <div key={i} className={`marquee-item${item.accent ? " accent" : ""}`}>
                            <span className="marquee-dot" />{item.text}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── STATS ───────────────────────────────── */}
            <section id="stats">
                {STATS.map((s, i) => (
                    <div key={i} className="stat-cell reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                        <div className="stat-num-wrap" {...(s.count ? { "data-count": s.count } : {})}>{s.num}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-desc">{s.desc}</div>
                    </div>
                ))}
            </section>

            {/* ── FEATURES ────────────────────────────── */}
            <section id="features">
                <div className="feat-heading reveal">
                    <div className="section-label"><span>Why AMIANCE</span></div>
                    <h2 className="feat-title-large">
                        <em>Built for</em>The Bold<br />Ones.
                    </h2>
                    <p className="feat-body">
                        Every stitch. Every silhouette. Considered in obsessive detail for people who don't follow — they lead.
                    </p>
                    <Link to="/shop"><button className="btn-primary"><span>Explore Brand</span></button></Link>
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
            <section id="products">
                <div className="products-header reveal">
                    <h2 className="products-title"><small>New Arrivals</small>The Drop.</h2>
                    <Link to="/shop" className="see-all">All Pieces<span className="see-all-line" /></Link>
                </div>
                <div className="products-scroll">
                    {PRODUCTS.map((p, i) => (
                        <div key={i} className="product-card">
                            <div className="product-img">
                                <svg width="100%" height="100%" viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" aria-label={p.name}>
                                    <defs>
                                        <radialGradient id={`bg${i}`} cx="50%" cy="40%" r="60%">
                                            <stop offset="0%" stopColor={`hsl(${p.hue})`} stopOpacity="1" />
                                            <stop offset="100%" stopColor="hsl(110,25%,7%)" stopOpacity="1" />
                                        </radialGradient>
                                        <radialGradient id={`gl${i}`} cx="50%" cy="30%" r="50%">
                                            <stop offset="0%" stopColor={`hsl(${p.accent})`} stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                                        </radialGradient>
                                    </defs>
                                    <rect width="320" height="400" fill={`url(#bg${i})`} />
                                    <rect width="320" height="400" fill={`url(#gl${i})`} />
                                    <g opacity="0.15" fill="none" stroke={`hsl(${p.accent})`} strokeWidth="0.5">
                                        {[60, 120, 180, 240].map(xx => <line key={xx} x1={xx} y1="0" x2={xx} y2="400" />)}
                                        {[80, 160, 240, 320].map(yy => <line key={yy} x1="0" y1={yy} x2="320" y2={yy} />)}
                                    </g>
                                    <path d="M100,60 L220,60 L240,110 L260,300 L200,310 L160,320 L120,310 L60,300 L80,110 Z"
                                        fill={`hsl(${p.accent})`} fillOpacity="0.12"
                                        stroke={`hsl(${p.accent})`} strokeOpacity="0.5" strokeWidth="0.8" opacity="0.7" />
                                    <path d="M100,60 Q80,50 60,80 L80,110" fill="none" stroke={`hsl(${p.accent})`} strokeOpacity="0.5" strokeWidth="0.8" opacity="0.7" />
                                    <path d="M220,60 Q240,50 260,80 L240,110" fill="none" stroke={`hsl(${p.accent})`} strokeOpacity="0.5" strokeWidth="0.8" opacity="0.7" />
                                    <text x="50%" y="388" textAnchor="middle" fontSize="8" fontFamily="'Space Grotesk',sans-serif" letterSpacing="4" fill={`hsl(${p.accent})`} fillOpacity="0.4" fontWeight="600">SS 2026</text>
                                </svg>
                                <div className="product-overlay">
                                    <button className="quick-add" onClick={() => addToCart(p.name, p.price, () => { })}>Quick Add</button>
                                </div>
                            </div>
                            <div className="product-info">
                                <div className="product-tag">{p.tag}</div>
                                <div className="product-name">{p.name}</div>
                                <div className="product-price">{p.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────── */}
            <section id="cta" className="reveal">
                <span className="cta-eyebrow">Limited Drop — While Stocks Last</span>
                <h2 className="cta-title">Own The<span>Moment.</span></h2>
                <p className="cta-sub">Join the community redefining what streetwear means. Curated drops. Zero compromise.</p>
                <Link to="/shop"><button className="cta-btn"><span>Join The Movement</span></button></Link>
            </section>

            {/* ── FOOTER ──────────────────────────────── */}
            <footer className="site-footer">
                <div className="foot-brand">
                    <span className="logo-mark">AMIANCE</span>
                    <p className="foot-desc">Premium streetwear for those who move with intention. Minimal by design. Bold by nature.</p>
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
                        <li><a href="/about">Our Story</a></li>
                        <li><a href="/shop">Lookbook</a></li>
                        <li><a href="/shop">Journal</a></li>
                        <li><a href="/shop">Sustainability</a></li>
                    </ul>
                </div>
                <div className="foot-col">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="/sizeguide">Sizing Guide</a></li>
                        <li><a href="/shipping">Shipping</a></li>
                        <li><a href="/returns">Returns</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
            </footer>
            <div className="foot-bottom">
                <span className="foot-copy">© 2026 AMIANCE. All rights reserved.</span>
                <div className="foot-social">
                    <a href="/about">LinkedIn</a>
                    <a href="#">Instagram</a>
                    <a href="#">Twitter</a>
                    <a href="#">TikTok</a>
                </div>
            </div>
        </>
    );
}

export default Home;