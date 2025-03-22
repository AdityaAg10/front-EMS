import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/form.css"; // Import CSS file for styling
import axios from "axios";

// Define the expected JWT token structure
interface DecodedToken {
  userName: string;
  role: string;
  exp: number;
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ userName: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/genToken", form, {
        headers: {
          "Content-Type": "application/json"
        }
      });



      const token = res.data;
      console.log("Decoded Token:", jwtDecode<DecodedToken>(token));
      if (!token) {
        throw new Error("Token not found in response");
      }

      login(token);


      
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
      const userRole = decoded.role;

      console.log("Decoded Token:", decoded);

      navigate(userRole === "ROLE_ADMIN" ? "/adminEvents" : "/userEvents");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        alert(error.response?.data?.message || "Invalid Credentials");
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={form.userName}
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account?{" "}
          <button className="switch-btn" onClick={() => navigate("/register")}>
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
