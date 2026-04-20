import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI, usersAPI } from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from token on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("amiance_token");
            if (token) {
                try {
                    const data = await authAPI.me();
                    setUser(data.user);
                } catch {
                    localStorage.removeItem("amiance_token");
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = useCallback(async (email, password) => {
        const data = await authAPI.login({ email, password });
        localStorage.setItem("amiance_token", data.token);
        setUser(data.user);
        return data.user;
    }, []);

    const signup = useCallback(async (name, email, password) => {
        const data = await authAPI.register({ name, email, password });
        localStorage.setItem("amiance_token", data.token);
        setUser(data.user);
        return data;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("amiance_token");
        setUser(null);
    }, []);

    const updateUser = useCallback(async (fields) => {
        try {
            const data = await usersAPI.updateProfile(fields);
            setUser(data.user);
            return data.user;
        } catch (err) {
            // Optimistic update if offline
            setUser((prev) => ({ ...prev, ...fields }));
        }
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const data = await authAPI.me();
            setUser(data.user);
        } catch { }
    }, []);

    // Address management (delegate to API)
    const addAddress = useCallback(async (addr) => {
        const data = await usersAPI.addAddress(addr);
        setUser((prev) => ({ ...prev, addresses: data.addresses }));
    }, []);

    const updateAddress = useCallback(async (id, fields) => {
        const data = await usersAPI.updateAddress(id, fields);
        setUser((prev) => ({ ...prev, addresses: data.addresses }));
    }, []);

    const removeAddress = useCallback(async (id) => {
        const data = await usersAPI.removeAddress(id);
        setUser((prev) => ({ ...prev, addresses: data.addresses }));
    }, []);

    const setDefaultAddress = useCallback(async (id) => {
        const data = await usersAPI.updateAddress(id, { isDefault: true });
        setUser((prev) => ({ ...prev, addresses: data.addresses }));
    }, []);

    const isAdmin = user?.role === "admin";

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                updateUser,
                refreshUser,
                isAdmin,
                addresses: user?.addresses || [],
                addAddress,
                updateAddress,
                removeAddress,
                setDefaultAddress,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;