import LogoutButton from "./LogoutButton";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar"> {/* Add className="navbar" */}
      <h2 className="navbar-title">Event Management</h2>
      <LogoutButton />
    </nav>
  );
};

export default Navbar;
