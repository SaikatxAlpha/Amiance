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
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    return data;
};

export const authAPI = {
    register: (body) => req("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body) => req("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => req("/auth/me"),
    verifyEmail: (token) => req(`/auth/verify-email/${token}`),
    resendVerification: (email) =>
        req("/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) }),
    forgotPassword: (email) =>
        req("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
    resetPassword: (token, password) =>
        req(`/auth/reset-password/${token}`, { method: "PUT", body: JSON.stringify({ password }) }),
};

export const productsAPI = {
    getAll: (query = "") => req(`/products${query}`),
    getById: (id) => req(`/products/${id}`),
    create: (body) => req("/products", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => req(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id) => req(`/products/${id}`, { method: "DELETE" }),
};

export const cartAPI = {
    get: () => req("/cart"),
    add: (body) => req("/cart", { method: "POST", body: JSON.stringify(body) }),
    update: (itemId, body) =>
        req(`/cart/${itemId}`, { method: "PUT", body: JSON.stringify(body) }),
    remove: (itemId) => req(`/cart/${itemId}`, { method: "DELETE" }),
    clear: () => req("/cart", { method: "DELETE" }),
};

export const ordersAPI = {
    create: (body) => req("/orders", { method: "POST", body: JSON.stringify(body) }),
    getMyOrders: () => req("/orders/my"),
    getById: (id) => req(`/orders/${id}`),
    getAll: () => req("/orders"),
    updateStatus: (id, status) =>
        req(`/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
};

export const usersAPI = {
    getProfile: () => req("/users/profile"),
    updateProfile: (body) =>
        req("/users/profile", { method: "PUT", body: JSON.stringify(body) }),
    updatePassword: (body) =>
        req("/users/password", { method: "PUT", body: JSON.stringify(body) }),
    addAddress: (body) =>
        req("/users/addresses", { method: "POST", body: JSON.stringify(body) }),
    updateAddress: (id, body) =>
        req(`/users/addresses/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    removeAddress: (id) => req(`/users/addresses/${id}`, { method: "DELETE" }),
    getAll: () => req("/users"),
};

export const reviewsAPI = {
    getByProduct: (productId) => req(`/reviews/${productId}`),
    create: (productId, body) =>
        req(`/reviews/${productId}`, { method: "POST", body: JSON.stringify(body) }),
    delete: (id) => req(`/reviews/${id}`, { method: "DELETE" }),
};