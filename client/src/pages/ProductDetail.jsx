import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import { useCart } from "../context/CartContext";
import { products } from "./Shop";

function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const product = products.find((p) => p.id === Number(id));

    if (!product) {
        return (
            <>
                <Navbar />
                <div className="container cart-empty">
                    <div className="cart-empty-icon">🔍</div>
                    <h2>Product Not Found</h2>
                    <p>This item doesn't exist or has been removed.</p>
                    <button className="btn" onClick={() => navigate("/shop")}>Back to Shop</button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container product-detail-page">
                <div className="back-btn" onClick={() => navigate(-1)}>← Back</div>
                <div className="product-detail">
                    <div className="product-detail-img-wrap">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="details">
                        <div className="detail-badge">In Stock</div>
                        <h1>{product.name}</h1>
                        <p className="price">${product.price}</p>
                        <p>{product.description}</p>
                        <button className="btn" onClick={() => addToCart(product)}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductDetail;