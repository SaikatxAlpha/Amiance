import { Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";

function NotFound() {
    return (
        <>
            <Navbar />
            <div className="nf-page">
                <div className="nf-bg-num">404</div>
                <div className="nf-content">
                    <p className="nf-eyebrow">Page Not Found</p>
                    <h1 className="nf-title">
                        <span className="nf-title-outline">Lost</span>
                        <span className="nf-title-solid">In The Streets.</span>
                    </h1>
                    <p className="nf-desc">
                        This page doesn't exist — or it's been moved to another drop.
                        <br />Head back and keep exploring the collection.
                    </p>
                    <div className="nf-actions">
                        <Link to="/">
                            <button className="btn-primary"><span>Back to Home</span></button>
                        </Link>
                        <Link to="/shop">
                            <button className="btn-ghost">View Collection <span className="arrow" /></button>
                        </Link>
                    </div>
                </div>

                {/* Decorative grid lines */}
                <div className="nf-grid-lines" aria-hidden="true">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="nf-grid-line" />
                    ))}
                </div>
            </div>

            <style>{`
                .nf-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    padding: 120px 60px 80px;
                    background: var(--dark);
                }
                .nf-bg-num {
                    position: absolute;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(180px, 28vw, 380px);
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(167,201,87,0.06);
                    letter-spacing: -0.04em;
                    pointer-events: none;
                    user-select: none;
                    line-height: 1;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    white-space: nowrap;
                }
                .nf-content {
                    position: relative;
                    z-index: 2;
                    text-align: center;
                    max-width: 640px;
                    animation: fadeSlideUp .7s ease both;
                }
                .nf-eyebrow {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    color: var(--g3);
                    margin-bottom: 28px;
                }
                .nf-title {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    margin-bottom: 32px;
                    line-height: .9;
                }
                .nf-title-outline {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(72px, 10vw, 130px);
                    color: transparent;
                    -webkit-text-stroke: 1.5px rgba(242,232,207,0.2);
                    letter-spacing: .04em;
                }
                .nf-title-solid {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(72px, 10vw, 130px);
                    background: linear-gradient(135deg, var(--cream) 0%, var(--g4) 40%, var(--g3) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: .04em;
                }
                .nf-desc {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 15px;
                    font-weight: 300;
                    line-height: 1.9;
                    color: rgba(242,232,207,0.4);
                    margin-bottom: 48px;
                }
                .nf-actions {
                    display: flex;
                    gap: 24px;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .nf-grid-lines {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    justify-content: space-between;
                    pointer-events: none;
                    z-index: 0;
                }
                .nf-grid-line {
                    width: 1px;
                    height: 100%;
                    background: linear-gradient(to bottom, transparent, rgba(167,201,87,0.04), transparent);
                }
            `}</style>
        </>
    );
}

export default NotFound;