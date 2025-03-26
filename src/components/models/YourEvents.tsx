import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/Events.css";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  fee: number;
  participants: string[];
  hosts: string[];
}

const YourEvents: React.FC<{ endpoint: string }> = ({ endpoint }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [expenses, setExpenses] = useState<{ [key: number]: number }>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [endpoint]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get<Event[]>(`/events/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
      fetchExpenses(res.data);
    } catch (error) {
      alert(error || "Failed to fetch events");
    }
  };

  const fetchExpenses = async (events: Event[]) => {
    const token = localStorage.getItem("token");
    const newExpenses: { [key: number]: number } = {};
    
    await Promise.all(
      events.map(async (event) => {
        try {
          const res = await api.get<number>(`/expenses/total/${event.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          newExpenses[event.id] = res.data;
        } catch (error) {
          console.error(`Failed to fetch expenses for event ${event.id} ${error}`);
        }
      })
    );
    setExpenses(newExpenses);
  };

  const handleDelete = async (eventId: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((event) => event.id !== eventId));
      alert("Event deleted successfully!");
    } catch (error) {
      alert(error || "Failed to delete event");
    }
  };

  const handleEdit = (eventId: number) => navigate(`/editEvent/${eventId}`);
  const handleExpenses = (eventId: number) => navigate(`/event/${eventId}/expenses`);

  return (
    <div className="events-container">
      <ul className="event-list">
        {events.map((event) => (
          <li key={event.id} className="event-item">
            <div className="event-header">
              <h2>{event.title}</h2>
              <h4>Event Date: {event.date}</h4>
            </div>
            <h4>Hosted by - {event.hosts.join(", ")}</h4>
            <h4>Participants: <strong>{event.participants.length}</strong></h4>
            <h4>Fee: <strong>{event.fee}</strong></h4>
            <h4>Total Expenses: <strong>${expenses[event.id] || 0}</strong></h4>
            <p>{event.description}</p>
            <div className="button-group">
              <button className="edit-btn" onClick={() => handleEdit(event.id)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(event.id)}>Delete</button>
              <button className="expenses-btn" onClick={() => handleExpenses(event.id)}>Handle Expenses</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourEvents;
