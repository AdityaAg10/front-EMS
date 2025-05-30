import { Link } from "react-router-dom";
import "../styles/ErrorPage.css"; // Import styles

const ErrorPage = () => {
  return (
    <div className="error-container">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="home-button">Go to Home</Link>
    </div>
  );
};

export default ErrorPage;
