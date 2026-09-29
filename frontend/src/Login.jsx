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
const getUserStateStorageKey = (userId) => `userState:${userId}`;
const phonePattern = /^07\d{8}$/;
const validatePassword = (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value || '');

const buildPersistedUser = (userData) => ({
  ...userData,
  walletBalance: userData.walletBalance ?? 0,
  balanceAccount: userData.balanceAccount ?? 0,
  referrals: userData.referrals ?? 0,
  claimedMilestones: userData.claimedMilestones ?? [],
  transactions: userData.transactions ?? [],
  activeMachines: userData.activeMachines ?? [],
  pendingDeposits: userData.pendingDeposits ?? [],
  pendingWithdrawals: userData.pendingWithdrawals ?? []
});

function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const normalizedPhone = (phone || '').trim();
    const normalizedPassword = (password || '').trim();

    if (!phonePattern.test(normalizedPhone)) {
      setError('❌ Enter a valid phone number starting with 074...');
      setLoading(false);
      return;
    }

    if (!validatePassword(normalizedPassword)) {
      setError('❌ Password must contain letters and numbers with at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const adminPhone = '0740000000';
      const adminEmail = 'shag@gmail.com';
      if ((normalizedPhone === adminPhone || normalizedPhone === adminEmail) && normalizedPassword === '123456') {
        const adminUser = {
          id: 'admin-1',
          username: 'Admin',
          phone: adminPhone,
          email: adminEmail,
          role: 'admin',
          walletBalance: 0,
          balanceAccount: 0,
          referrals: 0,
          claimedMilestones: [],
          transactions: [],
          activeMachines: [],
          pendingDeposits: [],
          pendingWithdrawals: []
        };

        const persistedAdmin = buildPersistedUser(adminUser);
        localStorage.setItem('token', 'local-admin-token');
        localStorage.setItem('user', JSON.stringify(persistedAdmin));
        localStorage.setItem(getUserStateStorageKey(persistedAdmin.id), JSON.stringify(persistedAdmin));

        setSuccess({
          title: 'Login successful',
          message: 'Welcome to the Admin Panel.',
          actionText: 'OK',
          onAction: () => navigate('/admin-panel')
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedPhone, password: normalizedPassword })
      });

      const textData = await response.text();
      const data = textData ? JSON.parse(textData) : {};

      if (response.status === 200) {
        const userPayload = data.user || data;
        const userRole = String(userPayload.role || data.role || 'user').toLowerCase();
        const userData = buildPersistedUser({
          ...userPayload,
          id: userPayload.id || userPayload._id || data.id || normalizedPhone,
          username: userPayload.username || data.username || normalizedPhone,
          phone: userPayload.phone || normalizedPhone,
          email: userPayload.email || data.email || '',
          role: userRole,
          walletBalance: userPayload.walletBalance ?? userPayload.balance ?? data.balance ?? 0,
          balanceAccount: userPayload.balanceAccount ?? userPayload.balance ?? data.balance ?? 0,
          referrals: userPayload.referrals ?? data.referrals ?? 0,
          claimedMilestones: userPayload.claimedMilestones ?? data.claimedMilestones ?? [],
          transactions: userPayload.transactions ?? data.transactions ?? [],
          activeMachines: userPayload.activeMachines ?? data.activeMachines ?? [],
          pendingDeposits: userPayload.pendingDeposits ?? data.pendingDeposits ?? [],
          pendingWithdrawals: userPayload.pendingWithdrawals ?? data.pendingWithdrawals ?? []
        });

        localStorage.setItem('token', data.token || '');
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem(getUserStateStorageKey(userData.id), JSON.stringify(userData));

        setSuccess({
          title: 'Login successful',
          message: 'Welcome back to the Terminal Dashboard.',
          actionText: 'OK',
          onAction: () => navigate(userRole === 'admin' ? '/admin-panel' : '/dashboard')
        });
      } else {
        setError(data.message || 'Authentication rejected.');
      }
    } catch (err) {
      console.error('Login routing error:', err);
      setError('❌ Cannot reach authentication servers.');
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
      justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px'
    }}>
      {success && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px'
        }}>
          <div style={{
            width: '100%', maxWidth: '360px', background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)', border: '2px solid #00FF66', borderRadius: '18px', padding: '26px 22px', boxShadow: '0 0 18px rgba(0, 255, 102, 0.18)'
          }}>
            <div style={{ fontSize: '34px', marginBottom: '10px' }}>✅</div>
            <div style={{ color: '#00FF66', fontSize: '12px', letterSpacing: '2px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Success</div>
            <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '24px' }}>{success.title}</h3>
            <p style={{ color: '#d4d4d4', margin: '0 0 22px 0', lineHeight: 1.5, fontSize: '14px' }}>{success.message}</p>
            <button
              type="button"
              onClick={dismissSuccess}
              style={{
                width: '100%', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #00FF66 0%, #00d9ff 100%)', color: '#000', fontWeight: '800', fontSize: '16px', padding: '14px'
              }}
            >
              {success.actionText}
            </button>
          </div>
        </div>
      )}

      <div style={{
        width: '100%', maxWidth: '400px', backgroundColor: '#0a0a0a',
        border: '2px solid #222', borderRadius: '12px', padding: '30px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h2 style={{ color: '#00FF66', margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold' }}>
            TERMINAL LOGIN
          </h2>
          <p style={{ color: '#666', margin: 0, fontSize: '13px' }}>
            Input terminal access credentials
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

        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
              style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              required
              placeholder="Letters and numbers"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '13px' }}>
          <span style={{ color: '#555' }}>Need a system key profile? </span>
          <Link to="/register" style={{ color: '#00FF66', textDecoration: 'none', fontWeight: 'bold' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
