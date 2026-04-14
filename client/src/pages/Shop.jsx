import Navbar from "../components/Layout/Navbar";
import ProductCard from "../components/Product/ProductCard";
import ParticleCanvas from "../components/Effects/ParticleCanvas";

export const products = [
    { id: 1, name: "Oversized T-Shirt", price: 29, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", description: "Premium cotton oversized t-shirt. Breathable, relaxed fit for all-day comfort." },
    { id: 2, name: "Hoodie", price: 49, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", description: "Warm and stylish hoodie with a soft interior fleece lining." },
    { id: 3, name: "Denim Jacket", price: 79, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80", description: "Classic denim jacket with a modern streetwear cut." },
    { id: 4, name: "Cargo Pants", price: 59, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", description: "Relaxed cargo pants with multiple utility pockets." },
    { id: 5, name: "Bomber Jacket", price: 89, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", description: "Lightweight bomber jacket, perfect for transitional weather." },
    { id: 6, name: "Graphic Tee", price: 35, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", description: "Bold graphic tee made from 100% organic cotton." },
];

const features = [
    { num: "01", title: "Organic Materials", desc: "Every fabric is 100% organic and ethically sourced, soft on skin and the planet." },
    { num: "02", title: "Limited Drops", desc: "We never mass-produce. Each run is exclusive, numbered, and never repeated." },
    { num: "03", title: "Free Returns", desc: "Not your vibe? Send it back within 30 days. No questions asked." },
];

const stats = [
    { num: "500+", label: "Happy Customers" },
    { num: "6", label: "Product Lines" },
    { num: "30", label: "Day Returns" },
    { num: "4.9★", label: "Average Rating" },
];

function Shop() {
    return (
        <>
            <Navbar />

            {/* COLLECTION */}
            <div className="container shop">
                <div className="shop-header">
                    <div>
                        <h1>Collection</h1>
                    </div>
                    <p>{products.length} Pieces</p>
                </div>
                <div className="shop-grid">
                    {products.map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            </div>

            {/* FEATURES + PARTICLE CANVAS */}
            <div className="container features-section">
                <div className="feat-left">
                    <div className="section-eyebrow">
                        <div className="eyebrow-line" />
                        <span className="eyebrow-label">Why Zozo</span>
                    </div>
                    <h2 className="section-title">Built Different.</h2>
                    <p className="section-sub">Every piece is a statement. Here's what sets us apart.</p>
                    <div className="feat-list">
                        {features.map((f) => (
                            <div key={f.num} className="feat-item">
                                <span className="feat-num">{f.num}</span>
                                <div>
                                    <div className="feat-title">{f.title}</div>
                                    <div className="feat-desc">{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="feat-right">
                    <div id="pcanvas-wrap">
                        <ParticleCanvas mini={true} />
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="container stats-section">
                <div className="section-eyebrow">
                    <div className="eyebrow-line" />
                    <span className="eyebrow-label">The Numbers</span>
                </div>
                <h2 className="section-title" style={{ marginBottom: "44px" }}>By the Numbers.</h2>
                <div className="stats-grid">
                    {stats.map((s) => (
                        <div key={s.label} className="stat-item">
                            <div className="stat-num">{s.num}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Shop;