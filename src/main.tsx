import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Import BrowserRouter
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext"; // ✅ Ensure AuthProvider is here

createRoot(document.getElementById("root")!).render(
  <BrowserRouter> {/* ✅ Router is now at the highest level */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
