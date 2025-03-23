import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import EditEvent from "./components/models/EditEvent";
import AdminIndex from "./components/events/AdminIndex";
import UserIndex from "./components/events/UserIndex";
import ErrorPage from "./pages/ErrorPage";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./Routes"; // Import PrivateRoute from routes.tsx
import CreateEvent from "./components/models/CreateEvent";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/editEvent/:eventId" element={<EditEvent />} />
          <Route path="/createEvent" element={<CreateEvent />} />
          
          <Route path="/adminEvents" element={<PrivateRoute><AdminIndex /></PrivateRoute>} />
          <Route path="/userEvents" element={<PrivateRoute><UserIndex /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<ErrorPage />} /> {/* Handle unknown routes */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
