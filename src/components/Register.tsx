import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/form.css"; // Import CSS file for better styling

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userName: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/registration", { ...form, role: "ROLE_USER" }); // Default role
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Register</button>
        <p>Already have an account? <button className="switch-btn" onClick={() => navigate("/login")}>Login</button></p>
      </form>
    </div>
  );
};

export default Register;
