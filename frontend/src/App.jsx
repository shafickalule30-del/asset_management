import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Home from './Home'; // This points to your main dashboard page

function App() {
  // Server (Express) CORS configuration example:
  // app.use(cors({
  //   origin: ['http://localhost:5173', 'https://powerbank-app.onrender.com']
  // }));
  return (
    <Router>
      <Routes>
        {/* 1. If someone loads the base URL, send them straight to signup */}
        <Route path="/" element={<Navigate to="/signup" />} />

        {/* 2. Explicitly map out the authentication routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 3. The Home path that the login page attempts to open */}
        <Route path="/home" element={<Home />} />

        {/* 4. Fallback: If a path doesn't exist, bounce them back to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;