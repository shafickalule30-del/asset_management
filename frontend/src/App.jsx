import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem('user');
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

// =========================================================
// 1. PROTECTED ROUTE CONTROLLER
// =========================================================
const ProtectedRoute = ({ children }) => {
  const user = getStoredUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RootRedirect = () => {
  const [checked, setChecked] = useState(false);
  const [hasStoredUser, setHasStoredUser] = useState(false);

  useEffect(() => {
    setHasStoredUser(Boolean(getStoredUser()));
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  return hasStoredUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

// =========================================================
// 2. MAIN ROUTING APPLICATION
// =========================================================
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Root — redirect based on login status */}
        <Route path="/" element={<RootRedirect />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;