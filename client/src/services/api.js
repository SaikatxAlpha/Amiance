const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("amiance_token");

const req = async (path, opts = {}) => {
    const res = await fetch(`${BASE}${path}`, {
        ...opts,
        headers: {
            "Content-Type": "application/json",
            ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
            ...opts.headers,
        },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data;
};

export const authAPI = {
    login: (body) => req("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    register: (body) => req("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    me: () => req("/auth/me"),
};

export const productsAPI = {
    getAll: (query = "") => req(`/products${query}`),
    getById: (id) => req(`/products/${id}`),
};

export const cartAPI = {
    get: () => req("/cart"),
    add: (body) => req("/cart", { method: "POST", body: JSON.stringify(body) }),
    update: (itemId, body) => req(`/cart/${itemId}`, { method: "PUT", body: JSON.stringify(body) }),
    remove: (itemId) => req(`/cart/${itemId}`, { method: "DELETE" }),
};

export const ordersAPI = {
    create: (body) => req("/orders", { method: "POST", body: JSON.stringify(body) }),
    getMyOrders: () => req("/orders/my"),
};