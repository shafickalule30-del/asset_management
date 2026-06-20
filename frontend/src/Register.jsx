import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('❌ Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      // Sending exact payload structure: phoneNumber & password
      const response = await fetch('https://asset-management-55t5.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('🎉 Account Created Successfully! Directing to login...');
        navigate('/login'); 
      } else {
        setError(data.message || 'Registration failed processing profile.');
      }
    } catch (err) {
      console.error('Registration routing error:', err);
      setError('❌ Connection timeout. Cannot reach the cloud API endpoint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#000000', minHeight: '100vh', display: 'flex', 
      justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px'
    }}>
      <div style={{ 
        width: '100%', maxWidth: '400px', backgroundColor: '#0a0a0a', 
        border: '2px solid #222', borderRadius: '12px', padding: '30px'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h2 style={{ color: '#00FF66', margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold' }}>
            CREATE TERMINAL
          </h2>
          <p style={{ color: '#666', margin: 0, fontSize: '13px' }}>
            Register your phone-centric network profile
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(255, 68, 68, 0.1)', border: '1px solid #ff4444', 
            borderRadius: '6px', padding: '10px', color: '#ff4444', fontSize: '13px', marginBottom: '20px', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              PHONE NUMBER
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. 2567..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
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
              style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
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
              style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
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

export default Register;