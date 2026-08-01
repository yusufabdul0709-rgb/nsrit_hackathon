const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.get('/balance', authenticateToken, walletController.getBalance);
router.get('/transactions', authenticateToken, walletController.getTransactions);
router.post('/add', authenticateToken, walletController.addMoney);

module.exports = router;
