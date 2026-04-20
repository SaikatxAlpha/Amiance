import Navbar from "../components/Layout/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
    const { cart, removeFromCart, updateQty } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = subtotal >= 2000 ? 0 : cart.length > 0 ? 99 : 0;
    const total = subtotal + shipping;

    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <div className="container cart-page">
                    <h1>Cart</h1>
                    <div className="cart-empty">
                        <span className="cart-empty-icon">🛒</span>
                        <h2>Your Cart Is Empty</h2>
                        <p>Add some pieces to get started.</p>
                        <Link to="/shop">
                            <button className="btn-primary"><span>Browse Collection</span></button>
                        </Link>
                        {!user && (
                            <div className="cart-empty-auth">
                                <span>Already have an account?</span>
                                <Link to="/login" className="cart-empty-login">Log In →</Link>
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container cart-page">
                <div className="cart-page-header">
                    <h1>Your Cart</h1>
                    <span className="cart-page-count">
                        {cart.reduce((a, i) => a + i.qty, 0)} item{cart.reduce((a, i) => a + i.qty, 0) !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="cart-layout">
                    {/* Items */}
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={`${item.id || item._id}-${item.size}`} className="cart-item">
                                <img className="cart-item-img" src={item.image} alt={item.name} />
                                <div className="cart-item-info">
                                    {item.tag && <div className="cart-item-tag">{item.tag}</div>}
                                    <div className="cart-item-name">{item.name}</div>
                                    {item.size && (
                                        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "10px", color: "rgba(242,232,207,0.3)", marginTop: "2px" }}>
                                            Size: {item.size}
                                        </div>
                                    )}
                                    <div className="cart-item-price">₹{item.price.toLocaleString("en-IN")}</div>
                                </div>
                                <div className="qty-control">
                                    <button onClick={() => updateQty(item.id || item._id, -1)}>−</button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => updateQty(item.id || item._id, +1)}>+</button>
                                </div>
                                <button className="btn-remove" onClick={() => removeFromCart(item.id || item._id)}>✕</button>
                            </div>
                        ))}

                        <Link to="/shop" className="cart-continue-link">
                            <button className="btn-ghost">← Continue Shopping</button>
                        </Link>
                    </div>

                    {/* Summary */}
                    <div className="cart-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>
                                {subtotal >= 2000
                                    ? <span className="summary-free">Free</span>
                                    : `₹${shipping}`}
                            </span>
                        </div>
                        {subtotal > 0 && subtotal < 2000 && (
                            <div className="summary-freeship-hint">
                                Add <strong>₹{(2000 - subtotal).toLocaleString("en-IN")}</strong> more for free shipping
                            </div>
                        )}

                        <div className="summary-total">
                            <span>Total</span>
                            <span className="total-price">₹{total.toLocaleString("en-IN")}</span>
                        </div>

                        <button
                            className="btn-primary cart-checkout-btn"
                            onClick={() => navigate("/checkout")}
                        >
                            <span>Proceed to Checkout</span>
                        </button>

                        {/* COD badge */}
                        <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Space Grotesk',sans-serif", fontSize: "10px", color: "rgba(242,232,207,0.3)", letterSpacing: "0.08em" }}>
                            <span style={{ color: "var(--g3)" }}>💵</span>
                            Cash on Delivery available
                        </div>

                        {/* Auth prompt */}
                        {!user && (
                            <div className="cart-auth-prompt">
                                <div className="cart-auth-divider">
                                    <span className="cart-auth-divider-line" />
                                    <span className="cart-auth-divider-text">or</span>
                                    <span className="cart-auth-divider-line" />
                                </div>
                                <p className="cart-auth-text">
                                    Sign in for faster checkout,<br />
                                    order tracking &amp; exclusive drops.
                                </p>
                                <div className="cart-auth-btns">
                                    <Link to="/login" className="cart-auth-login">Log In</Link>
                                    <Link to="/signup" className="cart-auth-signup">
                                        <span>Create Account</span>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Trust */}
                        <div className="cart-trust">
                            <div className="cart-trust-item"><span>🔒</span> Secure checkout</div>
                            <div className="cart-trust-item"><span>↩</span> Free returns</div>
                            <div className="cart-trust-item"><span>⚡</span> 48h dispatch</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;