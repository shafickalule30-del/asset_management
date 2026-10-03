import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return '';
  }
  return 'https://asset-management-55t5.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();
const phonePattern = /^07\d{8}$/;
const validatePassword = (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value || '');

function Register() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referrerId, setReferrerId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const refToken = queryParams.get('ref');

    if (refToken) {
      setReferrerId(refToken);
      console.log(`🔗 Referral link detected! Referrer ID: ${refToken}`);
    }
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedUsername = (username || '').trim();
    const normalizedPhone = (phone || '').trim();
    const normalizedPassword = (password || '').trim();

    if (!trimmedUsername || !normalizedPhone || !normalizedPassword) {
      setError('❌ Username, phone, and password are required.');
      setLoading(false);
      return;
    }

    if (!phonePattern.test(normalizedPhone)) {
      setError('❌ Enter a valid phone number (074XXXXXXXX)');
      setLoading(false);
      return;
    }

    if (!validatePassword(normalizedPassword)) {
      setError('❌ Password must contain letters and numbers with at least 6 characters.');
      setLoading(false);
      return;
    }

    if (normalizedPassword !== (confirmPassword || '').trim()) {
      setError('❌ Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: trimmedUsername,
          phone: normalizedPhone,
          password: normalizedPassword,
          referrerId: referrerId || null
        })
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};

      if (response.ok) {
        setSuccess({
          title: 'Account Created!',
          message: 'Your account has been created. Redirecting to login...',
          actionText: 'OK',
          onAction: () => navigate('/login')
        });
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('❌ Cannot reach the backend server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const dismissSuccess = () => {
    const nextAction = success?.onAction;
    setSuccess(null);
    if (nextAction) nextAction();
  };

  return (
    <div style={{
      backgroundColor: '#000000', minHeight: '100vh', display: 'flex',
      justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', color: '#ffffff', padding: '20px'
    }}>
      {success && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px'
        }}>
          <div style={{
            width: '100%', maxWidth: '360px', background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)', border: '2px solid #00FF66', borderRadius: '18px', padding: '26px 22px', boxShadow: '0 0 40px rgba(0, 255, 102, 0.15)'
          }}>
            <div style={{ fontSize: '34px', marginBottom: '10px' }}>🎉</div>
            <div style={{ color: '#00FF66', fontSize: '12px', letterSpacing: '2px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Success</div>
            <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '24px' }}>{success.title}</h3>
            <p style={{ color: '#d4d4d4', margin: '0 0 22px 0', lineHeight: 1.5, fontSize: '14px' }}>{success.message}</p>
            <button
              type="button"
              onClick={dismissSuccess}
              style={{
                width: '100%', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #00FF66 0%, #00d9ff 100%)', color: '#000', fontWeight: '800', fontSize: '16px', padding: '12px', cursor: 'pointer'
              }}
            >
              {success.actionText}
            </button>
          </div>
        </div>
      )}

      <div style={{
        width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '10px',
        border: '2px solid #00FF66', backgroundColor: '#111111', boxShadow: '0px 0px 15px rgba(0, 255, 102, 0.2)',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ textAlign: 'center', color: '#00FF66', marginBottom: '25px', margin: 0 }}>CREATE TERMINAL</h2>

        {error && (
          <div style={{
            color: '#ff4444', backgroundColor: 'rgba(255, 68, 68, 0.1)', border: '1px solid #ff4444',
            padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {referrerId && (
          <div style={{
            backgroundColor: 'rgba(0, 255, 102, 0.1)', border: '1px solid #00FF66',
            padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '15px', textAlign: 'center',
            color: '#00FF66'
          }}>
            ✅ Referred by: {referrerId.slice(0, 8)}...
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
              PHONE NUMBER
            </label>
            <input
              type="tel"
              inputMode="numeric"
              required
              pattern="07[0-9]{8}"
              placeholder="0741234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#000', border: '1px solid #222', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              PASSWORD (Letters + Numbers)
            </label>
            <input
              type="password"
              required
              placeholder="Must contain letters and numbers"
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
              placeholder="Confirm password"
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

export default Register;
