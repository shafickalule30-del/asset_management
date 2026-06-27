import React, { useEffect, useState } from "react";

export default function AdminPanel() {
  const [serverStatus, setServerStatus] = useState("Connecting...");
  const [errorLog, setErrorLog] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

  const fetchPendingTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions/pending`);
      if (!res.ok) throw new Error('Unable to fetch pending transactions');
      const data = await res.json();
      setTransactions(data);
      setErrorLog(null);
    } catch (err) {
      console.error('Admin fetch error:', err);
      setErrorLog('Unable to reach the verification queue.');
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/status`)
      .then((res) => {
        if (!res.ok) throw new Error("Server operational state returned bad response status.");
        return res.json();
      })
      .then((data) => {
        setServerStatus(`Online (${data.database === 'connected' ? 'Database Cloud Linked' : 'No DB'})`);
        setErrorLog(null);
      })
      .catch((err) => {
        console.error('Frontend connection block encountered:', err);
        setServerStatus('Cannot connect to backend server');
        setErrorLog('Ensure backend is running on terminal via node server.js and your network is active.');
      });

    fetchPendingTransactions();
  }, []);

  const handleApprove = async (transactionId) => {
    try {
      setLoading(true);
      setMessage('');
      const res = await fetch(`${API_BASE_URL}/api/transactions/approve/${transactionId}`, { method: 'PUT' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Approval failed');
      setMessage('✅ Deposit approved and wallet funded.');
      fetchPendingTransactions();
    } catch (err) {
      console.error('Approval error:', err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#000', minHeight: '100vh' }}>
      <h2 style={{ color: '#00FF66' }}>Matrix System Control Node</h2>

      <div style={{
        padding: '10px',
        marginBottom: '20px',
        backgroundColor: serverStatus.includes('Online') ? '#d4edda' : '#f8d7da',
        color: serverStatus.includes('Online') ? '#155724' : '#721c24',
        borderRadius: '4px'
      }}>
        <strong>Backend Connection Status:</strong> {serverStatus}
      </div>

      {message && <div style={{ marginBottom: '15px', color: '#00FF66' }}>{message}</div>}
      {errorLog && <p style={{ color: 'red', fontSize: '14px' }}>⚠️ {errorLog}</p>}

      <hr style={{ borderColor: '#222', margin: '20px 0' }} />

      <h3 style={{ color: '#00FF66' }}>Pending Deposit Verifications</h3>
      {transactions.length === 0 ? (
        <p style={{ color: '#888' }}>No pending deposit requests.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {transactions.map((tx) => (
            <div key={tx._id} style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '8px', padding: '14px' }}>
              <div><strong>User:</strong> {tx.username}</div>
              <div><strong>Amount:</strong> UGX {Number(tx.amount).toLocaleString()}</div>
              <div><strong>Transaction ID:</strong> {tx.transactionId || 'N/A'}</div>
              <div><strong>Merchant:</strong> {tx.merchantAccountName || 'N/A'} ({tx.merchantAccountNumber || 'N/A'})</div>
              <button
                onClick={() => handleApprove(tx._id)}
                disabled={loading}
                style={{ marginTop: '10px', backgroundColor: '#00FF66', color: '#000', border: 'none', padding: '10px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: loading ? 'default' : 'pointer' }}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}