import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        // Mock login — replace with real API call
        const mockUser = { id: 1, name: "Alex Monroe", email, avatar: null, role: "user" };
        setUser(mockUser);
        return mockUser;
    };

    const signup = (name, email, password) => {
        const mockUser = { id: Date.now(), name, email, avatar: null, role: "user" };
        setUser(mockUser);
        return mockUser;
    };

    const logout = () => setUser(null);

    const isAdmin = user?.role === "admin";

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;