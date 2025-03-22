import React, { useEffect, useState } from "react";
import api from "../../services/api";
import axios from "axios";
import "../../styles/Events.css";

interface Event {
  // _id: number;
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: string[];
  hosts: string[];
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    api.get<Event[]>("/events/allEvents")
      .then((res) => {
        console.log("Fetched events:", res.data); // Debugging
        setEvents(res.data);
      })
      .catch(() => alert("Failed to fetch events"));
  };

    const handleDelete = async (eventId: number) => {
  try {
    const token = localStorage.getItem("token");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await api.delete(`/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setEvents(events.filter((event) => event.id !== eventId));
    alert("Event deleted successfully!");
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      
      const errorMessage = error.response.data?.data || error.response.data?.message || "Access Denied";
      console.error("Error deleting event:", errorMessage);
      alert(`Failed to delete event: ${errorMessage}`);
    } else {
      // Handle non-Axios errors
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred while deleting the event.");
    }
  }
};

  return (
    <div className="events-container">
      <h2>Upcoming Events</h2>
      <ul className="event-list">
        {events.map((event) => (
          <li key={event.id} className="event-item">
            <h2>{event.title}  {event.date}</h2>
            <h4>Hosted by - { event.hosts}</h4>
            <p>{event.description}</p>
            <button className="delete-btn" onClick={() => handleDelete(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
