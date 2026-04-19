import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            label: "Default",
            name: "Alex Monroe",
            line1: "12 Fabric Lane, Flat 3",
            city: "London",
            postcode: "W1 4AB",
            country: "United Kingdom",
            isDefault: true,
        },
    ]);

    const login = (email, password) => {
        const isAdmin = email === "admin@amiance.co";
        const mockUser = {
            id: 1,
            name: isAdmin ? "Admin" : "Alex Monroe",
            email,
            phone: "",
            bio: "",
            avatar: null,
            role: isAdmin ? "admin" : "user",
        };
        setUser(mockUser);
        return mockUser;
    };

    const signup = (name, email, password) => {
        const mockUser = { id: Date.now(), name, email, phone: "", bio: "", avatar: null, role: "user" };
        setUser(mockUser);
        return mockUser;
    };

    const logout = () => setUser(null);

    const updateUser = (fields) => {
        setUser(prev => ({ ...prev, ...fields }));
    };

    // Address CRUD
    const addAddress = (addr) => {
        const newAddr = { ...addr, id: Date.now(), isDefault: addresses.length === 0 };
        setAddresses(prev => [...prev, newAddr]);
    };

    const updateAddress = (id, fields) => {
        setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...fields } : a));
    };

    const removeAddress = (id) => {
        setAddresses(prev => {
            const filtered = prev.filter(a => a.id !== id);
            // If we removed the default, make first one default
            if (filtered.length > 0 && !filtered.find(a => a.isDefault)) {
                filtered[0].isDefault = true;
            }
            return filtered;
        });
    };

    const setDefaultAddress = (id) => {
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    };

    const isAdmin = user?.role === "admin";

    return (
        <AuthContext.Provider value={{
            user, login, signup, logout, updateUser, isAdmin,
            addresses, addAddress, updateAddress, removeAddress, setDefaultAddress,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;