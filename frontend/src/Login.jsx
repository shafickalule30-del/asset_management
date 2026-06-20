import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
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
      // Sending request to your Node server on Port 5000
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Save user info to local storage so the home page knows who logged in
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // 🚀 CRUCIAL JUMP: Pushes the user straight onto your sketch-designed dashboard!
        navigate('/home'); 
      } else {
        setErrorMessage(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Cannot connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#000000', minHeight: '100vh', display: 'flex',
      justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: '#ffffff'
    }}>
      <div style={{
        width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '10px',
        border: '2px solid #00FF66', backgroundColor: '#111111'
      }}>
        <h2 style={{ textAlign: 'center', color: '#00FF66', marginBottom: '25px' }}>Log In to Connect</h2>

        {errorMessage && (
          <div style={{ color: '#ff4444', backgroundColor: 'rgba(255,68,68,0.1)', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', border: '1px solid #ff4444' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#00FF66', color: '#000', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            {loading ? 'Verifying...' : 'Log In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#aaa' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#00FF66', textDecoration: 'none' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;