import Navbar from "../components/Layout/Navbar";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Cart() {
    const { cart, removeFromCart } = useCart();
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
                        <div className="cart-empty-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Add some pieces to get started</p>
                        <Link to="/shop">
                            <button className="btn">Browse Collection</button>
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
                <p className="cart-subtitle">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img className="cart-item-img" src={item.image} alt={item.name} />
                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <div className="cart-item-meta">
                                        <span className="cart-item-price">${item.price}</span>
                                        <span className="cart-item-qty">× {item.qty}</span>
                                        <span className="cart-item-subtotal">
                                            Subtotal: ${(item.price * item.qty).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className="summary-row"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                        <div className="summary-divider" />
                        <div className="summary-total">
                            <span>Total</span>
                            <span className="summary-total-price">${total.toFixed(2)}</span>
                        </div>
                        <button className="btn">Checkout</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;