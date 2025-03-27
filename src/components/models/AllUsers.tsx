import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api"; // Import API service
import "../../styles/AllUsers.css"
import Navbar from "../Navbar";

interface User {
  id: string;
  userName: string;
  email: string;
}

const AllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth(); // Get the token from AuthContext

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError("Unauthorized access. Please log in.");
        return;
      }

      try {
        setError(null); // Reset error state before fetching

        const response = await api.get<User[]>("/users/allUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch users");
      }
    };

    fetchUsers();
  }, [token]);

  const handleDeleteUser = async (id: string) => {
    if (!token) {
      setError("Unauthorized action. Please log in.");
      return;
    }

    try {
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the UI after successful deletion
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete user");
    }
  };

    return (
    <>
    <Navbar/>
    
    <div className="all-users-container">
      <h2>All Users</h2>
      {error && <p className="error-message">{error}</p>}
      {users.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>
                  <button 
                    className="delete-button" 
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : !error ? (
        <p className="loading-message">Loading users...</p>
      ) : null}
    </div>
  </>
  );
};

export default AllUsers;
