import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { jwtDecode } from "jwt-decode";

// Define the structure of the decoded JWT token
interface DecodedToken {
  role: string;
}

// Private Route Component with Role-Based Navigation
export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();

  if (!isAuthenticated || !token) return <Navigate to="/login" />;

  try {
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    const userRole = decoded.role;

    if (userRole === "ROLE_ADMIN" && window.location.pathname !== "/adminEvents") {
      return <Navigate to="/adminEvents" />;
    } else if (userRole !== "ROLE_ADMIN" && window.location.pathname !== "/userEvents") {
      return <Navigate to="/userEvents" />;
    }
  } catch {
    return <Navigate to="/login" />;
  }

  return <>{children}</>; // Preserve children
};
