import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Navbar() {
    const { cartCount } = useCart();
    const location = useLocation();

    return (
        <nav className="navbar">
            {/* Logo — Link prevents full reload */}
            <Link to="/" className="logo-mark" style={{ textDecoration: "none" }}>
                AMIANCE
            </Link>

            <ul className="nav-links">
                <li>
                    <Link
                        to="/shop"
                        className={location.pathname === "/shop" ? "active" : ""}
                    >
                        Collections
                    </Link>
                </li>
                <li><a href="#">Lookbook</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Journal</a></li>
            </ul>

            {/* Cart button — Link wraps button so the whole thing is clickable */}
            <Link to="/cart" style={{ textDecoration: "none" }}>
                <button className="nav-cta">
                    Cart&nbsp;({cartCount})
                </button>
            </Link>
        </nav>
    );
}

export default Navbar;