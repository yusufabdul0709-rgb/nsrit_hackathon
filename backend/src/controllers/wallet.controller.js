const { dbStore } = require('../config/db');

let User = null;
let Transaction = null;
let mongoose = null;

try {
  mongoose = require('mongoose');
  User = require('../models/User');
  Transaction = require('../models/Transaction');
} catch (e) {}

const isMongoConnected = () => {
  return mongoose && mongoose.connection && mongoose.connection.readyState === 1;
};

// ─── GET WALLET BALANCE ───
const getBalance = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userPhone = req.user?.phone;

    // 1. Check MongoDB
    if (User && isMongoConnected() && (userId || userPhone)) {
      let dbUser = null;
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        dbUser = await User.findById(userId);
      }
      if (!dbUser && userPhone) {
        dbUser = await User.findOne({ phone: userPhone });
      }

      if (dbUser) {
        return res.status(200).json({
          success: true,
          balance: dbUser.walletBalance || 0,
          walletId: dbUser.walletId || 'WAL-APSRTC-987654'
        });
      }
    }

    // 2. Check in-memory store
    const memUser = dbStore.users.find(u => u.id === userId || u.phone === userPhone || u.walletId === req.user?.walletId) || (dbStore.users.length > 0 ? dbStore.users[dbStore.users.length - 1] : null);
    const balance = memUser && memUser.walletBalance !== undefined ? memUser.walletBalance : 0;
    const walletId = memUser?.walletId || 'WAL-APSRTC-987654';

    return res.status(200).json({ success: true, balance, walletId });
  } catch (error) {
    console.error('Wallet getBalance error:', error);
    return res.status(200).json({ success: true, balance: 0, walletId: 'WAL-APSRTC-987654' });
  }
};

// ─── GET WALLET TRANSACTIONS ───
const getTransactions = async (req, res) => {
  try {
    const userId = req.user?.id || 'DEFAULT_USER';
    const userPhone = req.user?.phone;

    if (Transaction && isMongoConnected()) {
      const txs = await Transaction.find({
        $or: [{ userId: userId }, { walletId: req.user?.walletId || '' }]
      }).sort({ createdAt: -1 }).limit(20);

      const formatted = txs.map(t => ({
        id: t.transactionId,
        title: t.title,
        date: new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        amount: t.type === 'TOPUP' ? `+₹${t.amount.toFixed(2)}` : `-₹${t.amount.toFixed(2)}`,
        positive: t.type === 'TOPUP',
        status: t.status
      }));

      return res.status(200).json({ success: true, transactions: formatted });
    }

    // Fallback: in-memory payments filter
    const userPayments = (dbStore.payments || []).filter(p => p.userId === userId || p.walletId === req.user?.walletId);
    const formatted = userPayments.reverse().slice(0, 15).map(p => ({
      id: p.id || p.transactionId || `TXN-${Date.now()}`,
      title: p.title || (p.amount > 0 ? 'Razorpay Online Top-Up' : 'Bus Ticket Payment'),
      date: p.timestamp ? new Date(p.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today',
      amount: p.amount > 0 ? `+₹${Math.abs(p.amount).toFixed(2)}` : `-₹${Math.abs(p.amount).toFixed(2)}`,
      positive: p.amount > 0,
      status: p.status || 'SUCCESS'
    }));

    return res.status(200).json({ success: true, transactions: formatted });
  } catch (error) {
    return res.status(200).json({ success: true, transactions: [] });
  }
};

// ─── ADD MONEY (GENERIC) ───
const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const numAmount = Number(amount || 0);

    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const userId = req.user?.id;
    const userPhone = req.user?.phone;
    let newBalance = 0;
    let walletId = req.user?.walletId || 'WAL-APSRTC-987654';

    if (User && isMongoConnected() && (userId || userPhone)) {
      let dbUser = null;
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        dbUser = await User.findById(userId);
      }
      if (!dbUser && userPhone) {
        dbUser = await User.findOne({ phone: userPhone });
      }

      if (dbUser) {
        dbUser.walletBalance = (dbUser.walletBalance || 0) + numAmount;
        await dbUser.save();
        newBalance = dbUser.walletBalance;
        walletId = dbUser.walletId || walletId;

        if (Transaction) {
          await Transaction.create({
            userId: dbUser._id.toString(),
            walletId: walletId,
            type: 'TOPUP',
            title: 'Online Wallet Top-Up',
            amount: numAmount,
            paymentMode: 'RAZORPAY_ONLINE',
            transactionId: `pay_rzp_${Date.now()}`
          });
        }
      }
    }

    // In-memory fallback update
    const memUser = dbStore.users.find(u => u.id === userId || u.phone === userPhone);
    if (memUser) {
      memUser.walletBalance = (memUser.walletBalance || 0) + numAmount;
      if (!newBalance) newBalance = memUser.walletBalance;
    }

    dbStore.payments.push({
      id: `pay_rzp_${Date.now()}`,
      userId,
      walletId,
      amount: numAmount,
      title: 'Online Wallet Top-Up',
      status: 'SUCCESS',
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: `Successfully added ₹${numAmount} to wallet`,
      balance: newBalance || numAmount,
      walletId
    });
  } catch (error) {
    console.error('Wallet addMoney error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getBalance,
  getTransactions,
  addMoney,
};
