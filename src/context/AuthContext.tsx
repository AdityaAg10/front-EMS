import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

interface AuthContextType {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        const isExpired = decoded.exp * 1000 < Date.now(); // ✅ Fix: Use 1000 instead of 5000

        if (isExpired) {
          console.warn("Token expired, logging out.");
          logout();
        }
      } catch (error) {
        console.error("Invalid token, logging out.", error);
        logout();
      }
    }
  }, [token]); // Runs whenever `token` changes

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
