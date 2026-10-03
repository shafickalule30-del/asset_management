import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://asset-management-55t5.onrender.com';
const getUserStateStorageKey = (userId) => `userState:${userId}`;

function Home() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [balanceAccount, setBalanceAccount] = useState(0);
  const [referrals, setReferrals] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeMachines, setActiveMachines] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [claimedMilestones, setClaimedMilestones] = useState([]);
  const [referralLink, setReferralLink] = useState('');
  const [showAlert, setShowAlert] = useState(null);
  const [referralCommissions, setReferralCommissions] = useState(0);
  const [referredUsers, setReferredUsers] = useState([]);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setWalletBalance(parsedUser.walletBalance || 0);
      setBalanceAccount(parsedUser.balanceAccount || 0);
      setReferrals(parsedUser.referrals || 0);
      setActiveMachines(parsedUser.activeMachines || []);
      setTransactions(parsedUser.transactions || []);
      setPendingDeposits(parsedUser.pendingDeposits || []);
      setPendingWithdrawals(parsedUser.pendingWithdrawals || []);
      setClaimedMilestones(parsedUser.claimedMilestones || []);

      // Generate referral link
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/#/register?ref=${parsedUser.id}`;
      setReferralLink(link);

      // Calculate referral commissions (20% of referral earnings)
      const commissions = (parsedUser.referralCommissions || 0);
      setReferralCommissions(commissions);

      // Load referred users list
      setReferredUsers(parsedUser.referredUsers || []);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setShowAlert({
        type: 'success',
        title: 'Copied!',
        message: 'Referral link copied to clipboard'
      });
      setTimeout(() => setShowAlert(null), 3000);
    }).catch(() => {
      setShowAlert({
        type: 'error',
        title: 'Failed',
        message: 'Could not copy link'
      });
      setTimeout(() => setShowAlert(null), 3000);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (user?.id) {
      localStorage.removeItem(getUserStateStorageKey(user.id));
    }
    navigate('/login');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(value || 0);
  };

  if (!user) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000', color: '#fff' }}>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: isDarkMode ? '#000' : '#fff', minHeight: '100vh', color: isDarkMode ? '#fff' : '#000', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#f8f9fa', borderBottom: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: isDarkMode ? '#00FF66' : '#107C41' }}>TERMINAL</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>Welcome, {user.username}</p>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ padding: '8px 16px', backgroundColor: isDarkMode ? '#111' : '#e9ecef', border: 'none', borderRadius: '6px', color: isDarkMode ? '#00FF66' : '#107C41', cursor: 'pointer', fontWeight: 'bold' }}>
          {isDarkMode ? '☀️' : '🌙'} Theme
        </button>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ff4444', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout
        </button>
      </div>

      {/* Alert */}
      {showAlert && (
        <div style={{ backgroundColor: showAlert.type === 'success' ? 'rgba(0, 255, 102, 0.1)' : 'rgba(255, 68, 68, 0.1)', border: `1px solid ${showAlert.type === 'success' ? '#00FF66' : '#ff4444'}`, color: showAlert.type === 'success' ? '#00FF66' : '#ff4444', padding: '12px 20px', margin: '10px 20px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{showAlert.title}</strong>: {showAlert.message}
          </div>
          <button onClick={() => setShowAlert(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', backgroundColor: isDarkMode ? '#0a0a0a' : '#f8f9fa' }}>
        {['overview', 'machines', 'transactions', 'deposits', 'withdrawals', 'rewards'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 20px', border: 'none', backgroundColor: activeTab === tab ? (isDarkMode ? '#111' : '#e9ecef') : 'transparent', color: activeTab === tab ? '#00FF66' : '#666', cursor: 'pointer', fontWeight: activeTab === tab ? 'bold' : 'normal', textTransform: 'uppercase', fontSize: '12px' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '20px', borderRadius: '12px' }}>
              <p style={{ margin: '0 0 10px 0', color: '#888', fontSize: '12px', fontWeight: 'bold' }}>WALLET BALANCE</p>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00FF66' }}>{formatCurrency(walletBalance)}</div>
            </div>
            <div style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '20px', borderRadius: '12px' }}>
              <p style={{ margin: '0 0 10px 0', color: '#888', fontSize: '12px', fontWeight: 'bold' }}>BALANCE ACCOUNT</p>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00d9ff' }}>{formatCurrency(balanceAccount)}</div>
            </div>
            <div style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '20px', borderRadius: '12px' }}>
              <p style={{ margin: '0 0 10px 0', color: '#888', fontSize: '12px', fontWeight: 'bold' }}>REFERRAL COMMISSIONS (20%)</p>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFD700' }}>{formatCurrency(referralCommissions)}</div>
            </div>
            <div style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '20px', borderRadius: '12px' }}>
              <p style={{ margin: '0 0 10px 0', color: '#888', fontSize: '12px', fontWeight: 'bold' }}>ACTIVE REFERRALS</p>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF6B9D' }}>{referrals}</div>
            </div>
          </div>
        )}

        {activeTab === 'machines' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ color: isDarkMode ? '#00FF66' : '#107C41', marginTop: 0 }}>ACTIVE MACHINES</h3>
            {activeMachines.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No active machines</div>
            ) : (
              activeMachines.map((machine, idx) => (
                <div key={idx} style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '15px', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Machine {idx + 1}</p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#888' }}>Product: {machine.productId}</p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#888' }}>Days: {machine.days}</p>
                  <p style={{ margin: '0', fontSize: '12px', color: machine.claimed ? '#ff4444' : '#00FF66' }}>Status: {machine.claimed ? 'Claimed' : 'Active'}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ color: isDarkMode ? '#00FF66' : '#107C41', marginTop: 0 }}>TRANSACTIONS</h3>
            {transactions.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No transactions</div>
            ) : (
              transactions.map((tx, idx) => (
                <div key={idx} style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>{tx.type}</p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#888' }}>{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: 'right', color: tx.type === 'Withdrawal' ? '#ff4444' : '#00FF66' }}>
                    <strong>{tx.type === 'Withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'deposits' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ color: isDarkMode ? '#00FF66' : '#107C41', marginTop: 0 }}>PENDING DEPOSITS</h3>
            {pendingDeposits.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No pending deposits</div>
            ) : (
              pendingDeposits.map((dep, idx) => (
                <div key={idx} style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '15px', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Deposit {formatCurrency(dep.amount)}</p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#FFD700' }}>Status: Pending Verification</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ color: isDarkMode ? '#00FF66' : '#107C41', marginTop: 0 }}>PENDING WITHDRAWALS</h3>
            {pendingWithdrawals.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No pending withdrawals</div>
            ) : (
              pendingWithdrawals.map((wit, idx) => (
                <div key={idx} style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '15px', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Withdrawal {formatCurrency(wit.amount)}</p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#FFD700' }}>Status: Pending Approval</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', paddingBottom: '10px' }}>
              <h3 style={{ color: isDarkMode ? '#00FF66' : '#107C41', margin: 0 }}>REFERRAL REWARDS & COMMISSIONS</h3>
              <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '12px' }}>Earn 20% commission on all referral deposits verified</p>
            </div>

            {/* Commission Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '20px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 10px 0', color: '#888', fontSize: '12px', fontWeight: 'bold' }}>TOTAL COMMISSIONS EARNED</p>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700' }}>{formatCurrency(referralCommissions)}</div>
              </div>
              <div style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '20px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 10px 0', color: '#888', fontSize: '12px', fontWeight: 'bold' }}>ACTIVE REFERRALS</p>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B9D' }}>{referrals} users</div>
              </div>
            </div>

            {/* Referral Link Section */}
            <div style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: isDarkMode ? '#00FF66' : '#107C41' }}>YOUR REFERRAL LINK</h4>
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <input type="text" readOnly value={referralLink} style={{ padding: '12px', backgroundColor: isDarkMode ? '#111' : '#f1f3f5', color: isDarkMode ? '#aaa' : '#333', border: '1px solid #222', borderRadius: '6px', fontFamily: 'monospace', fontSize: '12px' }} />
                <button onClick={copyToClipboard} style={{ backgroundColor: isDarkMode ? '#111' : '#e9ecef', color: isDarkMode ? '#00FF66' : '#107C41', border: '1px solid #222', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>
                  📋 Copy Referral Link
                </button>
              </div>
            </div>

            {/* How It Works */}
            <div style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: isDarkMode ? '#00FF66' : '#107C41' }}>HOW REFERRAL COMMISSIONS WORK</h4>
              <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: '#ccc' }}>
                <li>Share your referral link with friends</li>
                <li>They sign up using your link and make a deposit</li>
                <li>Deposit is verified by admin (Pending → Verified)</li>
                <li>You automatically earn 20% commission on their deposit</li>
                <li>Commission is added to your Wallet Balance</li>
                <li>Withdraw commissions anytime to your account</li>
              </ol>
            </div>

            {/* Referred Users */}
            {referredUsers.length > 0 && (
              <div style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: isDarkMode ? '#00FF66' : '#107C41' }}>YOUR REFERRALS ({referredUsers.length})</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {referredUsers.map((referral, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: isDarkMode ? '#111' : '#f8f9fa', borderRadius: '6px', fontSize: '13px' }}>
                      <div>
                        <strong>{referral.username}</strong>
                        <p style={{ margin: '2px 0 0 0', color: '#888' }}>Joined: {new Date(referral.joinedAt).toLocaleDateString()}</p>
                      </div>
                      <div style={{ textAlign: 'right', color: '#00FF66' }}>
                        <strong>Commission: {formatCurrency(referral.commissionEarned || 0)}</strong>
                        <p style={{ margin: '2px 0 0 0', color: referral.depositsVerified ? '#00FF66' : '#FFD700', fontSize: '11px' }}>
                          {referral.depositsVerified ? '✓ Deposits Verified' : '⏳ Pending Verification'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share Tips */}
            <div style={{ backgroundColor: 'rgba(0, 255, 102, 0.1)', border: '1px solid #00FF66', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#00FF66' }}>💡 SHARING TIPS</h4>
              <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8', color: '#ccc' }}>
                <li>Share on social media (WhatsApp, Telegram, Twitter)</li>
                <li>The more referrals who verify deposits, the more commissions you earn</li>
                <li>Your referrals can also refer others - everyone benefits!</li>
                <li>Commission is automatic - no manual claims needed</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
