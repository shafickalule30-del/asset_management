import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // 🔗 Referral Parameter tracking state
  const [referrerId, setReferrerId] = useState(null);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ==========================================
  // 🛰️ URL INTERCEPT ENGINE
  // ==========================================
  useEffect(() => {
    // Automatically checks window location parameters for an active affiliate token (?ref=...)
    const queryParams = new URLSearchParams(window.location.search);
    const refToken = queryParams.get('ref');
    
    if (refToken) {
      setReferrerId(refToken);
      console.log(`🔗 Affiliate tracking network link detected! Referrer ID: ${refToken}`);
    }
  }, []);

  // ==========================================
  // 🚀 HANDLER: COMMITTING FRESH ACCOUNT PAYLOAD
  // ==========================================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Baseline security confirmation
    if (password !== confirmPassword) {
      setError('❌ Passwords do not match!');
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setError('❌ Security Alert: Password must be at least 4 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://asset-management-55t5.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We package the form state alongside our silent referral string parameter
        body: JSON.stringify({
          username,
          email,
          password,
          referrerId: referrerId || null // Sends null if it's a standard direct signup
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('🎉 Account Terminal Created Successfully! Directing to authentication node...');
        navigate('/login'); // Send them over to log in straight away
      } else {
        setError(data.message || 'Registration failed processing profile.');
      }
    } catch (err) {
      console.error('Registration routing error:', err);
      setError('❌ Connection timeout. Is your backend server.js active on port 5000?');
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
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        backgroundColor: '#0a0a0a', 
        border: '2px solid #222', 
        borderRadius: '12px', 
        padding: '30px',
        boxSizing: 'border-box',
        boxShadow: referrerId ? '0 0 25px rgba(0, 255, 102, 0.1)' : 'none'
      }}>
        
        {/* BRAND IDENTITY */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h2 style={{ color: '#00FF66', margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            CREATE TERMINAL
          </h2>
          <p style={{ color: '#666', margin: 0, fontSize: '13px' }}>
            Register your distributed network profile
          </p>
          
          {/* VISUAL AFFILIATE BADGE */}
          {referrerId && (
            <div style={{ 
              marginTop: '12px', 
              display: 'inline-block', 
              backgroundColor: 'rgba(0, 255, 102, 0.1)', 
              border: '1px solid #00FF66', 
              borderRadius: '20px', 
              padding: '4px 12px',
              fontSize: '11px',
              color: '#00FF66',
              fontWeight: 'bold'
            }}>
              🔒 Secure Invitation Tracking Active
            </div>
          )}
        </div>

        {/* ERROR PROMPT BAR */}
        {error && (
          <div style={{ 
            backgroundColor: 'rgba(255, 68, 68, 0.1)', 
            border: '1px solid #ff4444', 
            borderRadius: '6px', 
            padding: '10px', 
            color: '#ff4444', 
            fontSize: '13px', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* REGISTRATION FORM */}
        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              OPERATOR USERNAME
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. shafic_dev"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '6px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              EMAIL ROUTE
            </label>
            <input 
              type="email" 
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '6px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              SECURITY ACCESS PASSWORD
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '6px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              CONFIRM ACCESS PASSWORD
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '6px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              backgroundColor: '#00FF66', 
              color: '#000', 
              border: 'none', 
              padding: '14px', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              fontSize: '14px',
              cursor: loading ? 'default' : 'pointer',
              marginTop: '10px',
              opacity: loading ? 0.6 : 1,
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'PROCESSING METRICS...' : 'EXECUTE REGISTRATION'}
          </button>
        </form>

        {/* BOTTOM REDIRECT LINK */}
        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '13px' }}>
          <span style={{ color: '#555' }}>Already have an active terminal? </span>
          <Link to="/login" style={{ color: '#00FF66', textDecoration: 'none', fontWeight: 'bold' }}>
            Login Here
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;