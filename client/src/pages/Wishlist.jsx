import { Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    return (
        <>
            <Navbar />
            <div className="wl-page">
                <div className="wl-header">
                    <div>
                        <p className="wl-eyebrow">Your Saved Pieces</p>
                        <h1 className="wl-title">Wishlist</h1>
                    </div>
                    {wishlist.length > 0 && (
                        <span className="wl-count">{wishlist.length} {wishlist.length === 1 ? "piece" : "pieces"} saved</span>
                    )}
                </div>

                {wishlist.length === 0 ? (
                    <div className="wl-empty">
                        <span className="wl-empty-icon">♡</span>
                        <h2>Nothing Saved Yet</h2>
                        <p>Explore the collection and save pieces you love before they're gone.</p>
                        <Link to="/shop">
                            <button className="btn-primary"><span>Browse Collection</span></button>
                        </Link>
                    </div>
                ) : (
                    <div className="wl-grid">
                        {wishlist.map((item) => (
                            <div key={item.id} className="wl-card">
                                <Link to={`/product/${item.id}`} className="wl-card-img-wrap">
                                    <img src={item.image} alt={item.name} className="wl-card-img" />
                                    {item.badge && (
                                        <span className={`wl-badge wl-badge--${item.badge.toLowerCase().replace(" ", "-")}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                                <div className="wl-card-info">
                                    <div>
                                        <p className="wl-card-tag">{item.tag} · {item.category}</p>
                                        <h3 className="wl-card-name">{item.name}</h3>
                                        <p className="wl-card-price">${item.price}</p>
                                    </div>
                                    <div className="wl-card-actions">
                                        <button
                                            className="wl-add-btn"
                                            onClick={() => { addToCart(item); removeFromWishlist(item.id); }}
                                            disabled={item.badge === "SOLD OUT"}
                                        >
                                            <span>{item.badge === "SOLD OUT" ? "Sold Out" : "Move to Cart"}</span>
                                            <span>→</span>
                                        </button>
                                        <button className="wl-remove-btn" onClick={() => removeFromWishlist(item.id)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .wl-page { padding:120px 60px 80px; background:var(--dark); min-height:100vh; animation:fade-in .4s ease both; }
                .wl-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:56px; border-bottom:1px solid rgba(167,201,87,0.08); padding-bottom:32px; }
                .wl-eyebrow { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:var(--g3); margin-bottom:12px; }
                .wl-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(48px,6vw,84px); color:var(--cream); line-height:.9; }
                .wl-count { font-family:'Space Grotesk',sans-serif; font-size:12px; font-weight:500; color:rgba(242,232,207,0.3); letter-spacing:0.1em; }

                .wl-empty { text-align:center; padding:100px 0; display:flex; flex-direction:column; align-items:center; gap:20px; animation:fadeSlideUp .5s ease both; }
                .wl-empty-icon { font-size:64px; color:rgba(188,71,73,0.4); animation:float 3s ease-in-out infinite; }
                .wl-empty h2 { font-family:'Bebas Neue',sans-serif; font-size:44px; color:var(--cream); }
                .wl-empty p { font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:300; color:var(--text-dim); margin-bottom:16px; }

                .wl-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
                .wl-card { background:var(--dark2); border:1px solid rgba(167,201,87,0.06); overflow:hidden; transition:border-color .4s ease,transform .4s ease; }
                .wl-card:hover { border-color:rgba(167,201,87,0.2); transform:translateY(-4px); }
                .wl-card-img-wrap { display:block; position:relative; height:280px; overflow:hidden; background:var(--dark3); }
                .wl-card-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .6s ease; }
                .wl-card:hover .wl-card-img { transform:scale(1.05); }
                .wl-badge { position:absolute; top:14px; left:14px; padding:5px 10px; font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:800; letter-spacing:0.18em; text-transform:uppercase; }
                .wl-badge--new { background:var(--g3); color:var(--dark); }
                .wl-badge--limited { background:rgba(188,71,73,0.9); color:#fff; }
                .wl-badge--bestseller { background:rgba(242,232,207,0.15); border:1px solid rgba(242,232,207,0.3); color:var(--cream); backdrop-filter:blur(8px); }
                .wl-badge--sold-out { background:rgba(20,20,20,0.85); border:1px solid rgba(188,71,73,0.4); color:rgba(188,71,73,0.8); }
                .wl-card-info { padding:20px 24px 24px; display:flex; flex-direction:column; gap:16px; }
                .wl-card-tag { font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:rgba(167,201,87,0.5); margin-bottom:6px; }
                .wl-card-name { font-family:'Space Grotesk',sans-serif; font-size:16px; font-weight:600; color:var(--cream); margin-bottom:6px; letter-spacing:0; }
                .wl-card-price { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:.05em; background:linear-gradient(90deg,var(--g2),var(--g3)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
                .wl-card-actions { display:flex; flex-direction:column; gap:8px; }
                .wl-add-btn { display:flex; align-items:center; justify-content:space-between; width:100%; padding:14px 20px; border:1px solid rgba(167,201,87,0.35); background:transparent; color:var(--g3); font-family:'Space Grotesk',sans-serif; font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; cursor:none; position:relative; overflow:hidden; transition:color .3s ease,border-color .3s ease; }
                .wl-add-btn::before { content:''; position:absolute; inset:0; background:var(--g3); transform:scaleX(0); transform-origin:left; transition:transform .35s ease; }
                .wl-add-btn:hover { color:var(--dark); }
                .wl-add-btn:hover::before { transform:scaleX(1); }
                .wl-add-btn span { position:relative; z-index:1; }
                .wl-add-btn:disabled { border-color:rgba(188,71,73,0.3); color:rgba(188,71,73,0.5); cursor:not-allowed; }
                .wl-add-btn:disabled::before { display:none; }
                .wl-remove-btn { background:none; border:none; color:rgba(188,71,73,0.4); font-family:'Space Grotesk',sans-serif; font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; cursor:none; padding:0; text-align:left; transition:color .3s ease; }
                .wl-remove-btn:hover { color:var(--red); }

                @media (max-width:1024px) { .wl-grid { grid-template-columns:repeat(2,1fr); } }
                @media (max-width:768px) { .wl-page { padding:100px 24px 60px; } .wl-grid { grid-template-columns:1fr; } .wl-header { flex-direction:column; align-items:flex-start; gap:12px; } }
            `}</style>
        </>
    );
}

export default Wishlist;