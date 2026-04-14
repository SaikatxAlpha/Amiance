import Navbar from "../components/Layout/Navbar";
import ParticleCanvas from "../components/Effects/ParticleCanvas";
import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <Navbar />

            <div className="container home" style={{ position: "relative" }}>
                <ParticleCanvas />
                <div className="home-grid-bg" />

                <div className="home-content">
                    <div className="home-eyebrow">
                        <span className="home-eyebrow-dot" />
                        New Collection 2025
                    </div>

                    <h1>
                        Wear the
                        <span className="highlight">Streets.</span>
                    </h1>

                    <p className="home-desc">
                        Premium streetwear crafted for those who move with intention.
                        Minimal by design, bold by nature.
                    </p>

                    <div className="home-actions">
                        <Link to="/shop">
                            <button className="btn">Shop Collection →</button>
                        </Link>
                        <Link to="/shop">
                            <button className="btn-outline">View Lookbook</button>
                        </Link>
                    </div>

                    <div className="home-badges">
                        <div className="avatar-stack">
                            {["A", "R", "P", "S", "M"].map((l, i) => (
                                <div key={i} className="avatar">{l}</div>
                            ))}
                        </div>
                        <div>
                            <div className="stars">★★★★★</div>
                            <div className="badge-text">Loved by <strong>500+</strong> customers</div>
                        </div>
                    </div>
                </div>

                <div className="home-floats">
                    {[
                        { icon: "⚡", label: "Fast Shipping", sub: "Delivered in 3–5 days" },
                        { icon: "✦", label: "Premium Quality", sub: "100% organic cotton" },
                        { icon: "◈", label: "500+ Drops", sub: "Exclusive limited runs" },
                    ].map((c, i) => (
                        <div key={i} className="home-float-card">
                            <div className="float-icon">{c.icon}</div>
                            <div>
                                <div className="float-label">{c.label}</div>
                                <div className="float-sub">{c.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Home;