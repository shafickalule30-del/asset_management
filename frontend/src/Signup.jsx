import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (password !== confirmPassword) {
      setErrorMessage('❌ Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      // 🚀 Points directly to your true live server at the correct /register route
      const response = await fetch("https://asset-management-55t5.onrender.com/api/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};

      if (response.ok) {
        alert("🎉 Account created successfully! Redirecting to Login...");
        navigate('/login');
      } else {
        setErrorMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("Cannot reach the backend server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#000000', minHeight: '100vh', display: 'flex', 
      justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: '#ffffff', padding: '20px'
    }}>
      <div style={{
        width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '10px',
        border: '2px solid #00FF66', backgroundColor: '#111111', boxShadow: '0px 0px 15px rgba(0, 255, 102, 0.2)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#00FF66', marginBottom: '25px' }}>CREATE TERMINAL</h2>

        {errorMessage && (
          <div style={{
            color: '#ff4444', backgroundColor: 'rgba(255, 68, 68, 0.1)', border: '1px solid #ff4444',
            padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px', textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              USERNAME
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. operator1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#000', border: '1px solid #222', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              EMAIL ADDRESS
            </label>
            <input 
              type="email" 
              required
              placeholder="operator@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#000', border: '1px solid #222', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              ACCESS PASSWORD
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#000', border: '1px solid #222', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              CONFIRM PASSWORD
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#000', border: '1px solid #222', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', backgroundColor: '#00FF66', color: '#000', border: 'none', 
              padding: '14px', borderRadius: '6px', fontWeight: 'bold', cursor: loading ? 'default' : 'pointer', marginTop: '10px'
            }}
          >
            {loading ? 'PROCESSING...' : 'EXECUTE REGISTRATION'}
          </button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '13px' }}>
          <span style={{ color: '#555' }}>Already have an account? </span>
          <Link to="/login" style={{ color: '#00FF66', textDecoration: 'none', fontWeight: 'bold' }}>
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;