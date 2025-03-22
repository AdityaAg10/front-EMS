import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Events.css";

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
      setEvents(events.filter(event => event.id !== eventId));
      alert("Event deleted successfully!");
    } catch (error) {
      alert("Failed to delete event: " + error);
    }
  };

  return (
    <div className="events-container">
      <h2>All Events</h2>
      <ul className="event-list">
        {events.map((event) => (
          <li key={event.id} className="event-item">
            <h2>{event.title}</h2>
            <h4>{event.date} ({event.location})</h4>
            <h4>{event.hosts}</h4>
            <p>{event.description}</p>
            <button className="delete-btn" onClick={() => handleDelete(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
