import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

const WISHLIST_KEY = "amiance_wishlist";

function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const { user } = useAuth();

    /* ── Load wishlist on mount / user change ─────────────── */
    useEffect(() => {
        const stored = localStorage.getItem(WISHLIST_KEY);
        setWishlist(stored ? JSON.parse(stored) : []);
    }, [user?._id]);

    /* ── Persist on every change ──────────────────────────── */
    useEffect(() => {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }, [wishlist]);

    /* ── addToWishlist ────────────────────────────────────── */
    const addToWishlist = useCallback((product) => {
        const productId = product._id || product.id;
        setWishlist((prev) => {
            if (prev.find((i) => (i._id || i.id) === productId)) return prev;
            return [...prev, { ...product, _id: productId, id: productId }];
        });
    }, []);

    /* ── removeFromWishlist ───────────────────────────────── */
    const removeFromWishlist = useCallback((id) => {
        setWishlist((prev) =>
            prev.filter((i) => (i._id || i.id) !== id)
        );
    }, []);

    /* ── toggleWishlist ───────────────────────────────────── */
    const toggleWishlist = useCallback((product) => {
        const productId = product._id || product.id;
        setWishlist((prev) => {
            const exists = prev.find((i) => (i._id || i.id) === productId);
            if (exists) return prev.filter((i) => (i._id || i.id) !== productId);
            return [...prev, { ...product, _id: productId, id: productId }];
        });
    }, []);

    /* ── isWishlisted ─────────────────────────────────────── */
    const isWishlisted = useCallback(
        (id) => wishlist.some((i) => (i._id || i.id) === id),
        [wishlist]
    );

    const wishlistCount = wishlist.length;

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isWishlisted,
                wishlistCount,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export default WishlistProvider;