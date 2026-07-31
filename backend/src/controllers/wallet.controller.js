const { dbStore } = require('../config/db');

const getBalance = async (req, res) => {
  try {
    const userId = req.user?.id || 'DEFAULT_USER';
    let user = dbStore.users.find((u) => u.id === userId);
    if (!user) {
      user = { id: userId, balance: 500 };
      dbStore.users.push(user);
    }
    const currentBalance = user.balance !== undefined ? user.balance : 500;
    return res.status(200).json({ success: true, balance: currentBalance });
  } catch (error) {
    console.error('Wallet getBalance error:', error);
    return res.status(200).json({ success: true, balance: 500 });
  }
};

const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const userId = req.user?.id || 'DEFAULT_USER';
    let user = dbStore.users.find((u) => u.id === userId);
    if (!user) {
      user = { id: userId, balance: 500 };
      dbStore.users.push(user);
    }

    user.balance = (user.balance || 500) + Number(amount);

    return res.status(200).json({
      success: true,
      message: `Successfully added ₹${amount} to wallet`,
      balance: user.balance,
    });
  } catch (error) {
    console.error('Wallet addMoney error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getBalance,
  addMoney,
};
