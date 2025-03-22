import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response, // Pass successful responses
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Check if it's a 401/403 error and specifically due to token expiration
      if (
        status === 401 &&
        data?.message?.toLowerCase().includes("token expired")
      ) {
        console.error("Token expired. Redirecting to login...");
        localStorage.removeItem("token"); // Clear stored token
        window.location.href = "/login"; // Redirect to login page
      }
    }

    return Promise.reject(error);
  }
);

export default api;
