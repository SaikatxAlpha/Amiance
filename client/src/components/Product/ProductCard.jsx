import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`}>
                <div className="product-img-wrap">
                    <img src={product.image} alt={product.name} />
                    <div className="product-img-overlay" />
                </div>
            </Link>

            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
                <button className="btn" onClick={() => addToCart(product)}>
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
}

export default ProductCard;