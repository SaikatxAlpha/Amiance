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
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container cart-page">
                <h1>Your Cart</h1>

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
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-price">${item.price}</div>
                                </div>

                                {/* Qty stepper */}
                                <div className="qty-control">
                                    <button onClick={() => updateQty(item.id, -1)}>−</button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, +1)}>+</button>
                                </div>

                                <button
                                    className="btn-remove"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
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
                            <span>${shipping.toFixed(2)}</span>
                        </div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span className="total-price">${total.toFixed(2)}</span>
                        </div>

                        <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "18px", marginTop: "16px" }}>
                            <span>Checkout</span>
                        </button>

                        <Link to="/shop" style={{ display: "block", textAlign: "center", marginTop: "16px" }}>
                            <button className="btn-ghost">
                                Continue Shopping <span className="arrow" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;