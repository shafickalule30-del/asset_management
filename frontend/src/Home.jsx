import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PowerbankGraphic({ accentColor = '#00FF66' }) {
  return (
    <div style={{
      position: 'relative',
      width: '56px',
      height: '90px',
      background: 'linear-gradient(145deg, #1e1e1e, #0f0f0f)',
      borderRadius: '8px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)',
      border: '1px solid #2a2a2a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 4px',
      boxSizing: 'border-box',
    }}>
      <div style={{ width: '80%', height: '2px', backgroundColor: accentColor, borderRadius: '2px', opacity: 0.8, boxShadow: `0 0 4px ${accentColor}` }} />
      <div style={{ width: '85%', height: '22px', backgroundColor: '#050505', borderRadius: '4px', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold', color: accentColor, textShadow: `0 0 5px ${accentColor}` }}>100%</div>
      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', width: '100%' }}>
        <div style={{ width: '13px', height: '5px', backgroundColor: '#151515', border: '1px solid #333', borderRadius: '1px', position: 'relative' }}>
          <div style={{ width: '100%', height: '1px', backgroundColor: accentColor, position: 'absolute', top: 0, opacity: 0.7 }} />
        </div>
        <div style={{ width: '13px', height: '5px', backgroundColor: '#151515', border: '1px solid #333', borderRadius: '1px', position: 'relative' }}>
          <div style={{ width: '100%', height: '1px', backgroundColor: accentColor, position: 'absolute', top: 0, opacity: 0.7 }} />
        </div>
      </div>
      <div style={{ width: '50%', height: '10px', display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.2 }}>
        <div style={{ width: '100%', height: '1px', backgroundColor: '#fff' }} />
        <div style={{ width: '60%', height: '1px', backgroundColor: '#fff', alignSelf: 'center' }} />
      </div>
    </div>
  );
}

function calculateProfit(price, classTier) {
  if (classTier === 'B') return price * 2;
  if (classTier === 'C') return price * 3;
  return 0;
}

function calculateTotalReturn(price, classTier) {
  return price + calculateProfit(price, classTier);
}

function Home() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [walletBalance, setWalletBalance] = useState(0);
  const [balanceAccount, setBalanceAccount] = useState(0);
  const [referrals, setReferrals] = useState(0);
  const [claimedList, setClaimedList] = useState([]);
  const [activeMachines, setActiveMachines] = useState([]);
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [now, setNow] = useState(Date.now());

  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedClass, setSelectedClass] = useState('A');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedMachine, setCompletedMachine] = useState(null);
  const [selectedProductToBuy, setSelectedProductToBuy] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [paymentId, setPaymentId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [depositNetwork, setDepositNetwork] = useState('MTN');

  const rewardsRoadmap = [
    { target: 2, type: "Cash", reward: "UGX 3,000", desc: "Kickstart bonus" },
    { target: 5, type: "Cash", reward: "UGX 10,000", desc: "Standard tier bonus" },
    { target: 10, type: "Cash", reward: "UGX 20,000", desc: "Advanced milestone" },
    { target: 15, type: "Hardware", reward: "Alpha Slim Powerbank", desc: "Physical Class A device" },
    { target: 20, type: "Cash", reward: "UGX 45,000", desc: "Premium level bonus" },
    { target: 25, type: "Cash", reward: "UGX 60,000", desc: "High performance payout" },
    { target: 30, type: "Hardware", reward: "Delta Prime Powerbank", desc: "Physical Class B hardware" },
    { target: 40, type: "Cash", reward: "UGX 90,000", desc: "Elite cash optimization" },
    { target: 50, type: "Cash", reward: "UGX 130,000", desc: "Ultimate affiliate tier" },
    { target: 60, type: "Hardware", reward: "Quantum Base Powerbank", desc: "Grand Master delivery" }
  ];

  const powerbankCatalog = {
    A: [
      { id: "A-01", name: "Class A - Machine 1", price: 2000, days: 30, classTier: 'A', desc: "Cost 2,000. Get 20,000 in 30 days.", imgColor: "#00FF66" },
      { id: "A-02", name: "Class A - Machine 2", price: 5000, days: 30, classTier: 'A', desc: "Cost 5,000. Get 50,000 in 30 days.", imgColor: "#00FF99" },
      { id: "A-03", name: "Class A - Machine 3", price: 10000, days: 40, classTier: 'A', desc: "Cost 10,000. Get 125,000 in 40 days.", imgColor: "#33FF66" },
      { id: "A-04", name: "Class A - Machine 4", price: 20000, days: 60, classTier: 'A', desc: "Cost 20,000. Get 250,000 in 60 days.", imgColor: "#107C41" }
    ],
    B: [
      { id: "B-01", name: "Delta Prime 20K", price: 75000, days: 45, classTier: 'B', desc: "45 days. 200% profit. Return UGX 225,000.", imgColor: "#00BCFF" },
      { id: "B-02", name: "Delta Nitro 25K", price: 88000, days: 45, classTier: 'B', desc: "45 days. 200% profit. Return UGX 264,000.", imgColor: "#0099FF" },
      { id: "B-03", name: "Delta Combat 30K", price: 105000, days: 45, classTier: 'B', desc: "45 days. 200% profit. Return UGX 315,000.", imgColor: "#0066CC" },
      { id: "B-04", name: "Delta Matrix Ultra", price: 120000, days: 45, classTier: 'B', desc: "45 days. 200% profit. Return UGX 360,000.", imgColor: "#1F4E79" }
    ],
    C: [
      { id: "C-01", name: "Quantum Base 40K", price: 140000, days: 60, classTier: 'C', desc: "60 days. 300% profit. Return UGX 560,000.", imgColor: "#FFD700" },
      { id: "C-02", name: "Quantum Solar 50K", price: 175000, days: 60, classTier: 'C', desc: "60 days. 300% profit. Return UGX 700,000.", imgColor: "#DAA520" },
      { id: "C-03", name: "Quantum Command 60K", price: 210000, days: 60, classTier: 'C', desc: "60 days. 300% profit. Return UGX 840,000.", imgColor: "#B8860B" },
      { id: "C-04", name: "Quantum Nexus Tower", price: 260000, days: 60, classTier: 'C', desc: "60 days. 300% profit. Return UGX 1,040,000.", imgColor: "#8B6508" }
    ]
  };

  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();

  // Live countdown tick
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Check for completed machines
  useEffect(() => {
    const completed = activeMachines.find(m => {
      const endTime = new Date(m.purchasedAt).getTime() + (m.days * 24 * 60 * 60 * 1000);
      return Date.now() >= endTime && !m.claimed;
    });
    if (completed) {
      setCompletedMachine(completed);
      setShowCompletionModal(true);
    }
  }, [now, activeMachines]);

  // Check for approved deposits from admin (polling)
  useEffect(() => {
    const checkApprovedDeposits = async () => {
      if (!user || pendingDeposits.length === 0) return;
      try {
        const res = await fetch(`http://localhost:3000/api/deposits?status=approved`);
        const deposits = await res.json();
        const userDeposits = deposits.filter(d => d.user_id === user.id);

        userDeposits.forEach(ad => {
          // Check if we already processed this one
          if (!pendingDeposits.find(pd => pd.id === ad.id && pd.processed)) {
            const amount = ad.amount;
            const newWallet = walletBalance + amount;
            setWalletBalance(newWallet);

            const newTxn = { id: `ADMIN-${ad.id}`, type: "Deposit", status: "Approved", amount: amount, date: "Today" };
            setTransactions(prev => [newTxn, ...prev]);

            // Mark as processed
            setPendingDeposits(prev => prev.map(pd =>
              pd.id === ad.id ? { ...pd, processed: true } : pd
            ));

            alert(`✅ Admin approved your deposit of UGX ${amount.toLocaleString()}! Wallet updated.`);
          }
        });
      } catch (err) { }
    };

    const interval = setInterval(checkApprovedDeposits, 10000);
    return () => clearInterval(interval);
  }, [user, pendingDeposits, walletBalance]);

  // Load user data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setWalletBalance(parsedUser.walletBalance || 0);
      setBalanceAccount(parsedUser.balanceAccount || 0);
      setReferrals(parsedUser.referrals || 0);
      setClaimedList(parsedUser.claimedMilestones || []);
      setTransactions(parsedUser.transactions || []);
      setPendingDeposits(parsedUser.pendingDeposits || []);

      const savedMachines = parsedUser.activeMachines || [];
      const machinesWithTime = savedMachines.map(m => ({
        ...m,
        purchasedAt: m.purchasedAt || new Date().toISOString(),
        claimed: m.claimed || false
      }));
      setActiveMachines(machinesWithTime);
    }
  }, [navigate]);

  const saveUserData = (newWallet, newBalance, newMachines, newTransactions, newClaimed, newPending) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      walletBalance: newWallet !== undefined ? newWallet : walletBalance,
      balanceAccount: newBalance !== undefined ? newBalance : balanceAccount,
      activeMachines: newMachines !== undefined ? newMachines : activeMachines,
      transactions: newTransactions !== undefined ? newTransactions : transactions,
      claimedMilestones: newClaimed !== undefined ? newClaimed : claimedList,
      pendingDeposits: newPending !== undefined ? newPending : pendingDeposits
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const referralLink = user ? `${window.location.origin}/register?ref=${user.id}` : "";
  const shareMessage = `Hey! Join this hardware energy app! Sign up here: ${referralLink}`;

  const triggerDepositFlow = () => {
    setCurrentView('coin_spin');
    setTimeout(() => setCurrentView('deposit_guide'), 1200);
  };

  const triggerWithdrawFlow = () => {
    setCurrentView('coin_spin');
    setTimeout(() => setCurrentView('withdraw_portal'), 1200);
  };

  // DEPOSIT — sends to ADMIN for approval
  const handlePaymentIdSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) return alert("❌ Enter a valid amount.");
    if (!paymentId.trim()) return alert("❌ Enter the payment ID.");

    try {
      // Send to admin panel for approval
      const res = await fetch('http://localhost:3000/api/submit-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          username: user.username || 'Anonymous',
          amount: amount,
          payment_id: paymentId.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        const newPending = [...pendingDeposits, { id: data.deposit_id, amount, processed: false }];
        setPendingDeposits(newPending);

        const newTxn = { id: `PEND-${Math.floor(1000 + Math.random() * 9000)}`, type: "Deposit", status: "Pending", amount: amount, date: "Today" };
        const newTransactions = [newTxn, ...transactions];
        setTransactions(newTransactions);
        saveUserData(undefined, undefined, undefined, newTransactions, undefined, newPending);

        alert(`⏳ Deposit of UGX ${amount.toLocaleString()} submitted for admin verification. You will be notified when approved.`);
        setPaymentId('');
        setDepositAmount('');
        setCurrentView('dashboard');
      } else {
        alert("❌ Failed to submit deposit. Try again.");
      }
    } catch (err) {
      alert("❌ Admin server not reachable. Make sure the admin panel is running on port 3000.");
    }
  };

  const handleWithdrawAmountChange = (e) => {
    const value = e.target.value;
    setWithdrawAmount(value);
    setReceiveAmount(Number(value) > 0 ? Number(value) * 0.9 : 0);
  };

  // WITHDRAW — from Balance Account only
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || balanceAccount < amt) return alert("Insufficient Balance Account funds.");

    const newBalance = balanceAccount - amt;
    setBalanceAccount(newBalance);

    const newTxn = { id: `WTH-${Math.floor(1000 + Math.random() * 9000)}`, type: "Withdraw", status: "Success", amount: amt, date: "Today" };
    const newTransactions = [newTxn, ...transactions];
    setTransactions(newTransactions);
    saveUserData(undefined, newBalance, undefined, newTransactions);

    alert(`📥 UGX ${receiveAmount.toLocaleString()} will be sent to your mobile money (after 10% fee).`);
    setWithdrawAmount('');
    setCurrentView('dashboard');
  };

  // BUY MACHINE — deducts from WALLET
  const initiaitePurchaseSequence = (product) => {
    const hasActiveMachine = activeMachines.some(m => {
      const endTime = new Date(m.purchasedAt).getTime() + (m.days * 24 * 60 * 60 * 1000);
      return m.productId === product.id && Date.now() < endTime && !m.claimed;
    });
    if (hasActiveMachine) {
      return alert("❌ Machine Locked! You already leased this machine. Wait for it to complete.");
    }
    if (walletBalance < product.price) return alert("❌ Insufficient Wallet funds.");
    setSelectedProductToBuy(product);
    setShowConfirmModal(true);
  };

  const executeConfirmedPurchase = () => {
    setShowConfirmModal(false);
    if (!selectedProductToBuy) return;
    const product = selectedProductToBuy;
    const newWallet = walletBalance - product.price;

    const newMachine = {
      id: product.id + '-' + Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      days: product.days,
      classTier: product.classTier || 'A',
      purchasedAt: new Date().toISOString(),
      claimed: false,
      profit: calculateProfit(product.price, product.classTier || 'A'),
      totalReturn: calculateTotalReturn(product.price, product.classTier || 'A')
    };

    const updatedMachines = [...activeMachines, newMachine];
    setActiveMachines(updatedMachines);
    setWalletBalance(newWallet);

    const newTxn = { id: `FLEET-${Math.floor(1000 + Math.random() * 9000)}`, type: "Purchase", status: "Success", amount: product.price, date: "Today" };
    const newTransactions = [newTxn, ...transactions];
    setTransactions(newTransactions);
    saveUserData(newWallet, undefined, updatedMachines, newTransactions);

    alert(`🎉 ${product.name} is now deployed! Profit will go to Balance Account when complete.`);
    setSelectedProductToBuy(null);
  };

  // CLAIM completed machine — goes to BALANCE ACCOUNT
  const claimCompletedMachine = () => {
    if (!completedMachine) return;
    const newBalance = balanceAccount + completedMachine.totalReturn;
    setBalanceAccount(newBalance);
    const updatedMachines = activeMachines.map(m =>
      m.id === completedMachine.id ? { ...m, claimed: true } : m
    );
    setActiveMachines(updatedMachines);

    const newTxn = { id: `PROFIT-${Math.floor(1000 + Math.random() * 9000)}`, type: "Profit", status: "Verified", amount: completedMachine.totalReturn, date: "Today" };
    const newTransactions = [newTxn, ...transactions];
    setTransactions(newTransactions);
    saveUserData(undefined, newBalance, updatedMachines, newTransactions);

    alert(`🎉 UGX ${completedMachine.totalReturn.toLocaleString()} claimed to Balance Account!`);
    setShowCompletionModal(false);
    setCompletedMachine(null);
  };

  function getMachineCountdown(machine) {
    const endTime = new Date(machine.purchasedAt).getTime() + (machine.days * 24 * 60 * 60 * 1000);
    const remaining = endTime - Date.now();
    if (remaining <= 0) return { completed: true, display: "✅ Completed!", progress: 100 };
    const totalSecs = Math.floor(remaining / 1000);
    const days = Math.floor(totalSecs / (24 * 60 * 60));
    const hours = Math.floor((totalSecs % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((totalSecs % (60 * 60)) / 60);
    const secs = totalSecs % 60;
    return {
      completed: false,
      display: `${days}d ${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`,
      progress: ((machine.days * 24 * 60 * 60 * 1000 - remaining) / (machine.days * 24 * 60 * 60 * 1000)) * 100
    };
  }

  const copyToClipboard = () => { navigator.clipboard.writeText(referralLink); alert("📋 Link copied!"); };
  const shareOnWhatsApp = () => { window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank'); };

  const handleClaimReward = async (targetCount) => {
    const rewardAmounts = { 2: 3000, 5: 10000, 10: 20000, 20: 45000, 25: 60000, 40: 90000, 50: 130000 };
    const amount = rewardAmounts[targetCount] || 0;
    const newWallet = walletBalance + amount;
    const newClaimed = [...claimedList, targetCount];
    setWalletBalance(newWallet);
    setClaimedList(newClaimed);
    saveUserData(newWallet, undefined, undefined, undefined, newClaimed);
    alert(`✅ Reward claimed! UGX ${amount.toLocaleString()} added to Wallet!`);
  };

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };

  if (currentView === 'coin_spin') {
    return (
      <div style={{ backgroundColor: '#000000', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <style>{`@keyframes spinGoldCoin { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }`}</style>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#00FF66', border: '5px solid #00AA44', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 20px #00FF66', fontSize: '32px', fontWeight: 'bold', color: '#000', animation: 'spinGoldCoin 1.2s infinite linear' }}>$</div>
        <h3 style={{ color: '#00FF66', marginTop: '20px', fontFamily: 'sans-serif', letterSpacing: '1px', fontSize: '14px' }}>PROCESSING...</h3>
      </div>
    );
  }

  if (currentView === 'deposit_guide') {
    return (
      <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#ffffff', fontFamily: 'sans-serif', padding: '20px', boxSizing: 'border-box' }}>
        <button onClick={() => setCurrentView('dashboard')} style={{ backgroundColor: '#111', border: '1px solid #333', color: '#00FF66', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}>← Back</button>
        <h2 style={{ color: '#00FF66', marginTop: 0 }}>DEPOSIT FUNDS</h2>
        <div style={{ backgroundColor: '#111', padding: '16px', borderRadius: '10px', border: '2px solid #00FF66', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', color: '#00FF66', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>SEND MONEY TO</span>
          <div style={{ fontSize: '14px' }}>
            <span style={{ color: '#888' }}>Account:</span> <strong style={{ color: '#fff' }}>0760704907</strong><br />
            <span style={{ color: '#888' }}>Name:</span> <strong style={{ color: '#fff' }}>NAKATTE HADIJAH</strong>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <button onClick={() => setDepositNetwork('MTN')} style={{ padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: depositNetwork === 'MTN' ? '#FFCC00' : '#222', color: depositNetwork === 'MTN' ? '#000' : '#888' }}>MTN</button>
          <button onClick={() => setDepositNetwork('Airtel')} style={{ padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: depositNetwork === 'Airtel' ? '#FF0000' : '#222', color: depositNetwork === 'Airtel' ? '#fff' : '#888' }}>Airtel</button>
        </div>
        <form onSubmit={handlePaymentIdSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>💰 AMOUNT SENT (UGX)</label>
            <input type="number" placeholder="e.g. 50000" required min="1" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '14px', backgroundColor: '#111', color: '#fff', border: '1px solid #00FF66', borderRadius: '6px', fontSize: '14px' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>🔑 PAYMENT ID</label>
            <input type="text" placeholder="Transaction ID from mobile money" required value={paymentId} onChange={(e) => setPaymentId(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '14px', backgroundColor: '#111', color: '#fff', border: '1px solid #222', borderRadius: '6px', fontSize: '14px' }} />
          </div>
          <div style={{ backgroundColor: '#0a1f12', border: '1px solid #FFD700', borderRadius: '6px', padding: '12px', fontSize: '12px', color: '#aaa', textAlign: 'center' }}>
            ⏳ Your deposit will be sent to admin for verification. You'll be notified once approved.
          </div>
          <button type="submit" style={{ backgroundColor: '#00FF66', color: '#000', border: 'none', padding: '14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>Submit for Verification</button>
        </form>
      </div>
    );
  }

  if (currentView === 'withdraw_portal') {
    return (
      <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#ffffff', fontFamily: 'sans-serif', padding: '20px' }}>
        <button onClick={() => { setCurrentView('dashboard'); setWithdrawAmount(''); }} style={{ backgroundColor: '#111', border: '1px solid #333', color: '#ff4444', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}>← Back</button>
        <h2 style={{ color: '#ff4444', marginTop: 0 }}>WITHDRAW FROM BALANCE</h2>
        <div style={{ backgroundColor: '#0a0a0a', border: '2px solid #00BCFF', padding: '15px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', color: '#aaa' }}>
          ⚖️ Balance Account: <strong style={{ color: '#00BCFF' }}>UGX {balanceAccount.toLocaleString()}</strong><br />
          <span style={{ fontSize: '11px' }}>10% fee applies. Money goes to your mobile money.</span>
        </div>
        <form onSubmit={handleWithdrawSubmit} style={{ backgroundColor: '#0a0a0a', border: '2px solid #ff4444', padding: '20px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>AMOUNT (UGX)</label>
            <input type="number" placeholder="e.g. 20000" required value={withdrawAmount} onChange={handleWithdrawAmountChange} style={{ width: '100%', boxSizing: 'border-box', padding: '14px', backgroundColor: '#111', color: '#fff', border: '1px solid #222', borderRadius: '6px', fontSize: '14px' }} />
          </div>
          <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '6px', border: '1px solid #222' }}>
            <span style={{ fontSize: '12px', color: '#ff4444', fontWeight: 'bold' }}>YOU RECEIVE (after 10% fee):</span>
            <div style={{ fontSize: '24px', color: '#00FF66', fontWeight: 'bold', marginTop: '6px' }}>UGX {receiveAmount.toLocaleString()}</div>
          </div>
          <button type="submit" style={{ backgroundColor: '#ff4444', color: '#fff', border: 'none', padding: '14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>Withdraw</button>
        </form>
      </div>
    );
  }

  if (showCompletionModal && completedMachine) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5000, padding: '20px' }}>
        <div style={{ backgroundColor: '#0a0a0a', border: '2px solid #FFD700', borderRadius: '12px', width: '100%', maxWidth: '380px', padding: '30px', boxSizing: 'border-box', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎉</div>
          <h2 style={{ color: '#FFD700', margin: '0 0 10px 0' }}>MACHINE COMPLETED!</h2>
          <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '15px' }}><strong>{completedMachine.name}</strong> finished!</p>
          <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>GOES TO BALANCE ACCOUNT</div>
            <div style={{ color: '#00FF66', fontSize: '28px', fontWeight: 'bold' }}>UGX {completedMachine.totalReturn.toLocaleString()}</div>
            <div style={{ color: '#666', fontSize: '11px', marginTop: '5px' }}>
              Cost: UGX {completedMachine.price.toLocaleString()} + Profit: UGX {completedMachine.profit.toLocaleString()}
            </div>
          </div>
          <button onClick={claimCompletedMachine} style={{ backgroundColor: '#FFD700', color: '#000', border: 'none', padding: '14px 30px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', width: '100%' }}>
            🚀 CLAIM UGX {completedMachine.totalReturn.toLocaleString()}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: isDarkMode ? '#000000' : '#f8f9fa', minHeight: '100vh', color: isDarkMode ? '#ffffff' : '#212529', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff', borderBottom: isDarkMode ? '1px solid #111' : '1px solid #dee2e6', position: 'sticky', top: 0, zIndex: 4000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'none', border: 'none', color: isDarkMode ? '#00FF66' : '#107C41', fontSize: '24px', cursor: 'pointer', fontWeight: 'bold' }}>☰</button>
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: isDarkMode ? '#fff' : '#212529' }}>Connect</span>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>{isDarkMode ? '☀️' : '🌙'}</button>
        </div>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: isDarkMode ? '#00FF66' : '#107C41' }}>Hi, {user?.username || 'user'}</span>
      </div>

      {isMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 6000, display: 'flex' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onClick={() => setIsMenuOpen(false)} />
          <div style={{ position: 'relative', width: '280px', height: '100%', backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff', borderRight: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', padding: '25px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <button onClick={() => setIsMenuOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#888', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
            <h3 style={{ margin: '15px 0 5px 0', color: isDarkMode ? '#00FF66' : '#107C41', borderBottom: '1px solid #222', paddingBottom: '10px', fontSize: '18px' }}>Menu</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '14px', fontWeight: '500' }}>
              <li><a href="#profile" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: isDarkMode ? '#eee' : '#333' }}>👤 My Profile</a></li>
              <li><a href="#terms" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: isDarkMode ? '#eee' : '#333' }}>📄 Terms & Conditions</a></li>
              <li><a href="#privacy" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: isDarkMode ? '#eee' : '#333' }}>🛡️ Privacy Policy</a></li>
              <li><a href="#support" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: isDarkMode ? '#eee' : '#333' }}>ℹ️ Help & Support</a></li>
              <li style={{ borderTop: '1px solid #222', paddingTop: '15px', color: '#ff4444', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { setIsMenuOpen(false); handleLogout(); }}>🚪 Log Out</li>
            </ul>
          </div>
        </div>
      )}

      {showConfirmModal && selectedProductToBuy && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5000, padding: '20px' }}>
          <div style={{ backgroundColor: '#0a0a0a', border: '2px solid #00FF66', borderRadius: '12px', width: '100%', maxWidth: '360px', padding: '25px', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00FF66', fontSize: '18px' }}>CONFIRM PURCHASE</h3>
            <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '20px' }}>
              Lease <strong>{selectedProductToBuy.name}</strong> for <strong>UGX {selectedProductToBuy.price.toLocaleString()}</strong> from Wallet?
            </p>
            <div style={{ backgroundColor: '#111', padding: '12px', borderRadius: '6px', marginBottom: '15px', borderLeft: '4px solid', borderLeftColor: selectedProductToBuy.classTier === 'B' ? '#00BCFF' : selectedProductToBuy.classTier === 'C' ? '#FFD700' : '#00FF66', fontSize: '12px', color: '#aaa' }}>
              Class {selectedProductToBuy.classTier} · {selectedProductToBuy.days} days<br />
              {selectedProductToBuy.classTier === 'B' && <>200% Profit → <strong style={{ color: '#00BCFF' }}>UGX {calculateTotalReturn(selectedProductToBuy.price, 'B').toLocaleString()}</strong></>}
              {selectedProductToBuy.classTier === 'C' && <>300% Profit → <strong style={{ color: '#FFD700' }}>UGX {calculateTotalReturn(selectedProductToBuy.price, 'C').toLocaleString()}</strong></>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={() => { setShowConfirmModal(false); setSelectedProductToBuy(null); }} style={{ backgroundColor: '#222', color: '#888', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              <button onClick={executeConfirmedPurchase} style={{ backgroundColor: '#00FF66', color: '#000', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '90px' }}>

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ background: isDarkMode ? 'linear-gradient(135deg, #111, #051a0e)' : 'linear-gradient(135deg, #fff, #e8f5e9)', padding: '25px', borderRadius: '12px', border: isDarkMode ? '2px solid #00FF66' : '2px solid #107C41' }}>
              <p style={{ margin: 0, color: '#aaa', fontSize: '14px', fontWeight: 'bold' }}>TOTAL PORTFOLIO</p>
              <h1 style={{ margin: '12px 0 0 0', color: isDarkMode ? '#fff' : '#212529', fontSize: '38px', fontWeight: 'bold' }}>UGX {(walletBalance + balanceAccount).toLocaleString()}</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ padding: '18px', backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #00FF66' : '1px solid #107C41', borderRadius: '10px' }}>
                <p style={{ margin: 0, color: '#888', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>💼 Wallet</p>
                <h2 style={{ margin: '8px 0 0 0', color: isDarkMode ? '#fff' : '#212529', fontSize: '22px' }}>UGX {walletBalance.toLocaleString()}</h2>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '10px' }}>Approved deposits • Rewards</p>
              </div>
              <div style={{ padding: '18px', backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #00BCFF' : '1px solid #00BCFF', borderRadius: '10px' }}>
                <p style={{ margin: 0, color: '#888', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>⚖️ Balance</p>
                <h2 style={{ margin: '8px 0 0 0', color: '#00BCFF', fontSize: '22px' }}>UGX {balanceAccount.toLocaleString()}</h2>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '10px' }}>Machine profits • Buy & Withdraw</p>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#aaa', margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold' }}>ACTIONS</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <button onClick={triggerDepositFlow} style={{ backgroundColor: isDarkMode ? '#111' : '#fff', border: isDarkMode ? '2px solid #00FF66' : '2px solid #107C41', color: isDarkMode ? '#00FF66' : '#107C41', padding: '18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>💸 Deposit</button>
                <button onClick={triggerWithdrawFlow} style={{ backgroundColor: isDarkMode ? '#111' : '#fff', border: '2px solid #ff4444', color: '#ff4444', padding: '18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>📥 Withdraw</button>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#aaa', margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold' }}>RECENT TRANSACTIONS</h4>
              {transactions.length === 0 ? (
                <p style={{ color: '#666', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No transactions yet</p>
              ) : (
                transactions.slice(0, 10).map((txn, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #111' : '1px solid #dee2e6', borderRadius: '6px', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', color: isDarkMode ? '#fff' : '#212529' }}>
                        {txn.type === 'Deposit' ? (txn.status === 'Pending' ? '⏳ Deposit Pending' : '💸 Deposit') : txn.type === 'Withdraw' ? '📥 Withdraw' : txn.type === 'Profit' ? '📈 Profit' : '🛒 Purchase'}
                      </span>
                      <span style={{ fontSize: '10px', color: '#666' }}>{txn.id}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', color: txn.type === 'Profit' ? '#00FF66' : txn.type === 'Deposit' && txn.status === 'Approved' ? '#00FF66' : txn.type === 'Deposit' && txn.status === 'Pending' ? '#FFD700' : '#ff4444' }}>
                        {txn.type === 'Profit' || (txn.type === 'Deposit' && txn.status === 'Approved') ? '+' : txn.type === 'Deposit' && txn.status === 'Pending' ? '⏳' : '-'} UGX {txn.amount.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '10px', color: '#666' }}>{txn.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* BUY TAB */}
        {activeTab === 'buy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ color: isDarkMode ? '#00FF66' : '#107C41', margin: '0' }}>LEASE MACHINES</h3>
            <div style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #00BCFF', fontSize: '13px', color: '#aaa' }}>
              ⚖️ Balance Account: <strong style={{ color: '#00BCFF' }}>UGX {balanceAccount.toLocaleString()}</strong><br />
              💼 Wallet: <strong style={{ color: '#00FF66' }}>UGX {walletBalance.toLocaleString()}</strong> (used for leasing machines)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <button onClick={() => setSelectedClass('A')} style={{ padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: selectedClass === 'A' ? (isDarkMode ? '#00FF66' : '#107C41') : (isDarkMode ? '#111' : '#e9ecef'), color: selectedClass === 'A' ? (isDarkMode ? '#000' : '#fff') : '#888' }}>CLASS A</button>
              <button onClick={() => setSelectedClass('B')} style={{ padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: selectedClass === 'B' ? '#00BCFF' : (isDarkMode ? '#111' : '#e9ecef'), color: selectedClass === 'B' ? '#000' : '#888' }}>CLASS B (200%)</button>
              <button onClick={() => setSelectedClass('C')} style={{ padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: selectedClass === 'C' ? '#FFD700' : (isDarkMode ? '#111' : '#e9ecef'), color: selectedClass === 'C' ? '#000' : '#888' }}>CLASS C (300%)</button>
            </div>
            {powerbankCatalog[selectedClass].map((product) => {
              const totalReturn = calculateTotalReturn(product.price, selectedClass);
              const profit = calculateProfit(product.price, selectedClass);
              const hasActive = activeMachines.some(m => {
                const endTime = new Date(m.purchasedAt).getTime() + (m.days * 24 * 60 * 60 * 1000);
                return m.productId === product.id && Date.now() < endTime && !m.claimed;
              });
              const canBuy = !hasActive && walletBalance >= product.price;
              return (
                <div key={product.id} style={{ display: 'flex', backgroundColor: isDarkMode ? '#111' : '#fff', borderRadius: '10px', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', overflow: 'hidden', height: '135px' }}>
                  <div style={{ width: '25%', backgroundColor: isDarkMode ? '#1a1a1a' : '#f1f3f5', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px' }}>
                    <PowerbankGraphic accentColor={product.imgColor} />
                  </div>
                  <div style={{ width: '75%', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 'bold', color: isDarkMode ? '#fff' : '#212529', fontSize: '14px' }}>{product.name}</span>
                        <span style={{ color: isDarkMode ? '#00FF66' : '#107C41', fontWeight: 'bold', fontSize: '13px' }}>UGX {product.price.toLocaleString()}</span>
                      </div>
                      <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '11px' }}>{product.desc}</p>
                      {selectedClass !== 'A' && (
                        <div style={{ marginTop: '3px', fontSize: '11px', fontWeight: 'bold', color: selectedClass === 'B' ? '#00BCFF' : '#FFD700' }}>
                          Return: UGX {totalReturn.toLocaleString()} (+UGX {profit.toLocaleString()})
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => initiaitePurchaseSequence(product)}
                      disabled={!canBuy}
                      style={{
                        alignSelf: 'flex-end',
                        backgroundColor: !canBuy ? '#333' : (isDarkMode ? '#00FF66' : '#107C41'),
                        color: !canBuy ? '#666' : (isDarkMode ? '#000' : '#fff'),
                        border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: canBuy ? 'pointer' : 'not-allowed'
                      }}>
                      {hasActive ? '🔒 Locked' : !canBuy ? 'Need Wallet' : 'Lease'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', paddingBottom: '10px' }}>
              <h3 style={{ color: isDarkMode ? '#00FF66' : '#107C41', margin: 0 }}>ACTIVE MACHINES</h3>
              <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '12px' }}>Live countdown · Profits go to Balance Account</p>
            </div>
            {activeMachines.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', borderRadius: '8px', border: isDarkMode ? '1px dashed #222' : '1px dashed #ccc' }}>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>No machines yet.</p>
                <p style={{ margin: '8px 0 0 0', color: '#888', fontSize: '12px' }}>Go to Lease tab to buy one.</p>
              </div>
            ) : (
              activeMachines.map((mach, idx) => {
                const countdown = getMachineCountdown(mach);
                const profit = mach.profit || calculateProfit(mach.price, mach.classTier);
                const totalReturn = mach.totalReturn || calculateTotalReturn(mach.price, mach.classTier);
                const classColor = mach.classTier === 'B' ? '#00BCFF' : mach.classTier === 'C' ? '#FFD700' : '#00FF66';
                return (
                  <div key={idx} style={{
                    padding: '16px',
                    backgroundColor: isDarkMode ? '#0a0a0a' : '#fff',
                    border: countdown.completed && !mach.claimed ? '2px solid #FFD700' : mach.claimed ? '1px solid #333' : isDarkMode ? '1px solid #111' : '1px solid #dee2e6',
                    borderRadius: '10px', opacity: mach.claimed ? 0.6 : 1
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <span style={{ fontWeight: 'bold', fontSize: '14px', color: isDarkMode ? '#fff' : '#212529' }}>{mach.name}</span>
                        <span style={{ marginLeft: '8px', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '3px', backgroundColor: classColor + '22', color: classColor }}>CLASS {mach.classTier}</span>
                      </div>
                      <span style={{ color: countdown.completed ? (mach.claimed ? '#666' : '#FFD700') : '#00FF66', fontSize: '12px', fontWeight: 'bold' }}>
                        {mach.claimed ? '✅ Claimed' : countdown.completed ? '🎉 Complete!' : '🟢 Active'}
                      </span>
                    </div>
                    {!mach.claimed && (
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#222', borderRadius: '3px', marginBottom: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(countdown.progress || 0, 100)}%`, height: '100%', backgroundColor: countdown.completed ? '#FFD700' : classColor, borderRadius: '3px', transition: 'width 1s linear' }} />
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '12px' }}>
                      <div><span style={{ color: '#666' }}>Cost</span><div style={{ color: isDarkMode ? '#fff' : '#212529', fontWeight: 'bold' }}>UGX {mach.price.toLocaleString()}</div></div>
                      <div><span style={{ color: '#666' }}>Profit</span><div style={{ color: classColor, fontWeight: 'bold' }}>+UGX {profit.toLocaleString()}</div></div>
                      <div><span style={{ color: '#666' }}>→ Balance</span><div style={{ color: '#00BCFF', fontWeight: 'bold' }}>UGX {totalReturn.toLocaleString()}</div></div>
                    </div>
                    {!mach.claimed && (
                      <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: isDarkMode ? '#111' : '#f1f3f5', borderRadius: '6px', textAlign: 'center', fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold', color: countdown.completed ? '#FFD700' : classColor }}>
                        {countdown.display}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* REWARDS TAB */}
        {activeTab === 'rewards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', paddingBottom: '10px' }}>
              <h3 style={{ color: isDarkMode ? '#00FF66' : '#107C41', margin: 0 }}>REFERRAL REWARDS</h3>
              <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '12px' }}>Invite friends — rewards go to Wallet</p>
            </div>
            <div style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#fff', border: isDarkMode ? '1px solid #111' : '1px solid #dee2e6', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>YOUR REFERRALS</span>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: isDarkMode ? '#fff' : '#212529', marginTop: '5px' }}>{referrals}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input type="text" readOnly value={referralLink} style={{ padding: '12px', backgroundColor: isDarkMode ? '#111' : '#f1f3f5', color: isDarkMode ? '#aaa' : '#333', border: '1px solid #222', borderRadius: '6px', fontSize: '12px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button onClick={copyToClipboard} style={{ backgroundColor: isDarkMode ? '#111' : '#e9ecef', color: isDarkMode ? '#00FF66' : '#107C41', border: '1px solid #222', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>📋 Copy</button>
                  <button onClick={shareOnWhatsApp} style={{ backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>💬 WhatsApp</button>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ color: '#aaa', margin: '5px 0', fontSize: '13px', fontWeight: 'bold' }}>MILESTONES</h4>
              {rewardsRoadmap.map((roadmap) => {
                const isClaimed = claimedList.includes(roadmap.target);
                const canClaim = referrals >= roadmap.target && !isClaimed;
                return (
                  <div key={roadmap.target} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: isDarkMode ? '#111' : '#fff', border: isDarkMode ? '1px solid #222' : '1px solid #dee2e6', borderRadius: '8px' }}>
                    <div style={{ width: '70%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', backgroundColor: roadmap.type === 'Cash' ? '#2563eb' : '#db2777', color: '#fff' }}>{roadmap.type}</span>
                        <strong style={{ color: isDarkMode ? '#fff' : '#212529', fontSize: '14px' }}>{roadmap.reward}</strong>
                      </div>
                      <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '11px' }}>{roadmap.desc}</p>
                      <span style={{ fontSize: '11px', color: referrals >= roadmap.target ? '#00FF66' : '#ff4444', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>{referrals}/{roadmap.target} invites</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button disabled={!canClaim} onClick={() => handleClaimReward(roadmap.target)} style={{ padding: '8px 12px', borderRadius: '4px', border: 'none', fontSize: '11px', fontWeight: 'bold', cursor: canClaim ? 'pointer' : 'not-allowed', backgroundColor: isClaimed ? '#222' : canClaim ? '#00FF66' : '#333', color: isClaimed ? '#555' : canClaim ? '#000' : '#888' }}>
                        {isClaimed ? '✓ Done' : canClaim ? 'Claim' : 'Locked'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '70px', backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff', borderTop: isDarkMode ? '1px solid #111' : '1px solid #dee2e6', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', alignItems: 'center', justifyItems: 'center', zIndex: 4000 }}>
        <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: activeTab === 'home' ? (isDarkMode ? '#00FF66' : '#107C41') : '#666' }}>
          <span style={{ fontSize: '20px' }}>🏠</span>
          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Home</span>
        </button>
        <button onClick={() => setActiveTab('buy')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: activeTab === 'buy' ? (isDarkMode ? '#00FF66' : '#107C41') : '#666' }}>
          <span style={{ fontSize: '20px' }}>🛒</span>
          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Lease</span>
        </button>
        <button onClick={() => setActiveTab('activity')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: activeTab === 'activity' ? (isDarkMode ? '#00FF66' : '#107C41') : '#666' }}>
          <span style={{ fontSize: '20px' }}>⚡</span>
          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Activity</span>
        </button>
        <button onClick={() => setActiveTab('rewards')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: activeTab === 'rewards' ? (isDarkMode ? '#00FF66' : '#107C41') : '#666' }}>
          <span style={{ fontSize: '20px' }}>🎁</span>
          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Rewards</span>
        </button>
      </div>

    </div>
  );
}

export default Home;