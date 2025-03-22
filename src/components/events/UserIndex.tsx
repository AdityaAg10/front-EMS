import React from "react";
import Events from "../Events";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import Navbar from "../Navbar"; // Import Navbar

interface DecodedToken {
  sub: string; // Username or email
  role: string; // User role (e.g., ROLE_ADMIN or ROLE_USER)
  exp?: number; // Expiry timestamp (optional, for debugging)
  iat?: number; // Issued at timestamp (optional)
}

const UserIndex: React.FC = () => {
  const { token } = useAuth();

  let username = "User"; // Default fallback
  let role = "Unknown Role";
  let expirationTime = "N/A";

  try {
    if (token) {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
      console.log("Decoded Token:", decoded); // Debugging

      username = decoded.sub;
      role = decoded.role;
      
      if (decoded.exp) {
        const expDate = new Date(decoded.exp * 1000); // Convert to milliseconds
        expirationTime = expDate.toLocaleString();
      }
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  return (
    <>
      <Navbar /> {/* Navbar added here */}
      <div>
        <h1>Welcome, {username}!</h1>
        <p>Role: {role}</p>
        <p>Token Expires At: {expirationTime}</p>
        <Events />
      </div>
    </>
  );
};

export default UserIndex;
