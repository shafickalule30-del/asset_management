import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';       
import Register from './Register'; 
import Home from './Home'; // 🛠️ 1. IMPORT YOUR HOME FILE HERE

// =========================================================
// AUTHENTICATION GUARDS
// =========================================================
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// =========================================================
// MAIN ROUTING ARCHITECTURE
// =========================================================
function App() {
  return (
    <Router>
      <Routes>
        {/* Public authentication panels */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* 🛠️ 2. YOUR HOME COMPONENT IS NOW LOADED SECURELY HERE */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />

        {/* Fallback route: redirects anything else to the dashboard/home */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;