const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: true, // Allows your live frontend environment to connect securely
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://shafickalule30_db_user:shafic256@connect.x9dssxx.mongodb.net/test?retryWrites=true&w=majority&appName=connect";

mongoose.connect(MONGO_URI)
  .then(() => console.log("💪 MongoDB Connected Successfully!"))
  .catch((err) => console.log("❌ Database connection error:", err));

// ==========================================
// 📝 DATA SCHEMAS (Updated with Transactions)
// ==========================================
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletBalance: { type: Number, default: 0.0 },      // For leasing machines
  accountBalance: { type: Number, default: 0.0 },
  referrals: { type: Number, default: 0 },
  claimedMilestones: { type: [Number], default: [] },
  activeMachines: [{
    machineId: String,
    name: String,
    classTier: String,
    purchaseDate: { type: Date, default: Date.now },
    totalTargetDays: Number,
    daysRemaining: Number
  }]
});

const User = mongoose.model('User', userSchema);

// 💰 NEW: Secure ledger collection schema for tracking deposit validation states
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  transactionId: { type: String, default: null },
  merchantAccountNumber: { type: String, default: null },
  merchantAccountName: { type: String, default: null },
  merchantAccountTimestamp: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// ==========================================
// ⚙️ HELPER LOGIC FUNCTIONS
// ==========================================
function addBusinessDays(startDate, daysToAdd) {
  let currentDate = new Date(startDate);
  let addedDays = 0;
  while (addedDays < daysToAdd) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }
  return currentDate;
}

function getRemainingBusinessDays(endDate) {
  let today = new Date();
  let targetEnd = new Date(endDate);
  if (today >= targetEnd) return 0;

  let count = 0;
  let current = new Date(today);
  current.setHours(0, 0, 0, 0);
  targetEnd.setHours(0, 0, 0, 0);

  while (current < targetEnd) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return count;
}

const depositAccounts = [
  { number: '0760704907', name: 'Hadijah Nakatte' },
  { number: '0730618292', name: 'Paul Jero' },
  { number: '0750682508', name: 'Kakembo David' }
];

function getActiveDepositAccount(timestamp = new Date()) {
  const currentDate = timestamp instanceof Date ? new Date(timestamp) : new Date(timestamp);
  const totalMinutes = currentDate.getMinutes();
  const index = Math.floor(totalMinutes / 5) % depositAccounts.length;
  return depositAccounts[index];
}

// ==========================================
// 🚀 API PIPELINES
// ==========================================

// 1. SIGN UP ROUTE
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, referrerId } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email is already registered!" });

    const newUser = new User({ username, email, password, activeMachines: [] });
    await newUser.save();

    if (referrerId && mongoose.Types.ObjectId.isValid(referrerId)) {
      await User.findByIdAndUpdate(referrerId, { $inc: { referrals: 1 } });
    }
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) { res.status(500).json({ message: "Server error saving user profile" }); }
});

// 2. LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    let dynamicUpdates = false;
    user.activeMachines.forEach(machine => {
      const expirationDate = addBusinessDays(machine.purchaseDate, machine.totalTargetDays);
      const freshCount = getRemainingBusinessDays(expirationDate);
      if (machine.daysRemaining !== freshCount) {
        machine.daysRemaining = freshCount;
        dynamicUpdates = true;
      }
    });

    if (dynamicUpdates) {
      await user.save();
    }

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletBalance: user.walletBalance ?? 0,
        accountBalance: user.accountBalance ?? 0,
        referrals: user.referrals,
        claimedMilestones: user.claimedMilestones,
        activeMachines: user.activeMachines
      }
    });
  } catch (error) { res.status(500).json({ message: "Server error during authentication" }); }
});

