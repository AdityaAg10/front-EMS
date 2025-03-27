import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/form.css"; // Import CSS file for styling
import axios from "axios";
import "../styles/Events.css"; // Import event styles

// Define the expected JWT token structure
interface DecodedToken {
  userName: string;
  role: string;
  exp: number;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: string[];
  hosts: string[];
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ userName: "Aditya2", password: "securepassword4" });
  const [events, setEvents] = useState<Event[]>([]); // State to store events

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get<Event[]>("/events/allEvents");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/genToken", form, {
        headers: { "Content-Type": "application/json" },
      });

      const token = res.data.token;
      console.log("Decoded Token:", jwtDecode<DecodedToken>(token));
      if (!token) {
        throw new Error("Token not found in response");
      }

      login(token);

      const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
      const userRole = decoded.role;

      console.log("Decoded Token:", decoded);

      navigate(userRole === "ROLE_ADMIN" ? "/adminEvents" : "/userEvents");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        alert(error.response?.data?.message || "Invalid Credentials");
      } else {
        console.log(error);
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{" "}
          <button className="switch-btn" onClick={() => navigate("/register")}>
            Register
          </button>
        </p>
      </div>

      {/* Events List Below the Login Form */}
      <div className="events-container">
        <h2>Upcoming Events</h2>
        <ul className="event-list">
          {events.map((event) => (
            <li key={event.id} className="event-item">
              <div className="event-header">
                <h2>{event.title}</h2>
                <h4>Event Date: {event.date}</h4>
              </div>
              <h4>Hosted by - {event.hosts.join(", ")}</h4>
              <h4>Participants: {event.participants.length} </h4>
              <p>{event.description}</p>
              {/* No join button here */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Login;
