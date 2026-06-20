import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  // Form states to capture user input
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // Sending registration payload to your Node server on Port 5000
       // Current Broken Code:
// Fixed Code (Adjust based on your exact backend folder routes):
const API_URL = "https://asset-management-55t5.onrender.com/api/auth/signup"; 
// OR if you use a base URL configuration:
const API_URL = "https://asset-management-55t5.onrender.com/api";
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 Account created successfully! Redirecting to Login...");
        
        // 🚀 THE FIX: This line actively forces the frontend to jump straight to the login screen
        navigate('/login');
      } else {
        // Capture and display validation messages from your MongoDB backend
        setErrorMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("Cannot reach the backend server. Make sure 'node server.js' is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#000000',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      color: '#ffffff',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        borderRadius: '10px',
        border: '2px solid #00FF66', // Clean neon outline border
        backgroundColor: '#111111',
        boxShadow: '0px 0px 15px rgba(0, 255, 102, 0.2)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#00FF66', marginBottom: '25px' }}>Create Connect Account</h2>

        {/* Dynamic Error Banner */}
        {errorMessage && (
          <div style={{
            color: '#ff4444',
            backgroundColor: 'rgba(255, 68, 68, 0.1)',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
            fontSize: '14px',
            textAlign: 'center',
            border: '1px solid #ff4444'
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '14px' }}>Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #333',
                backgroundColor: '#222', color: '#fff', boxSizing: 'border-box'
              }}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '14px' }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #333',
                backgroundColor: '#222', color: '#fff', boxSizing: 'border-box'
              }}
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '14px' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #333',
                backgroundColor: '#222', color: '#fff', boxSizing: 'border-box'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: '5px', border: 'none',
              backgroundColor: '#00FF66', color: '#000', fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px', fontSize: '16px'
            }}
          >
            {loading ? 'Creating Profile...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#aaa', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#00FF66', textDecoration: 'none' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;