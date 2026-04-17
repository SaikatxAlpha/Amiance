import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQty = (id, delta) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, qty: item.qty + delta } : item
                )
                .filter((item) => item.qty > 0)
        );
    };

    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;    