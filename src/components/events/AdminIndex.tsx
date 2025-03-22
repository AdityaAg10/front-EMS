import React from "react";
import Events from "../Events";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  role: string;
  exp?: number;
}

const AdminIndex: React.FC = () => {
  const { token } = useAuth();

  let username = "Admin";
  let role = "Unknown Role";
  let expirationTime = "N/A";

  try {
    if (token) {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
      username = decoded.sub;
      role = decoded.role;

      if (decoded.exp) {
        const expDate = new Date(decoded.exp * 1000);
        expirationTime = expDate.toLocaleString();
      }
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>Role: {role}</p>
      <p>Token Expires At: {expirationTime}</p>
      <Events />
    </div>
  );
};

export default AdminIndex;
