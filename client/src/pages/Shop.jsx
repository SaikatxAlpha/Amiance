import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import { useCart } from "../context/CartContext";
import { productsAPI } from "../services/api";

// Fallback static products in case API isn't running (with INR prices)
export const products = [
    {
        id: 1, _id: "static_1", name: "Oversized Utility Tee", price: 2499, tag: "Drop 01",
        category: "tops", badge: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        description: "Premium cotton oversized t-shirt. Breathable, relaxed fit for all-day comfort.",
        colorHex: "#386641",
    },
    {
        id: 2, _id: "static_2", name: "Phantom Fleece Hoodie", price: 3999, tag: "Drop 02",
        category: "tops", badge: "NEW",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        description: "Warm and stylish hoodie with a soft interior fleece lining.",
        colorHex: "#6a994e",
    },
    {
        id: 3, _id: "static_3", name: "Aged Denim Jacket", price: 6499, tag: "Drop 03",
        category: "outerwear", badge: "LIMITED",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        description: "Classic denim jacket with a modern streetwear cut.",
        colorHex: "#a7c957",
    },
    {
        id: 4, _id: "static_4", name: "Cargo Wide-Leg Pant", price: 4999, tag: "Drop 04",
        category: "bottoms", badge: "NEW",
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
        description: "Relaxed cargo pants with multiple utility pockets.",
        colorHex: "#386641",
    },
    {
        id: 5, _id: "static_5", name: "Structured Coach Jacket", price: 7999, tag: "Drop 05",
        category: "outerwear", badge: "SOLD OUT",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
        description: "Lightweight coach jacket, perfect for transitional weather.",
        colorHex: "#6a994e",
    },
    {
        id: 6, _id: "static_6", name: "Graphic Tee Vol.2", price: 2999, tag: "Drop 06",
        category: "tops", badge: null,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
        description: "Bold graphic tee made from 100% organic cotton.",
        colorHex: "#a7c957",
    },
];

const FILTERS = ["All", "Tops", "Bottoms", "Outerwear", "Accessories"];

function ShopProductCard({ product, index, featured }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (product.badge === "SOLD OUT") return;
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
    };

    const productId = product._id || product.id;

    return (
        <div className={`shop-card ${featured ? "shop-card--featured" : ""}`} data-index={index}>
            <Link to={`/product/${productId}`} className="shop-card__img-wrap">
                <img src={product.image} alt={product.name} className="shop-card__img" loading="lazy" />
                <div className="shop-card__overlay">
                    <button
                        className={`shop-card__add ${product.badge === "SOLD OUT" ? "shop-card__add--sold" : ""}`}
                        onClick={handleAdd}
                    >
                        {product.badge === "SOLD OUT" ? "Sold Out" : added ? "Added ✓" : "Quick Add"}
                    </button>
                    {product.badge !== "SOLD OUT" && (
                        <Link to={`/product/${productId}`} className="shop-card__view">
                            View Details →
                        </Link>
                    )}
                </div>
                {product.badge && (
                    <span className={`shop-card__badge shop-card__badge--${product.badge.toLowerCase().replace(" ", "-")}`}>
                        {product.badge}
                    </span>
                )}
                <span className="shop-card__num">{String(index + 1).padStart(2, "0")}</span>
            </Link>

            <div className="shop-card__info">
                <div className="shop-card__meta">
                    <span className="shop-card__tag">{product.tag}</span>
                    <span className="shop-card__category">{product.category}</span>
                </div>
                <h3 className="shop-card__name">{product.name}</h3>
                <div className="shop-card__bottom">
                    <span className="shop-card__price">₹{product.price.toLocaleString("en-IN")}</span>
                    <div className="shop-card__color" style={{ background: product.colorHex }} title="Color" />
                </div>
            </div>
        </div>
    );
}