// 3. UPDATED DEPOSIT ROUTE: Creates a pending request instead of crediting money instantly
app.post('/api/account/deposit', async (req, res) => {
  try {
    const { userId, amount, transactionId } = req.body;

    const userProfile = await User.findById(userId);
    if (!userProfile) return res.status(404).json({ message: "User account profile not found" });

    const activeAccount = getActiveDepositAccount(new Date());

    // Creates an immutable log unit waiting inside the processing queue
    const depositRequest = new Transaction({
      userId: userProfile._id,
      username: userProfile.username,
      amount: Number(amount),
      status: 'Pending',
      transactionId: transactionId || null,
      merchantAccountNumber: activeAccount.number,
      merchantAccountName: activeAccount.name,
      merchantAccountTimestamp: new Date()
    });

    await depositRequest.save();

    console.log(`[Deposit Verification] ${userProfile.username} submitted transaction ID ${transactionId || 'N/A'} at ${new Date().toISOString()} | Active merchant: ${activeAccount.name} (${activeAccount.number})`);

    res.status(201).json({
      message: "Deposit request queued. Awaiting administrative confirmation token validation.",
      activeAccount
    });
  } catch (error) { res.status(500).json({ message: "Deposit request registration fault encountered." }); }
});

// 4. ADMIN PIPELINE: Pulls all unverified system transactions across web environments
app.get('/api/transactions/pending', async (req, res) => {
  try {
    const pendingReceipts = await Transaction.find({ status: 'Pending' }).sort({ createdAt: -1 });
    res.status(200).json(pendingReceipts);
  } catch (error) { res.status(500).json({ message: "Error fetching administration queues." }); }
});

// 5. ADMIN PIPELINE: Changes transaction status and increments balance property safely
app.put('/api/transactions/approve/:id', async (req, res) => {
  try {
    const targetReceipt = await Transaction.findById(req.params.id);
    if (!targetReceipt || targetReceipt.status !== 'Pending') {
      return res.status(400).json({ message: "Transaction statement processed or unlisted." });
    }

    // Deposits should credit the wallet balance, not the account balance.
    await User.findByIdAndUpdate(targetReceipt.userId, {
      $inc: { walletBalance: targetReceipt.amount }
    });

    targetReceipt.status = 'Approved';
    await targetReceipt.save();

    res.status(200).json({ message: "System balance modification approved, operator wallet credited." });
  } catch (error) { res.status(500).json({ message: "Execution error during allocation change." }); }
});

// NEW ROUTE: Fetch filtered transaction logs for a user dashboard
app.get('/api/transactions', async (req, res) => {
  try {
    const { userId, status } = req.query;

    // Build a dynamic query filter matching incoming frontend queries
    let queryFilter = {};
    if (userId) queryFilter.userId = userId;

    // Map frontend lowercase string statuses ('approved', 'pending', 'rejected') 
    // to match your Schema's capitalized versions ('Approved', 'Pending', 'Rejected')
    if (status) {
      queryFilter.status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    const logs = await Transaction.find(queryFilter).sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transaction logs." });
  }
});

// 6. WITHDRAW ROUTE
app.post('/api/account/withdraw', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const amt = Number(amount);
    const currentUser = await User.findById(userId);
    if (currentUser.accountBalance < amt) return res.status(400).json({ message: "Insufficient funds" });
    const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { accountBalance: -amt } }, { new: true });
    res.status(200).json({ walletBalance: updatedUser.walletBalance, accountBalance: updatedUser.accountBalance });
  } catch (error) { res.status(500).json({ message: "Withdrawal processing error" }); }
});

// 7. RE-ENGINEERED PRODUCT PROCUREMENT
app.post('/api/account/buy', async (req, res) => {
  try {
    const { userId, productName, price, classTier, targetDays } = req.body;
    const cost = Number(price);
    const daysCount = Number(targetDays);

    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "User profile missing" });
    if (currentUser.walletBalance < cost) return res.status(400).json({ message: "Insufficient balance" });

    const machineDeploymentUnit = {
      machineId: `MCH-${Math.floor(100000 + Math.random() * 900000)}`,
      name: productName,
      classTier: classTier,
      purchaseDate: new Date(),
      totalTargetDays: daysCount,
      daysRemaining: daysCount
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { walletBalance: -cost },
        $push: { activeMachines: machineDeploymentUnit }
      },
      { new: true }
    );

    res.status(200).json({
      message: `Deployment Successful! ${productName} joined your active terminal fleet grid.`,
      walletBalance: updatedUser.walletBalance,
      accountBalance: updatedUser.accountBalance,
      activeMachines: updatedUser.activeMachines
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Purchase processing error encountered." });
  }
});

