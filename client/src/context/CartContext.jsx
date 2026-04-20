import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = useCallback((product) => {
        setCart((prev) => {
            const existing = prev.find((item) =>
                (item.id || item._id) === (product.id || product._id) &&
                item.size === product.size
            );
            if (existing) {
                return prev.map((item) =>
                    (item.id || item._id) === (product.id || product._id) &&
                        item.size === product.size
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((id) => {
        setCart((prev) =>
            prev.filter((item) => (item.id || item._id) !== id)
        );
    }, []);

    const updateQty = useCallback((id, delta) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    (item.id || item._id) === id
                        ? { ...item, qty: item.qty + delta }
                        : item
                )
                .filter((item) => item.qty > 0)
        );
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}
        >
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;