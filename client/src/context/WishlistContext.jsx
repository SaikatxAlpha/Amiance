import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);

    const addToWishlist = (product) => {
        setWishlist((prev) => {
            if (prev.find((item) => item.id === product.id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
    };

    const isWishlisted = (id) => wishlist.some((item) => item.id === id);

    const wishlistCount = wishlist.length;

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted, wishlistCount }}>
            {children}
        </WishlistContext.Provider>
    );
}

export default WishlistProvider;