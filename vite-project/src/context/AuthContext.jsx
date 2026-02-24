import { createContext, useContext, useState } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [loginType, setLoginType] = useState(
    localStorage.getItem("loginType") || null
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [authError, setAuthError] = useState("");

  // Called after successful API login
  const login = (type, userData, token) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loginType", type);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setLoginType(type);
    setUser(userData);
    setAuthError("");
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setLoginType(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loginType, user, authError, setAuthError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
