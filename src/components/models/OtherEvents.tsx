import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/Events.css";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  fee: number;
  location: string;
  participants: string[];
  hosts: string[];
}

interface EventsProps {
  endpoint: string;
}

const OtherEvents: React.FC<EventsProps> = ({ endpoint }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
    extractUsernameFromToken();
  }, [endpoint]);

  // Fetch events from backend
  const fetchEvents = () => {
    const token = localStorage.getItem("token");
    api.get<Event[]>(`/events/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setEvents(res.data))
      .catch(() => alert("Failed to fetch events"));
  };

  // Extract username from token without making an API request
  const extractUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        setCurrentUser(payload.sub); // Assuming username is stored in "sub" (subject) claim
      } catch (error) {
        console.error(error || "Invalid token format");
      }
    }
  };

  // Join Event
  const handleJoinEvent = (eventId: string) => {
    const token = localStorage.getItem("token");
    api.put(`/users/joinEvent/${eventId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        alert(res.data);
        fetchEvents();
      })
      .catch((error) => {
        alert(error.response?.data || "Failed to join the event");
      });
  };

  // Leave Event
  const handleLeaveEvent = (eventId: string) => {
    const token = localStorage.getItem("token");
    api.put(`/users/leaveEvent/${eventId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        alert(res.data);
        fetchEvents();
      })
      .catch((error) => {
        alert(error.response?.data || "Failed to leave the event");
      });
  };

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
            <div className="event-stats">
              <div className="stats-row">
                <h4>Participants: <strong>{event.participants.length}</strong></h4>
                <h4>Fee: <strong>${event.fee}</strong></h4>
              </div>
            </div>
            <p>{event.description}</p>
            {currentUser && event.participants.includes(currentUser) ? (
              <button className="leave-btn" onClick={() => handleLeaveEvent(event.id)}>Leave</button>
            ) : (
              <button className="join-btn" onClick={() => handleJoinEvent(event.id)}>Join</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OtherEvents;
