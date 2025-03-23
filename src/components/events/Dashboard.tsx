import React from "react";
import YourEvents from "../models/YourEvents";
import OtherEvents from "../models/OtherEvents";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../Navbar";
import "../../styles/Events.css";

interface DecodedToken {
  sub: string;
  role: string;
  exp?: number;
  iat?: number;
}

interface DashboardProps {
  defaultUsername: string;
}

const Dashboard: React.FC<DashboardProps> = ({ defaultUsername }) => {
  const { token } = useAuth();
  const navigate = useNavigate();


  let username = defaultUsername;
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
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1>Welcome, {username}!</h1>
        <p>Role: {role}</p>
        <p>Token Expires At: {expirationTime}</p>

        <button className="create-event-btn" onClick={() => navigate("/createEvent")}>
          Create Event
        </button>

        {role === "ROLE_ADMIN" ? (
          <div>
            <h1>All Events - </h1>
            <YourEvents endpoint="allEvents" />
          </div>
        ) : (
          <>
            <div className="hosted-by-me">
              <h1>Events hosted by you - </h1>
              <YourEvents endpoint="hostedByMeEvents" />
              </div>
              <hr/>
            <div>
              <h1>Other Events you can join - </h1>
              <OtherEvents endpoint="hostedByOthersEvents" />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
