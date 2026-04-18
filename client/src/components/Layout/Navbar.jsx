import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import "./navbar.css"

function Navbar() {
    const { cartCount } = useCart();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close menu on route change
    useEffect(() => setMenuOpen(false), [location]);

    return (
        <>
            <nav className={`navbar glass-nav ${scrolled ? "navbar--scrolled" : ""}`}>
                {/* Logo */}
                <Link to="/" className="nav-logo">AMIANCE</Link>

                {/* Center links */}
                <ul className="nav-links">
                    <li><Link to="/shop" className={isActive("/shop") ? "active" : ""}>Collections</Link></li>
                    <li><a href="#">Lookbook</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Journal</a></li>
                </ul>

                {/* Right cluster */}
                <div className="nav-right">
                    <Link to="/login" className="nav-login">
                        Log In
                    </Link>
                    <Link to="/signup" className="nav-signup">
                        <span>Sign Up</span>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="nav-signup-arrow">
                            <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                    <Link to="/cart" className="nav-cart-link">
                        <button className="nav-cta">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="nav-cart-icon">
                                <path d="M1 1h2l1.5 7.5h7L13 4H4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="6" cy="12" r="1" fill="currentColor" />
                                <circle cx="11" cy="12" r="1" fill="currentColor" />
                            </svg>
                            <span>Cart</span>
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </button>
                    </Link>

                    {/* Hamburger (mobile) */}
                    <button
                        className={`nav-hamburger ${menuOpen ? "nav-hamburger--open" : ""}`}
                        onClick={() => setMenuOpen(v => !v)}
                        aria-label="Menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            {/* Mobile drawer */}
            <div className={`nav-drawer ${menuOpen ? "nav-drawer--open" : ""}`}>
                <div className="nav-drawer__inner">
                    <ul className="nav-drawer__links">
                        <li><Link to="/shop">Collections</Link></li>
                        <li><a href="#">Lookbook</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Journal</a></li>
                    </ul>
                    <div className="nav-drawer__divider" />
                    <div className="nav-drawer__auth">
                        <Link to="/login" className="nav-drawer__login">Log In</Link>
                        <Link to="/signup" className="nav-drawer__signup">
                            <span>Create Account</span>
                        </Link>
                    </div>
                    <Link to="/cart" className="nav-drawer__cart">
                        <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1h2l1.5 7.5h7L13 4H4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="6" cy="12" r="1" fill="currentColor" />
                            <circle cx="11" cy="12" r="1" fill="currentColor" />
                        </svg>
                        Cart {cartCount > 0 && <span className="nav-drawer__badge">{cartCount}</span>}
                    </Link>
                </div>
            </div>
            {menuOpen && <div className="nav-drawer__backdrop" onClick={() => setMenuOpen(false)} />}
        </>
    );
}

export default Navbar;