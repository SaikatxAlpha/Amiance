import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";

const PILLARS = [
    { num: "01", title: "Zero Waste Production", body: "Every offcut is repurposed. Every batch is capped. We design scarcity into the supply chain, not the brand." },
    { num: "02", title: "GOTS-Certified Fabric", body: "100% organic cotton from Fair Trade farms. Certified by the Global Organic Textile Standard — no exceptions." },
    { num: "03", title: "Drop Culture, Elevated", body: "No restock. No compromise. Each piece is a limited conversation between craft and culture." },
    { num: "04", title: "Carbon-Neutral Shipping", body: "Every order ships via certified carbon-neutral partners. Full tracking, zero guilt, worldwide." },
];

const TEAM = [
    { name: "Mira Noel", role: "Creative Director", quote: "We make things for people who lead." },
    { name: "Kai Rivers", role: "Head of Design", quote: "Every stitch is a decision." },
    { name: "Sam Achebe", role: "Sustainability Lead", quote: "The planet is part of the collection." },
];

const NUMBERS = [
    { num: "2021", label: "Founded" },
    { num: "500+", label: "Happy Customers" },
    { num: "30+", label: "Exclusive Drops" },
    { num: "100%", label: "Organic Cotton" },
];

function About() {
    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add("abt-in"); obs.unobserve(e.target); }
            }),
            { threshold: 0.1 }
        );
        document.querySelectorAll(".abt-reveal").forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <>
            <Navbar />
            <div className="abt-page">

                {/* ── HERO ── */}
                <section className="abt-hero">
                    <div className="abt-hero-bg-text" aria-hidden="true">STORY</div>
                    <div className="abt-hero-content">
                        <p className="abt-eyebrow abt-reveal">Our Philosophy</p>
                        <h1 className="abt-hero-title abt-reveal">
                            <span className="abt-title-outline">BUILT</span>
                            <span className="abt-title-outline">FOR THE</span>
                            <span className="abt-title-solid">BOLD.</span>
                        </h1>
                        <p className="abt-hero-desc abt-reveal">
                            AMIANCE was born in 2026 with one conviction — that streetwear
                            could be responsible, radical, and unrepeatable. We don't chase
                            trends. We set them, then walk away.
                        </p>
                    </div>
                    <div className="abt-hero-num-strip abt-reveal">
                        {NUMBERS.map(n => (
                            <div key={n.label} className="abt-hero-num">
                                <strong>{n.num}</strong>
                                <span>{n.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── MANIFESTO ── */}
                <section className="abt-manifesto">
                    <div className="abt-manifesto-left abt-reveal">
                        <p className="abt-section-label">The Manifesto</p>
                        <h2 className="abt-manifesto-quote">
                            "We don't do<br />
                            <em>restocks.</em><br />
                            We don't do<br />
                            <em>trend-chasing.</em>"
                        </h2>
                    </div>
                    <div className="abt-manifesto-right abt-reveal">
                        <p>
                            Every AMIANCE piece is a limited conversation between craft and culture.
                            Once it's gone, it's gone. That's not scarcity marketing — that's our
                            promise to you and to the planet.
                        </p>
                        <p>
                            We partner with ex-Maison Margiela pattern cutters, GOTS-certified
                            mills, and Fair Trade artisans to ensure that every thread you wear
                            carries zero compromise from field to wardrobe.
                        </p>
                        <Link to="/shop">
                            <button className="btn-primary" style={{ marginTop: "32px" }}>
                                <span>Explore the Collection</span>
                            </button>
                        </Link>
                    </div>
                </section>

                {/* ── PILLARS ── */}
                <section className="abt-pillars">
                    <div className="abt-pillars-head abt-reveal">
                        <p className="abt-section-label">What We Stand For</p>
                        <h2 className="abt-pillars-title">Our Four Commitments.</h2>
                    </div>
                    <div className="abt-pillars-grid">
                        {PILLARS.map((p, i) => (
                            <div key={p.num} className="abt-pillar abt-reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                                <span className="abt-pillar-num">{p.num}</span>
                                <h3 className="abt-pillar-title">{p.title}</h3>
                                <p className="abt-pillar-body">{p.body}</p>
                                <div className="abt-pillar-line" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── TEAM ── */}
                <section className="abt-team">
                    <div className="abt-team-head abt-reveal">
                        <p className="abt-section-label">The Minds Behind It</p>
                        <h2 className="abt-team-title">Our People.</h2>
                    </div>
                    <div className="abt-team-grid">
                        {TEAM.map((t, i) => (
                            <div key={t.name} className="abt-team-card abt-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                                <div className="abt-team-avatar">
                                    <span>{t.name.split(" ").map(n => n[0]).join("")}</span>
                                </div>
                                <div className="abt-team-info">
                                    <h3 className="abt-team-name">{t.name}</h3>
                                    <p className="abt-team-role">{t.role}</p>
                                    <p className="abt-team-quote">"{t.quote}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="abt-cta abt-reveal">
                    <p className="abt-eyebrow">Ready to wear intention?</p>
                    <h2 className="abt-cta-title">Own The<span>Moment.</span></h2>
                    <Link to="/shop">
                        <button className="abt-cta-btn"><span>Shop the Drop</span></button>
                    </Link>
                </section>

            </div>

            <style>{`
                .abt-page { padding-top: 72px; background: var(--dark); }

                /* Hero */
                .abt-hero { position:relative; min-height:80vh; padding:80px 60px 72px; display:flex; flex-direction:column; justify-content:flex-end; overflow:hidden; border-bottom:1px solid rgba(167,201,87,0.08); }
                .abt-hero::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 60% 70% at 80% 20%,rgba(56,102,65,0.18) 0%,transparent 60%); pointer-events:none; }
                .abt-hero-bg-text { position:absolute; bottom:-24px; right:-8px; font-family:'Bebas Neue',sans-serif; font-size:clamp(120px,20vw,260px); color:transparent; -webkit-text-stroke:1px rgba(167,201,87,0.05); pointer-events:none; user-select:none; line-height:1; letter-spacing:-0.02em; }
                .abt-hero-content { position:relative; z-index:2; max-width:900px; margin-bottom:64px; }
                .abt-eyebrow { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:var(--g3); margin-bottom:24px; }
                .abt-hero-title { display:flex; flex-direction:column; gap:0; margin-bottom:32px; }
                .abt-title-outline { font-family:'Bebas Neue',sans-serif; font-size:clamp(72px,11vw,160px); line-height:.88; color:transparent; -webkit-text-stroke:1.5px rgba(242,232,207,0.15); letter-spacing:.04em; }
                .abt-title-solid { font-family:'Bebas Neue',sans-serif; font-size:clamp(72px,11vw,160px); line-height:.88; background:linear-gradient(135deg,var(--cream) 0%,var(--g4) 40%,var(--g3) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:.04em; }
                .abt-hero-desc { font-family:'Space Grotesk',sans-serif; font-size:16px; font-weight:300; line-height:1.9; color:rgba(242,232,207,0.45); max-width:480px; }
                .abt-hero-num-strip { display:flex; gap:0; position:relative; z-index:2; border-top:1px solid rgba(167,201,87,0.08); padding-top:40px; }
                .abt-hero-num { flex:1; padding-right:32px; }
                .abt-hero-num strong { display:block; font-family:'Bebas Neue',sans-serif; font-size:42px; letter-spacing:.05em; background:linear-gradient(135deg,var(--g3),var(--g4)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1; margin-bottom:6px; }
                .abt-hero-num span { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:rgba(242,232,207,0.3); }

                /* Manifesto */
                .abt-manifesto { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; padding:100px 60px; border-bottom:1px solid rgba(167,201,87,0.08); }
                .abt-section-label { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:var(--g3); margin-bottom:24px; }
                .abt-manifesto-quote { font-family:'Bebas Neue',sans-serif; font-size:clamp(42px,5vw,68px); line-height:.95; color:var(--cream); letter-spacing:.02em; }
                .abt-manifesto-quote em { font-family:'Playfair Display',serif; font-style:italic; font-size:.85em; background:linear-gradient(90deg,var(--g2),var(--g3)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; font-weight:400; }
                .abt-manifesto-right p { font-family:'Space Grotesk',sans-serif; font-size:15px; font-weight:300; line-height:1.9; color:rgba(242,232,207,0.45); margin-bottom:20px; }

                /* Pillars */
                .abt-pillars { padding:100px 60px; border-bottom:1px solid rgba(167,201,87,0.08); }
                .abt-pillars-head { margin-bottom:60px; }
                .abt-pillars-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(42px,5vw,72px); color:var(--cream); letter-spacing:.02em; line-height:.9; }
                .abt-pillars-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:2px; }
                .abt-pillar { background:var(--dark2); padding:40px 32px; position:relative; border:1px solid rgba(167,201,87,0.06); transition:border-color .4s ease,background .4s ease; }
                .abt-pillar:hover { border-color:rgba(167,201,87,0.2); background:var(--dark3); }
                .abt-pillar-num { font-family:'Bebas Neue',sans-serif; font-size:11px; letter-spacing:0.2em; color:rgba(167,201,87,0.4); margin-bottom:16px; display:block; }
                .abt-pillar-title { font-family:'Space Grotesk',sans-serif; font-size:16px; font-weight:600; color:var(--cream); margin-bottom:14px; letter-spacing:0; line-height:1.3; }
                .abt-pillar-body { font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:300; line-height:1.8; color:rgba(242,232,207,0.35); margin-bottom:24px; }
                .abt-pillar-line { height:1px; background:linear-gradient(90deg,var(--g3),transparent); width:40px; }

                /* Team */
                .abt-team { padding:100px 60px; border-bottom:1px solid rgba(167,201,87,0.08); }
                .abt-team-head { margin-bottom:60px; }
                .abt-team-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(42px,5vw,72px); color:var(--cream); letter-spacing:.02em; line-height:.9; }
                .abt-team-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
                .abt-team-card { background:var(--dark2); border:1px solid rgba(167,201,87,0.06); padding:40px 32px; display:flex; flex-direction:column; gap:20px; transition:border-color .4s ease,transform .4s ease; cursor:default; }
                .abt-team-card:hover { border-color:rgba(167,201,87,0.2); transform:translateY(-6px); }
                .abt-team-avatar { width:64px; height:64px; border-radius:50%; border:1px solid rgba(167,201,87,0.2); display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,rgba(56,102,65,0.3),rgba(167,201,87,0.1)); }
                .abt-team-avatar span { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:.05em; color:var(--g3); }
                .abt-team-name { font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:600; color:var(--cream); margin-bottom:4px; letter-spacing:0; }
                .abt-team-role { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(167,201,87,0.5); margin-bottom:16px; }
                .abt-team-quote { font-family:'Playfair Display',serif; font-style:italic; font-size:14px; color:rgba(242,232,207,0.35); line-height:1.7; }

                /* CTA */
                .abt-cta { padding:100px 60px; text-align:center; position:relative; overflow:hidden; background:var(--dark2); }
                .abt-cta::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 100%,rgba(56,102,65,0.2) 0%,transparent 65%); pointer-events:none; }
                .abt-cta-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(54px,8vw,110px); line-height:.88; color:var(--cream); margin-bottom:40px; position:relative; z-index:1; }
                .abt-cta-title span { display:block; color:transparent; -webkit-text-stroke:1px rgba(242,232,207,0.15); }
                .abt-cta-btn { display:inline-flex; align-items:center; gap:16px; border:1px solid var(--g3); padding:20px 56px; font-family:'Space Grotesk',sans-serif; font-size:12px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:var(--g3); background:transparent; cursor:none; position:relative; z-index:1; overflow:hidden; transition:color .4s ease,box-shadow .4s ease; }
                .abt-cta-btn::before { content:''; position:absolute; inset:0; background:var(--g3); transform:scaleX(0); transform-origin:left; transition:transform .4s var(--ease-out); }
                .abt-cta-btn:hover { color:var(--dark); box-shadow:0 0 60px rgba(167,201,87,0.2); }
                .abt-cta-btn:hover::before { transform:scaleX(1); }
                .abt-cta-btn span { position:relative; z-index:1; }

                /* Reveal animation */
                .abt-reveal { opacity:0; transform:translateY(28px); transition:opacity .7s ease,transform .7s ease; }
                .abt-reveal.abt-in { opacity:1; transform:translateY(0); }

                @media (max-width:1024px) {
                    .abt-pillars-grid { grid-template-columns:1fr 1fr; }
                    .abt-manifesto { grid-template-columns:1fr; gap:40px; }
                }
                @media (max-width:768px) {
                    .abt-hero,.abt-manifesto,.abt-pillars,.abt-team,.abt-cta { padding-left:24px; padding-right:24px; }
                    .abt-team-grid { grid-template-columns:1fr; }
                    .abt-pillars-grid { grid-template-columns:1fr; }
                    .abt-hero-num-strip { flex-wrap:wrap; gap:24px; }
                }
            `}</style>
        </>
    );
}

export default About;