function Shop() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [animating, setAnimating] = useState(false);
    const [allProducts, setAllProducts] = useState(products);
    const [loading, setLoading] = useState(true);
    const gridRef = useRef(null);

    // Try to load from API, fallback to static
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productsAPI.getAll();
                if (data.products && data.products.length > 0) {
                    setAllProducts(data.products);
                }
            } catch {
                // Use static fallback
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filtered = activeFilter === "All"
        ? allProducts
        : allProducts.filter(p => p.category === activeFilter.toLowerCase());

    const handleFilter = (f) => {
        if (f === activeFilter) return;
        setAnimating(true);
        setTimeout(() => { setActiveFilter(f); setAnimating(false); }, 250);
    };

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); }
            }),
            { threshold: 0.08 }
        );
        document.querySelectorAll(".shop-card, .shop-reveal").forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, [filtered]);

    return (
        <>
            <Navbar />

            <section className="shop-hero">
                <div className="shop-hero__bg-text" aria-hidden="true">AMIANCE</div>
                <div className="shop-hero__content">
                    <div className="shop-hero__eyebrow shop-reveal">
                        <span className="shop-hero__line" />
                        <span>Spring · Summer 2026</span>
                        <span className="shop-hero__line" />
                    </div>
                    <h1 className="shop-hero__title shop-reveal">
                        <span className="shop-hero__title-outline">THE</span>
                        <span className="shop-hero__title-solid">COLLECTION</span>
                    </h1>
                    <div className="shop-hero__stats shop-reveal">
                        <div className="shop-hero__stat">
                            <strong>{allProducts.length}</strong><span>Pieces</span>
                        </div>
                        <div className="shop-hero__divider" />
                        <div className="shop-hero__stat">
                            <strong>06</strong><span>Drops</span>
                        </div>
                        <div className="shop-hero__divider" />
                        <div className="shop-hero__stat">
                            <strong>100%</strong><span>Organic</span>
                        </div>
                        <div className="shop-hero__divider" />
                        <div className="shop-hero__stat">
                            <strong>SS26</strong><span>Season</span>
                        </div>
                    </div>
                </div>
                <span className="shop-hero__corner-tl">Wear The Streets</span>
                <span className="shop-hero__corner-br">Minimal · Bold · Limited</span>
            </section>

            <div className="shop-filters-wrap">
                <div className="shop-filters">
                    {FILTERS.map(f => (
                        <button key={f}
                            className={`shop-filter-btn ${activeFilter === f ? "shop-filter-btn--active" : ""}`}
                            onClick={() => handleFilter(f)}>
                            {f}
                            {f !== "Accessories" && (
                                <span className="shop-filter-count">
                                    {f === "All" ? allProducts.length : allProducts.filter(p => p.category === f.toLowerCase()).length}
                                </span>
                            )}
                        </button>
                    ))}
                    <div className="shop-filters__sortlabel">
                        <span>Sort: Featured</span>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
            </div>

            <section className="shop-section">
                {loading ? (
                    <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(167,201,87,0.4)", fontFamily: "'Bebas Neue',sans-serif", fontSize: "28px", letterSpacing: "0.2em" }}>
                        LOADING COLLECTION...
                    </div>
                ) : (
                    <div ref={gridRef} className={`shop-grid ${animating ? "shop-grid--exit" : ""}`}>
                        {filtered.length === 0 ? (
                            <div className="shop-empty">
                                <span>No pieces in this category yet.</span>
                                <button className="shop-filter-btn" onClick={() => setActiveFilter("All")}>View All</button>
                            </div>
                        ) : (
                            filtered.map((product, i) => (
                                <ShopProductCard
                                    key={product._id || product.id}
                                    product={product}
                                    index={i}
                                    featured={i === 0 && activeFilter === "All"}
                                />
                            ))
                        )}
                    </div>
                )}
            </section>

            <section className="shop-editorial shop-reveal">
                <div className="shop-editorial__left">
                    <p className="shop-editorial__label">The Philosophy</p>
                    <h2 className="shop-editorial__title">
                        Every drop is<br />
                        <em>unrepeatable.</em>
                    </h2>
                </div>
                <div className="shop-editorial__right">
                    <p>
                        We don't do restocks. We don't do trend-chasing. Every AMIANCE piece
                        is a limited conversation between craft and culture — once it's gone,
                        it's gone. That's not scarcity marketing. That's our promise.
                    </p>
                    <div className="shop-editorial__tags">
                        <span># Zero Waste</span>
                        <span># Organic Cotton</span>
                        <span># Limited Drops</span>
                        <span># Carbon Neutral</span>
                    </div>
                </div>
            </section>

            <div className="shop-foot-strip">
                <span>© 2026 AMIANCE — All Rights Reserved</span>
                <div>
                    <Link to="/">Home</Link>
                    <a href="/shop">Lookbook</a>
                    <a href="/shop">Sustainability</a>
                    <a href="/contact">Contact</a>
                </div>
            </div>
        </>
    );
}

export default Shop;