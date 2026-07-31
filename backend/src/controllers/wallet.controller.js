const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getBalance = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { balance: true }
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Wallet getBalance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        balance: {
          increment: amount
        }
      }
    });

    res.json({
      message: `Successfully added ₹${amount} to wallet`,
      balance: updatedUser.balance
    });
  } catch (error) {
    console.error('Wallet addMoney error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getBalance,
  addMoney
};
