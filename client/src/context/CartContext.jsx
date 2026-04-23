import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const GUEST_CART_KEY = "amiance_guest_cart";

/* ── Validate MongoDB ObjectId ──────────────────────────────── */
const isValidObjectId = (id) => typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

/* ── Normalize a server cart item into a flat UI-friendly shape ── */
function normalizeServerItem(item) {
    const productId =
        item.product?._id || item.product || item._id;
    return {
        cartItemId: item._id,
        id: productId,
        _id: productId,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
        size: item.size || "M",
        tag: item.tag || null,
    };
}

/* ── Normalize a guest (local) item so UI code is the same ── */
function normalizeGuestItem(product) {
    const productId = product._id || product.id;
    return {
        cartItemId: null,
        id: productId,
        _id: productId,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: product.qty ?? 1,
        size: product.size || "M",
        tag: product.tag || null,
    };
}

function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);
    const { user } = useAuth();
    const lastUserIdRef = useRef(null);

    /* ── On user change: load correct cart ─────────────────── */
    useEffect(() => {
        const prevId = lastUserIdRef.current;
        const currId = user?._id ?? null;
        lastUserIdRef.current = currId;

        if (currId) {
            const guestRaw = localStorage.getItem(GUEST_CART_KEY);
            const guestItems = guestRaw ? JSON.parse(guestRaw) : [];
            fetchServerCart(guestItems);
            localStorage.removeItem(GUEST_CART_KEY);
        } else if (prevId && !currId) {
            const guestRaw = localStorage.getItem(GUEST_CART_KEY);
            setCart(guestRaw ? JSON.parse(guestRaw) : []);
        } else if (!currId) {
            const guestRaw = localStorage.getItem(GUEST_CART_KEY);
            setCart(guestRaw ? JSON.parse(guestRaw) : []);
        }
    }, [user?._id]); // eslint-disable-line

    /* ── Persist guest cart whenever cart changes ───────────── */
    useEffect(() => {
        if (!user) {
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
        }
    }, [cart, user]);

    /* ── Fetch server cart and optionally push guest items ──── */
    const fetchServerCart = async (guestItems = []) => {
        setCartLoading(true);
        try {
            const data = await cartAPI.get();
            const serverItems = (data.cart?.items || []).map(normalizeServerItem);

            // Only push guest items that have valid MongoDB ObjectIds
            // Static products (e.g. "static_1") are not in the DB and will cause CastError
            const validGuestItems = guestItems.filter((g) =>
                isValidObjectId(g._id || g.id)
            );

            if (validGuestItems.length > 0) {
                const pushes = validGuestItems.map((g) =>
                    cartAPI
                        .add({
                            productId: g._id || g.id,
                            name: g.name,
                            image: g.image,
                            price: g.price,
                            qty: g.qty,
                            size: g.size || "M",
                        })
                        .catch(() => null)
                );
                await Promise.all(pushes);
                const merged = await cartAPI.get();
                setCart((merged.cart?.items || []).map(normalizeServerItem));
            } else {
                setCart(serverItems);
            }
        } catch (err) {
            console.error("Cart fetch error:", err);
        } finally {
            setCartLoading(false);
        }
    };

    /* ── addToCart ──────────────────────────────────────────── */
    const addToCart = useCallback(
        async (product) => {
            const productId = product._id || product.id;
            const size = product.size || "M";

            if (user && isValidObjectId(productId)) {
                // Only sync to server if it's a real DB product
                try {
                    const data = await cartAPI.add({
                        productId,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        qty: 1,
                        size,
                    });
                    setCart((data.cart?.items || []).map(normalizeServerItem));
                } catch (err) {
                    console.error("Add to cart error:", err);
                    // Fall back to local state update
                    setCart((prev) => {
                        const existing = prev.find(
                            (i) => (i.id || i._id) === productId && i.size === size
                        );
                        if (existing) {
                            return prev.map((i) =>
                                (i.id || i._id) === productId && i.size === size
                                    ? { ...i, qty: i.qty + 1 }
                                    : i
                            );
                        }
                        return [...prev, normalizeGuestItem({ ...product, qty: 1, size })];
                    });
                }
            } else {
                // Guest cart or static product — store locally
                setCart((prev) => {
                    const existing = prev.find(
                        (i) => (i.id || i._id) === productId && i.size === size
                    );
                    if (existing) {
                        return prev.map((i) =>
                            (i.id || i._id) === productId && i.size === size
                                ? { ...i, qty: i.qty + 1 }
                                : i
                        );
                    }
                    return [...prev, normalizeGuestItem({ ...product, qty: 1, size })];
                });
            }
        },
        [user]
    );

    /* ── removeFromCart ─────────────────────────────────────── */
    const removeFromCart = useCallback(
        async (productId) => {
            if (user) {
                const item = cart.find((i) => (i.id || i._id) === productId);
                if (item?.cartItemId) {
                    try {
                        const data = await cartAPI.remove(item.cartItemId);
                        setCart((data.cart?.items || []).map(normalizeServerItem));
                        return;
                    } catch (err) {
                        console.error("Remove from cart error:", err);
                    }
                }
            }
            // Fallback: remove locally
            setCart((prev) =>
                prev.filter((i) => (i.id || i._id) !== productId)
            );
        },
        [user, cart]
    );

    /* ── updateQty ──────────────────────────────────────────── */
    const updateQty = useCallback(
        async (productId, delta) => {
            if (user) {
                const item = cart.find((i) => (i.id || i._id) === productId);
                const newQty = (item?.qty ?? 1) + delta;
                if (newQty <= 0) return removeFromCart(productId);

                if (item?.cartItemId) {
                    try {
                        const data = await cartAPI.update(item.cartItemId, { qty: newQty });
                        setCart((data.cart?.items || []).map(normalizeServerItem));
                        return;
                    } catch (err) {
                        console.error("Update qty error:", err);
                    }
                }
            }
            // Fallback: update locally
            setCart((prev) =>
                prev
                    .map((i) =>
                        (i.id || i._id) === productId
                            ? { ...i, qty: i.qty + delta }
                            : i
                    )
                    .filter((i) => i.qty > 0)
            );
        },
        [user, cart, removeFromCart]
    );

    /* ── clearCart ──────────────────────────────────────────── */
    const clearCart = useCallback(async () => {
        if (user) {
            try {
                await cartAPI.clear();
            } catch (err) {
                console.error("Clear cart error:", err);
            }
        } else {
            localStorage.removeItem(GUEST_CART_KEY);
        }
        setCart([]);
    }, [user]);

    const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);
    const cartTotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                cartLoading,
                addToCart,
                removeFromCart,
                updateQty,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;