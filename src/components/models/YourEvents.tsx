import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import axios from "axios";
import "../../styles/Events.css";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: string[];
  hosts: string[];
}

interface EventsProps {
  endpoint: string;
}

const YourEvents: React.FC<EventsProps> = ({ endpoint }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [endpoint]);

  const fetchEvents = () => {
    const token = localStorage.getItem("token");
    api.get<Event[]>(`/events/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("Fetched events:", res.data);
        setEvents(res.data);
      })
      .catch(() => alert("Failed to fetch events"));
  };

  const handleDelete = async (eventId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await api.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(events.filter((event) => event.id !== eventId));
      alert("Event deleted successfully!");
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.data || "Access Denied";
        console.error("Error deleting event:", errorMessage);
        alert(`Failed to delete event: ${errorMessage}`);
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred while deleting the event.");
      }
    }
  };

  const handleEdit = (eventId: number) => {
    try {
      navigate(`/editEvent/${eventId}`);  
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="events-container">
      <ul className="event-list">
        {events.map((event) => (
          <li key={event.id} className="event-item">
            <div className="event-header">
              <h2>{event.title}</h2>
              <h4>{event.date}</h4>
            </div>
            <h4>Hosted by - {event.hosts.join(", ")}</h4>
            <p>{event.description}</p>
            <div className="button-group">
              <button className="edit-btn" onClick={() => handleEdit(event.id)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(event.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourEvents;
