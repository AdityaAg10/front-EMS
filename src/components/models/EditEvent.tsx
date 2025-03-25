import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "../../styles/EditEvent.css";
import { AxiosError } from "axios";
import Navbar from "../Navbar";

const EditEvent: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    hosts: [] as string[],
    participants: ""
  });
  const [loading, setLoading] = useState(true);
  const [newHost, setNewHost] = useState("");
  const [hostsVisible, setHostsVisible] = useState(false);

  useEffect(() => {
    console.log("Event ID received in EditEvent:", eventId);
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setEventData(response.data);
    } catch (error) {
      console.log(error);
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
      console.log(error);
      alert("Failed to update event");
    }
  };

  const handleAddHost = async () => {
    if (!newHost) return;
    try {
      const token = localStorage.getItem("token");
      const res = await api.put(`/events/addhosts/${eventId}`, {newHostUsername: newHost },  {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data);
      setEventData(prev => ({ ...prev, hosts: [...prev.hosts, newHost] }));
      setNewHost("");
    } catch (error: unknown) {
      console.log("Error response:", error);

      let errorMessage = "Failed to add host";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
      // return;
    } finally {
      setNewHost(""); 
    }
  };

  const handleRemoveHost = async (hostToRemove: string) => {
    if (eventData.hosts.length <= 1) {
      alert("At least one host must remain.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await api.delete(`/events/deletehost/${eventId}`, {
        params: { hostName: hostToRemove },
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data);
      setEventData(prev => ({
        ...prev,
        hosts: prev.hosts.filter(host => host !== hostToRemove),
      }));
    } catch (error: unknown) {
      console.log("Error response:", error);
      
      let errorMessage = "Failed to remove host";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    }
  };

  if (loading) return <p>Loading event details...</p>;

  return (
    <>
    <Navbar/>
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

      <button onClick={() => setHostsVisible(!hostsVisible)} className="toggle-hosts-btn">
        {hostsVisible ? "Hide Hosts" : "Show Hosts"}
      </button>

      {hostsVisible && (
        <div className="hosts-section">
          <h3>Current Hosts:</h3>
          <ul>
            {eventData.hosts.map((host, index) => (
              <li key={index} className="host-item">
                {host} 
                <button onClick={() => handleRemoveHost(host)} className="remove-host-btn">✖</button>
              </li>
            ))}
          </ul>

          <input
            type="text"
            value={newHost}
            onChange={(e) => setNewHost(e.target.value)}
            placeholder="Enter new host username"
          />
          <button onClick={handleAddHost} className="add-host-btn">Add Host</button>
        </div>
      )}
      </div>
    </>
  );
};

export default EditEvent;
