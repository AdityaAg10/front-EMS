import { useState, useEffect } from "react";
import "../../styles/Profile.css";
import Navbar from "../Navbar";

interface ProfileData {
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  // Fetch user details when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found.");

        const response = await fetch("http://localhost:8080/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch user data: ${errorText}`);
        }

        const userData = await response.json();
        console.log("Fetched user data:", userData);
        setFormData({ name: userData.userName, email: userData.email });
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load profile data.");
      }
    };

    fetchUserData();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Profile update failed!");
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Profile update failed.");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/users/updatePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.text();

      if (result === "Password updated successfully") {
        alert("Password updated successfully!");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordError("");
      } else {
        alert(result);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Password update failed.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        {/* Update Profile Section */}
        <div className="profile-section">
          <h2>Update Profile</h2>
          <form className="profile-form" onSubmit={handleProfileSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleProfileChange} />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleProfileChange} />

            <button className="save-btn" type="submit">Save Changes</button>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="profile-section">
          <h2>Change Password</h2>
          <form className="profile-form" onSubmit={handlePasswordSubmit}>
            <label htmlFor="oldPassword">Current Password:</label>
            <input type="password" id="oldPassword" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} />

            <label htmlFor="newPassword">New Password:</label>
            <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />

            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} />

            {passwordError && <p style={{ color: "red", fontSize: "14px" }}>{passwordError}</p>}

            <button className="save-btn" type="submit">Update Password</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