// 8. MILESTONE REWARD CLAIM ROUTE
app.post('/api/account/claim-reward', async (req, res) => {
  try {
    const { userId, milestone } = req.body;
    const target = Number(milestone);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User profile missing" });
    if (user.referrals < target) return res.status(400).json({ message: "Milestone requirements not yet achieved." });
    if (user.claimedMilestones.includes(target)) return res.status(400).json({ message: "This milestone bonus has already been safely claimed!" });

    const milestoneRewards = {
      2: { bonus: 3000, msg: "🎉 Milestone 1 Claimed: UGX 3,000 added!" },
      5: { bonus: 10000, msg: "🎉 Milestone 2 Claimed: UGX 10,000 added!" },
      10: { bonus: 20000, msg: "🎉 Milestone 3 Claimed: UGX 20,000 added!" },
      15: { bonus: 0, msg: "🎁 Milestone 4 Claimed: You won an Alpha Slim 10K Powerbank! Delivery ticket opened." },
      20: { bonus: 45000, msg: "🎉 Milestone 5 Claimed: UGX 45,000 added!" },
      25: { bonus: 60000, msg: "🎉 Milestone 6 Claimed: UGX 60,000 added!" },
      30: { bonus: 0, msg: "🎁 Milestone 7 Claimed: You won a Delta Prime 20K Powerbank! Delivery ticket opened." },
      40: { bonus: 90000, msg: "🎉 Milestone 8 Claimed: UGX 90,000 added!" },
      50: { bonus: 130000, msg: "🎉 Milestone 9 Claimed: UGX 130,000 added!" },
      60: { bonus: 0, msg: "👑 Grand Master Claimed: You won a Quantum Base 40K Powerbank! Ticket opened." }
    };

    const targetReward = milestoneRewards[target];
    if (!targetReward) return res.status(400).json({ message: "Invalid reward selection query." });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { accountBalance: targetReward.bonus }, $push: { claimedMilestones: target } },
      { new: true }
    );

    res.status(200).json({ message: targetReward.msg, accountBalance: updatedUser.accountBalance, claimedMilestones: updatedUser.claimedMilestones });
  } catch (error) { res.status(500).json({ message: "Error processing affiliate distribution claim." }); }
});

// 9. SMS WEBHOOK ENDPOINT: Automated balance credit from SMS providers
app.post('/api/sms-webhook', async (req, res) => {
  try {
    // Extract sender and message with fallback options for varied payload formats
    const sender = req.body.from || req.body.sender || '';
    const text = req.body.message || req.body.text || '';

    // Verify sender is from an approved telecom provider
    if (!sender.includes('MOMO') && !sender.includes('MTN') && !sender.includes('Airtel')) {
      return res.status(403).json({ success: false, message: "Unauthorized sender" });
    }

    // Extract numeric Amount using regex (flexible patterns)
    const amountMatch = text.match(/(?:Amount|amount|UGX|balance|payment)\D*(\d+)/i);
    if (!amountMatch) {
      return res.status(400).json({ success: false, message: "Amount not found in SMS" });
    }
    const amount = Number(amountMatch[1]);

    // Extract alphanumeric Transaction ID (e.g., PP260627.1245.B00122)
    const transactionIdMatch = text.match(/\b[A-Z]{2}\d{6}\.\d{4,}\.[A-Z0-9]{6,}\b/i);
    if (!transactionIdMatch) {
      return res.status(400).json({ success: false, message: "Transaction ID not found in SMS" });
    }
    const transactionId = transactionIdMatch[0];

    // Query Transactions collection for a 'Pending' document matching the exact extracted Amount
    const transaction = await Transaction.findOne({
      amount: amount,
      status: 'Pending'
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "No matching pending transaction found" });
    }

    // Update transaction: status to 'Approved' and store the extracted Transaction ID
    transaction.status = 'Approved';
    transaction.transactionId = transactionId;
    await transaction.save();

    // Increment the corresponding user's walletBalance
    await User.findByIdAndUpdate(transaction.userId, {
      $inc: { walletBalance: transaction.amount }
    });

    res.status(200).json({ success: true, message: "Balance automatically credited" });
  } catch (error) {
    console.error('SMS Webhook Error:', error);
    res.status(500).json({ success: false, message: "Error processing SMS webhook" });
  }
});

const PORT = 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 API Fleet Engine active on port ${PORT}`));
}

module.exports = {
  app,
  getActiveDepositAccount,
  depositAccounts,
  Transaction,
  User
};