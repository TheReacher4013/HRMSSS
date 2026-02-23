import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );

    const [loginType, setLoginType] = useState(
        localStorage.getItem("loginType") || null
    );

    const login = (type) => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loginType", type);
        setIsLoggedIn(true);
        setLoginType(type);
    };

    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setLoginType(null);
    };

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, loginType, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);





// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     // 1. Initial State: LocalStorage se data uthayenge (agar refresh ho toh data na jaye)
//     const [user, setUser] = useState(() => {
//         const savedUser = localStorage.getItem("user");
//         return savedUser ? JSON.parse(savedUser) : null;
//     });

//     const [token, setToken] = useState(localStorage.getItem("token") || null);

//     const [isLoggedIn, setIsLoggedIn] = useState(!!token);

//     // 2. Login Function: Backend se mila user object aur token save karega
//     const login = (userData, userToken) => {
//         localStorage.setItem("token", userToken);
//         localStorage.setItem("user", JSON.stringify(userData)); // Full info like _id, role, name

//         setToken(userToken);
//         setUser(userData);
//         setIsLoggedIn(true);
//     };

//     // 3. Logout Function: Sab clear karega
//     const logout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setToken(null);
//         setUser(null);
//         setIsLoggedIn(false);
//     };

//     // 4. Token Validation (Optional but Recommended)
//     // Agar token expire ho gaya ho toh user ko auto-logout karne ka logic yahan aa sakta hai

//     return (
//         <AuthContext.Provider
//             value={{
//                 isLoggedIn,
//                 user,      // Ab pure app mein user.name, user.role, user._id milega
//                 token,     // API calls ke liye
//                 login,
//                 logout
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);