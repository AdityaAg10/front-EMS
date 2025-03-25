import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

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
  const [hasAlerted, setHasAlerted] = useState<boolean>(false);
  const [denyCount, setDenyCount] = useState<number>(0); // Track how many times the user said "No"
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token) {
        try {
          const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (isExpired && !hasAlerted) {
            setHasAlerted(true); // Prevent multiple alerts
            console.warn("Token expired.");

            // Show an alert before logging out
            const confirmLogout = window.confirm(
              "Your session has expired. Click OK to log out."
            );

            if (confirmLogout) {
              logout();
            } else {
              // If user cancels, increase deny count
              setDenyCount((prev) => prev + 1);

              if (denyCount + 1 >= 2) {
                alert("You have declined too many times. Logging you out.");
                logout();
              } else {
                // If they haven't reached the limit, remind them later
                setTimeout(() => setHasAlerted(false), 5000);
              }
            }
          }
        } catch (error) {
          console.error("Invalid token, logging out.", error);
          logout();
        }
      }
    };

    // Check every second if the token is expired
    const interval = setInterval(checkTokenExpiration, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [token, hasAlerted, denyCount]);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    setHasAlerted(false);
    setDenyCount(0); // Reset deny count on login
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setHasAlerted(false);
    setDenyCount(0); // Reset deny count on logout
    navigate("/login");
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
