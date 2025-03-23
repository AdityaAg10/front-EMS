import React, { useEffect, useState } from "react";
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

const OtherEvents: React.FC<EventsProps> = ({ endpoint }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, [endpoint]);

  const fetchEvents = () => {
    const token = localStorage.getItem("token"); 
    api.get<Event[]>(`/events/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Fetched events:", res.data);
        setEvents(res.data);
      })
      .catch(() => alert("Failed to fetch events"));
  };



  return (
    <div className="events-container">
      <ul className="event-list">
        {events.map((event) => (
          <li key={event.id} className="event-item">
            <div className="event-header">
              <h2>{event.title}</h2>
              <h2>{event.date}</h2>
            </div>
            <h4>Hosted by - {event.hosts}</h4>
            <p>{event.description}</p>
            <button className="join-btn">Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OtherEvents;
