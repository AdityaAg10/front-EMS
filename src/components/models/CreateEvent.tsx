import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import { useAuth } from "../../context/AuthContext"; // Import authentication context
import { jwtDecode } from "jwt-decode";
import "../../styles/CreateEvent.css";

interface DecodedToken {
  sub: string;
  role: string;
  exp?: number;
  iat?: number;
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); // Get token from auth context

  const [eventData, setEventData] = useState<{
    title: string;
    description: string;
    date: string;
    location: string;
    fee: number; // Ensuring fee is of type number
    participants: string[];
  }>({
    title: "",
    description: "",
    date: "",
    location: "",
    fee: 0, // Default value for fee
    participants: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setEventData((prevData) => ({
      ...prevData,
      [name]: name === "fee" ? parseFloat(value) || 0 : value, // Convert fee to number
    }));
  };

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData((prevData) => ({
      ...prevData,
      participants: e.target.value ? e.target.value.split(",").map((p) => p.trim()) : [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/events/create", eventData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to the request
          "Content-Type": "application/json",
        },
      });

      let role = "";
      if (token) {
        try {
          const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
          role = decoded.role;
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }

      if (role === "ROLE_ADMIN") {
        navigate("/adminEvents");
      } else {
        navigate("/userEvents");
      }

    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-event-container">
        <h1>Create New Event</h1>
        <div className="back-btn-editevent">
          <button className="back-button" onClick={() => navigate("/userEvents")}>
            Go Back
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
          <textarea name="description" placeholder="Description" onChange={handleChange} required />
          <input type="date" name="date" onChange={handleChange} required />
          <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
          <input type="number" name="fee" placeholder="Fee" onChange={handleChange} required min="0" step="0.01" />
          <input type="text" name="participants" placeholder="Participants (comma-separated)" onChange={handleParticipantsChange} />

          <button type="submit" className="create-btn">Create Event</button>
        </form>
      </div>
    </>
  );
};

export default CreateEvent;
