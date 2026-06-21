import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';       
import Register from './Register'; 

// =========================================================
// 1. AUTHENTICATION GUARD MIDDLEWARE
// =========================================================

// Protects private screens from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Force redirect to login portal if token is missing
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Redirects logged-in users away from auth pages (Login/Register)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    // If already logged in, fast-forward straight to the dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// =========================================================
// 2. CORE DASHBOARD VIEW COMPONENT
// =========================================================
function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear session
    alert('🔒 Session securely disconnected.');
    navigate('/login'); // Clean programmatic redirect
  };

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#ffffff', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ border: '2px solid #00FF66', padding: '40px', borderRadius: '12px', backgroundColor: '#0a0a0a', textAlign: 'center', maxWidth: '500px', width: '100%', boxShadow: '0px 0px 20px rgba(0, 255, 102, 0.1)' }}>
        <h1 style={{ color: '#00FF66', marginBottom: '10px', fontSize: '28px', fontWeight: 'bold' }}>SYSTEM DASHBOARD</h1>
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>Asset Management Core Terminal</p>
        
        <div style={{ padding: '20px', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222', marginBottom: '30px', textAlign: 'left' }}>
          <span style={{ color: '#00FF66', fontWeight: 'bold' }}>●</span> <span style={{ color: '#aaa', fontSize: '13px' }}>Database State: Connected</span>
        </div>

        <button 
          onClick={handleLogout}
          style={{ backgroundColor: '#ff4444', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%', transition: 'background 0.2s' }}
        >
          DISCONNECT TERMINAL
        </button>
      </div>
    </div>
  );
}

// =========================================================
// 3. MAIN ROUTING GRID ARCHITECTURE
// =========================================================
function App() {
  return (
    <Router>
      <Routes>
        
        {/* 🔓 Public Gateways (Guarded against signed-in users) */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* 🛡️ Protected Internal Terminals */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* 🔄 Fallback Redirect Layer */}
        {/* If a token exists, any random URL routes to dashboard; if not, routes to login */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </Router>
  );
}

export default App;