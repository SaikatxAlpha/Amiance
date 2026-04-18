import Navbar from "../components/Layout/Navbar";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Cart() {
    const { cart, removeFromCart, updateQty } = useCart();
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = cart.length > 0 ? 5 : 0;
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
                        <div className="cart-empty-auth">
                            <span>Already have an account?</span>
                            <Link to="/login" className="cart-empty-login">Log In →</Link>
                        </div>
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
                    <span className="cart-page-count">{cart.reduce((a, i) => a + i.qty, 0)} item{cart.reduce((a, i) => a + i.qty, 0) !== 1 ? "s" : ""}</span>
                </div>

                <div className="cart-layout">
                    {/* ── Items ── */}
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img
                                    className="cart-item-img"
                                    src={item.image}
                                    alt={item.name}
                                />
                                <div className="cart-item-info">
                                    <div className="cart-item-tag">{item.tag}</div>
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-price">${item.price}</div>
                                </div>
                                <div className="qty-control">
                                    <button onClick={() => updateQty(item.id, -1)}>−</button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, +1)}>+</button>
                                </div>
                                <button
                                    className="btn-remove"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        <Link to="/shop" className="cart-continue-link">
                            <button className="btn-ghost">
                                ← Continue Shopping
                            </button>
                        </Link>
                    </div>

                    {/* ── Summary ── */}
                    <div className="cart-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="summary-shipping">
                                {subtotal >= 80 ? <span className="summary-free">Free</span> : `$${shipping.toFixed(2)}`}
                            </span>
                        </div>
                        {subtotal > 0 && subtotal < 80 && (
                            <div className="summary-freeship-hint">
                                Add <strong>${(80 - subtotal).toFixed(2)}</strong> more for free shipping
                            </div>
                        )}

                        <div className="summary-total">
                            <span>Total</span>
                            <span className="total-price">${(subtotal >= 80 ? subtotal : total).toFixed(2)}</span>
                        </div>

                        <button className="btn-primary cart-checkout-btn">
                            <span>Proceed to Checkout</span>
                        </button>

                        {/* ── Auth prompt ── */}
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

                        {/* Trust badges */}
                        <div className="cart-trust">
                            <div className="cart-trust-item">
                                <span>🔒</span> Secure checkout
                            </div>
                            <div className="cart-trust-item">
                                <span>↩</span> Free returns
                            </div>
                            <div className="cart-trust-item">
                                <span>⚡</span> 48h dispatch
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;