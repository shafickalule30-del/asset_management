const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const MONGO_URI = "mongodb+srv://shafickalule30_db_user:shafic256@connect.x9dssxx.mongodb.net/test?retryWrites=true&w=majority&appName=connect";

mongoose.connect(MONGO_URI)
  .then(() => console.log("💪 MongoDB Connected Successfully!"))
  .catch((err) => console.log("❌ Database connection error:", err));

// ==========================================
// 📝 DATA SCHEMAS (Updated with Active Fleet Tracking)
// ==========================================
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0.0 },
  referrals: { type: Number, default: 0 },
  claimedMilestones: { type: [Number], default: [] },
  // ⚡ Active fleet data storage node
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

// Helper function to calculate a future date by adding ONLY business days
function addBusinessDays(startDate, daysToAdd) {
  let currentDate = new Date(startDate);
  let addedDays = 0;
  while (addedDays < daysToAdd) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday (0) and Saturday (6)
      addedDays++;
    }
  }
  return currentDate;
}

// Helper function to recalculate remaining week days between now and the end date
function getRemainingBusinessDays(endDate) {
  let today = new Date();
  let targetEnd = new Date(endDate);
  if (today >= targetEnd) return 0;

  let count = 0;
  let current = new Date(today);
  // Normalize hours to ensure accurate calendar days evaluation
  current.setHours(0,0,0,0);
  targetEnd.setHours(0,0,0,0);

  while (current < targetEnd) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return count;
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

// 2. LOGIN ROUTE (Synchronizes active fleet machines right away)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Dynamic clean up: update remaining week days before returning state logs
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
        balance: user.balance, 
        referrals: user.referrals, 
        claimedMilestones: user.claimedMilestones,
        activeMachines: user.activeMachines
      } 
    });
  } catch (error) { res.status(500).json({ message: "Server error during authentication" }); }
});

// 3. DEPOSIT ROUTE
app.post('/api/account/deposit', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { balance: Number(amount) } }, { new: true });
    res.status(200).json({ balance: updatedUser.balance });
  } catch (error) { res.status(500).json({ message: "Deposit processing error" }); }
});

// 4. WITHDRAW ROUTE
app.post('/api/account/withdraw', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const amt = Number(amount);
    const currentUser = await User.findById(userId);
    if (currentUser.balance < amt) return res.status(400).json({ message: "Insufficient funds" });
    const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { balance: -amt } }, { new: true });
    res.status(200).json({ balance: updatedUser.balance });
  } catch (error) { res.status(500).json({ message: "Withdrawal processing error" }); }
});

// 5. RE-ENGINEERED PRODUCT PROCUREMENT (Processes deductions & generates fleet cards)
app.post('/api/account/buy', async (req, res) => {
  try {
    const { userId, productName, price, classTier, targetDays } = req.body;
    const cost = Number(price);
    const daysCount = Number(targetDays);

    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "User profile missing" });
    if (currentUser.balance < cost) return res.status(400).json({ message: "Insufficient balance" });

    // Instantiates a unique active configuration block for the user's fleet deployment portfolio
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
        $inc: { balance: -cost },
        $push: { activeMachines: machineDeploymentUnit }
      }, 
      { new: true }
    );

    res.status(200).json({ 
      message: `Deployment Successful! ${productName} joined your active terminal fleet grid.`,
      balance: updatedUser.balance,
      activeMachines: updatedUser.activeMachines
    });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: "Purchase processing error encountered." }); 
  }
});

// 6. MILESTONE REWARD CLAIM ROUTE
app.post('/api/account/claim-reward', async (req, res) => {
  try {
    const { userId, milestone } = req.body;
    const target = Number(milestone);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User profile missing" });
    if (user.referrals < target) return res.status(400).json({ message: "Milestone requirements not yet achieved." });
    if (user.claimedMilestones.includes(target)) return res.status(400).json({ message: "This milestone bonus has already been safely claimed!" });

    const milestoneRewards = {
      2:  { bonus: 3000,   msg: "🎉 Milestone 1 Claimed: UGX 3,000 added!" },
      5:  { bonus: 10000,  msg: "🎉 Milestone 2 Claimed: UGX 10,000 added!" },
      10: { bonus: 20000,  msg: "🎉 Milestone 3 Claimed: UGX 20,000 added!" },
      15: { bonus: 0,      msg: "🎁 Milestone 4 Claimed: You won an Alpha Slim 10K Powerbank! Delivery ticket opened." },
      20: { bonus: 45000,  msg: "🎉 Milestone 5 Claimed: UGX 45,000 added!" },
      25: { bonus: 60000,  msg: "🎉 Milestone 6 Claimed: UGX 60,000 added!" },
      30: { bonus: 0,      msg: "🎁 Milestone 7 Claimed: You won a Delta Prime 20K Powerbank! Delivery ticket opened." },
      40: { bonus: 90000,  msg: "🎉 Milestone 8 Claimed: UGX 90,000 added!" },
      50: { bonus: 130000, msg: "🎉 Milestone 9 Claimed: UGX 130,000 added!" },
      60: { bonus: 0,      msg: "👑 Grand Master Claimed: You won a Quantum Base 40K Powerbank! Ticket opened." }
    };

    const targetReward = milestoneRewards[target];
    if (!targetReward) return res.status(400).json({ message: "Invalid reward selection query." });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { balance: targetReward.bonus }, $push: { claimedMilestones: target } },
      { new: true }
    );

    res.status(200).json({ message: targetReward.msg, balance: updatedUser.balance, claimedMilestones: updatedUser.claimedMilestones });
  } catch (error) { res.status(500).json({ message: "Error processing affiliate distribution claim." }); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 API Fleet Engine active on port ${PORT}`));