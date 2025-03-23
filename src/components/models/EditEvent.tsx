import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "../../styles/EditEvent.css";

const EditEvent: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Event ID received in EditEvent:", eventId); // Debugging
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEventData(response.data);
    }
    catch (error) {
      console.log(error)
      alert("Failed to fetch event details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.put(`/events/${eventId}`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event updated successfully!");
      navigate("/userEvents");
    } catch (error) {
        console.log(error)
      alert("Failed to update event");
    }
  };

  if (loading) return <p>Loading event details...</p>;

  return (
    <div className="edit-event-container">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit} className="edit-event-form">
        <label>Title:</label>
        <input type="text" name="title" value={eventData.title} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={eventData.description} onChange={handleChange} required />

        <label>Date:</label>
        <input type="date" name="date" value={eventData.date} onChange={handleChange} required />

        <label>Location:</label>
        <input type="text" name="location" value={eventData.location} onChange={handleChange} required />

        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default EditEvent;
