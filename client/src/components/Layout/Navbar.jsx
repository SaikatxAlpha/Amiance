import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Navbar() {
    const { cartCount } = useCart();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar glass-nav">
            {/* Glass morphism background layer */}
            <div className="nav-glass-bg" />

            <Link to="/" className="logo-mark nav-logo">
                AMIANCE
            </Link>

            <ul className="nav-links">
                <li>
                    <Link to="/shop" className={isActive("/shop") ? "active" : ""}>
                        Collections
                    </Link>
                </li>
                <li><a href="#">Lookbook</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Journal</a></li>
            </ul>

            <Link to="/cart" className="nav-cart-link">
                <button className="nav-cta">
                    Cart
                    {cartCount > 0 && (
                        <span className="cart-badge">{cartCount}</span>
                    )}
                </button>
            </Link>
        </nav>
    );
}

export default Navbar;