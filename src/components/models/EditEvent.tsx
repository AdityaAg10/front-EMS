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
    participants: [] as string[],
  });
  const [loading, setLoading] = useState(true);
  const [newHost, setNewHost] = useState("");
  const [newParticipant, setNewParticipant] = useState("");
  const [hostsVisible, setHostsVisible] = useState(false);
  const [participantsVisible, setParticipantsVisible] = useState(false);

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
      const res = await api.put(`/events/addhosts/${eventId}`, { newHostUsername: newHost }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data);
      setEventData(prev => ({ ...prev, hosts: [...prev.hosts, newHost] }));
      setNewHost("");
    } catch (error) {
      console.log("Error response:", error);
      alert("Failed to add host");
    }
  };

  const handleRemoveHost = async (hostToRemove: string) => {
    if (eventData.hosts.length <= 1) {
      alert("At least one host must remain.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/events/deletehost/${eventId}`, {
        params: { hostName: hostToRemove },
        headers: { Authorization: `Bearer ${token}` },
      });
      setEventData(prev => ({ ...prev, hosts: prev.hosts.filter(host => host !== hostToRemove) }));
    } catch (error) {
      console.log("Error response:", error);
      alert("Failed to remove host");
    }
  };

  const handleAddParticipant = async () => {
    if (!newParticipant) return;
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Error: You must be logged in to add a participant.");
            return;
        }

        const res = await api.put(
            `/events/addParticipant/${eventId}`,
            { username: newParticipant },
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );

        alert(res.data);
        setEventData(prev => ({ ...prev, participants: [...prev.participants, newParticipant] }));
        setNewParticipant("");
    } catch (error: unknown) {
        console.log("Error response:", error);

        let errorMessage = "Failed to add participant";
        if (error instanceof AxiosError) {
            errorMessage = error.response?.data || error.message;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        alert(errorMessage);
    } finally {
        setNewParticipant("");
    }
};


  const handleRemoveParticipant = async (participantToRemove: string) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/events/removeParticipant/${eventId}`, {
        params: { participantName: participantToRemove },
        headers: { Authorization: `Bearer ${token}` },
      });
      setEventData(prev => ({ ...prev, participants: prev.participants.filter(participant => participant !== participantToRemove) }));
    } catch (error) {
      console.log("Error response:", error);
      alert("Failed to remove participant");
    }
  };

  if (loading) return <p>Loading event details...</p>;

  return (
    <>
      <Navbar />
      <div className="edit-event-container">
        <h2>Edit Event</h2>
        <div className="back-btn-editevent">
          <button className="back-button" onClick={() => navigate("/userEvents")}>
            Go Back
          </button>
        </div>
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

      

        <button onClick={() => setParticipantsVisible(!participantsVisible)} className="toggle-participants-btn">
          {participantsVisible ? "Hide Participants" : "Show Participants"}
        </button>

        {participantsVisible && (
          <div className="participants-section">
            <h3>Current Participants:</h3>
            <ul>
              {eventData.participants.map((participant, index) => (
                <li key={index} className="participant-item">
                  {participant}
                  <button onClick={() => handleRemoveParticipant(participant)} className="remove-participant-btn">✖</button>
                </li>
              ))}
            </ul>
            <input type="text" value={newParticipant} onChange={(e) => setNewParticipant(e.target.value)} placeholder="Enter participant username" />
            <button onClick={handleAddParticipant} className="add-participant-btn">Add Participant</button>
          </div>
        )}
      </div>
    </>
  );
};

export default EditEvent;
