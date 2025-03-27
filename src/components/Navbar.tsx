import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import LogoutButton from "./LogoutButton";
import "../styles/Navbar.css";

interface DecodedToken {
  sub: string;
  role: string;
  exp?: number;
  iat?: number;
}

const Navbar = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); // Get token from AuthContext

  let role = "Unknown Role";

  try {
    if (token) {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
      role = decoded.role;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  return (
    <nav className="navbar">
      <h2 
        className="navbar-title" 
        onClick={() => navigate("/userEvents")} 
        style={{ cursor: "pointer" }}
      >
        Event Management
      </h2>
      <div className="navbar-buttons">
        {role === "ROLE_ADMIN" && (
          <button className="admin-button" onClick={() => navigate("/allUsers")}>
            Show All Users
          </button>
        )}
        <button className="profile-button" onClick={() => navigate("/profile")}>
          Profile
        </button>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navbar;
