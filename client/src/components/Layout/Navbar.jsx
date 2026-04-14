import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Navbar() {
    const { cartCount } = useCart();
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/">
                    <h2 className="logo">Zozo</h2>
                </Link>

                <div className="nav-links">
                    <Link to="/" className={location.pathname === "/" ? "active" : ""}>
                        Home
                    </Link>
                    <Link to="/shop" className={location.pathname === "/shop" ? "active" : ""}>
                        Shop
                    </Link>
                    <Link
                        to="/cart"
                        className={`nav-cart-link ${location.pathname === "/cart" ? "active" : ""}`}
                    >
                        Cart
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;