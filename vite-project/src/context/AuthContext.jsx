import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );
    const [loginType, setLoginType] = useState(
        localStorage.getItem("loginType") || null
    );

    // login(role, user) — called after successful API login
    const login = (type, user) => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loginType", type);
        if (user) localStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true);
        setLoginType(type);
    };

    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setLoginType(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, loginType, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);