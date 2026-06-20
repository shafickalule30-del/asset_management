const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  telephone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  referrals: { type: Number, default: 0 },
  activeMachines: { type: Array, default: [] },
  claimedMilestones: { type: Array, default: [] },
  
  // The Account Ledger System Tracks Logs Separately
  transactions: [{
    txnId: String,
    type: { type: String, enum: ['Deposit', 'Withdraw', 'Purchase'] },
    amount: Number,
    receiveAmount: Number, // Post-deductions value
    status: { type: String, enum: ['Pending Approval', 'Verified', 'Success', 'Declined'], default: 'Pending Approval' },
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('User', UserSchema);