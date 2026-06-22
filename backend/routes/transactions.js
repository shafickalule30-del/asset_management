const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User'); // Used to credit balance later

// 1. User app endpoint to submit a deposit request
router.post('/deposit', async (req, res) => {
  try {
    const { userId, username, amount } = req.body;
    
    const newTransaction = new Transaction({
      userId,
      username,
      amount: Number(amount),
      status: 'Pending'
    });

    await newTransaction.save();
    res.status(201).json({ message: 'Request logged successfully', transaction: newTransaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Admin app endpoint to view all pending entries
router.get('/pending', async (req, res) => {
  try {
    const pendingRequests = await Transaction.find({ status: 'Pending' }).sort({ createdAt: -1 });
    res.json(pendingRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Admin app endpoint to approve and credit balance
router.put('/approve/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.status !== 'Pending') {
      return res.status(400).json({ message: 'Transaction not found or already processed' });
    }

    // Mathematically increments the balance property on the matching User document
    await User.findByIdAndUpdate(transaction.userId, {
      $inc: { balance: transaction.amount }
    });

    transaction.status = 'Approved';
    await transaction.save();

    res.json({ message: 'Transaction approved and account credited successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;