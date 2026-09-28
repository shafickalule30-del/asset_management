import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import AdminPanel from './pages/AdminPanel';

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem('user');
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && String(user.role || '').toLowerCase() !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RootRedirect = () => {
  const [checked, setChecked] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/login');

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser?.role === 'admin') {
      setRedirectPath('/admin-panel');
    } else if (storedUser) {
      setRedirectPath('/dashboard');
    } else {
      setRedirectPath('/login');
    }
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  return <Navigate to={redirectPath} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
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

        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
