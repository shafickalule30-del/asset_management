// frontend/src/Home.jsx
import React, { useEffect, useState } from "react";
import AdminPanel from "./AdminPanel"; // Resolves from exact same folder level

export default function Home() {
  const [serverStatus, setServerStatus] = useState("Connecting...");
  const [errorLog, setErrorLog] = useState(null);

  // Unified API Endpoint using forced IPv4 address
  const API_BASE_URL = "http://127.0.0.1:5000";

  useEffect(() => {
    // Health check pipeline targeting the backend status route
    fetch(`${API_BASE_URL}/api/status`)
      .then((res) => {
        if (!res.ok) throw new Error("Server operational state returned bad response status.");
        return res.json();
      })
      .then((data) => {
        setServerStatus(`Online (${data.database === 'connected' ? 'Database Cloud Linked' : 'No DB'})`);
        setErrorLog(null);
      })
      .catch((err) => {
        console.error("Frontend connection block encountered:", err);
        setServerStatus("Cannot connect to backend server");
        setErrorLog("Ensure backend is running on terminal via node server.js and your network is active.");
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Matrix System Control Node</h2>
      
      {/* Network Connectivity Status Bar */}
      <div style={{
        padding: "10px", 
        marginBottom: "20px", 
        backgroundColor: serverStatus.includes("Online") ? "#d4edda" : "#f8d7da",
        color: serverStatus.includes("Online") ? "#155724" : "#721c24",
        borderRadius: "4px"
      }}>
        <strong>Backend Connection Status:</strong> {serverStatus}
      </div>

      {errorLog && (
        <p style={{ color: "red", fontSize: "14px" }}>⚠️ {errorLog}</p>
      )}

      <hr />
      
      {/* Rendering your subcomponent panel */}
      <AdminPanel />
    </div>
  );
}