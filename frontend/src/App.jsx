import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';       // Fixed: Imports directly from the src folder
import Register from './Register'; // Fixed: Imports directly from the src folder

// =========================================================
// 1. PROTECTED ROUTE MIDDLEWARE COMPONENT
// =========================================================
const ProtectedRoute = ({ children }) => {
  // Read the token key exactly matching the Login system storage marker
  const token = localStorage.getItem('token');

  // If no system access key token is found, securely eject user back to registration terminal
  if (!token) {
    return <Navigate to="/register" replace />;
  }

  // If token is verified, safely render the requested component layout
  return children;
};

// =========================================================
// 2. TEMPORARY HOMEPAGE DASHBOARD COMPONENT
// =========================================================
function HomeDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Wipe token credentials from local system
    alert('🔒 Session closed. System locked.');
    window.location.reload(); // Force full structural state wipe
  };

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#ffffff', fontFamily: 'sans-serif' }}>
      <div style={{ border: '2px solid #00FF66', padding: '40px', borderRadius: '12px', backgroundColor: '#0a0a0a', textAlign: 'center', boxShadow: '0px 0px 20px rgba(0, 255, 102, 0.15)' }}>
        <h1 style={{ color: '#00FF66', marginBottom: '10px' }}>MAIN CORE SYSTEM TERMINAL</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Database Connection: ONLINE | Firewall Status: ACTIVE</p>

        <button
          onClick={handleLogout}
          style={{ backgroundColor: '#ff4444', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          DISCONNECT SESSION
        </button>
      </div>
    </div>
  );
}

// =========================================================
// 3. MAIN ROUTING APPLICATION COMPONENT
// =========================================================
function App() {
  return (
    <Router>
      <Routes>

        {/* 🔐 PUBLIC ROUTING PORTALS: Open access to login and registration panels */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🛡️ PROTECTED CORE HOMEPAGE ROUTE: Accessible only with a valid local token string */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔄 FALLBACK RE-ROUTE: Sends any random input string back to the central root index */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;