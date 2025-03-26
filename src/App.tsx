import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import EditEvent from "./components/models/EditEvent";
import AdminIndex from "./components/events/AdminIndex";
import UserIndex from "./components/events/UserIndex";
import ErrorPage from "./pages/ErrorPage";
import CreateEvent from "./components/models/CreateEvent";
import { PrivateRoute } from "./Routes";
import HandleExpenses from "./components/models/HandleExpenses";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/editEvent/:eventId" element={<EditEvent />} />
      <Route path="/createEvent" element={<CreateEvent />} />
      <Route path="/event/:eventId/expenses" element={<HandleExpenses />} />
      <Route path="/adminEvents" element={<PrivateRoute><AdminIndex /></PrivateRoute>} />
      <Route path="/userEvents" element={<PrivateRoute><UserIndex /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<ErrorPage />} /> {/* Handle unknown routes */}
    </Routes>
  );
};

export default App;
