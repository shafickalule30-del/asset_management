import React from 'react';

function DashboardView() {
  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#00FF66' }}>Welcome to Connect</h2>

      {/* Account Balance Display */}
      <div style={{
        border: '2px dashed #00FF66',
        borderRadius: '10px',
        padding: '20px',
        textAlign: 'center',
        margin: '20px 0',
        backgroundColor: '#111'
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>&lt;&lt; Account bal &gt;&gt;</p>
        <h1 style={{ margin: '10px 0', fontSize: '32px', color: '#00FF66' }}>00.0 UGX</h1>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
        <button style={{ padding: '10px 25px', backgroundColor: '#00FF66', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Deposit</button>
        <button style={{ padding: '10px 25px', backgroundColor: 'transparent', color: '#00FF66', border: '2px solid #00FF66', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Withdraw</button>
      </div>

      {/* History Feed */}
      <h3>History</h3>
      <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#ccc' }}>
        <li>Deposited UGX 1000, July</li>
      </ul>
    </div>
  );
}

export default DashboardView;