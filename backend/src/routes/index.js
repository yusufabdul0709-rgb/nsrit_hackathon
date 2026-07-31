const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const ticketRoutes = require('./ticket.routes');
const walletRoutes = require('./wallet.routes');
const conductorRoutes = require('./conductor.routes');
const busRoutes = require('./bus.routes');
const aiRoutes = require('./ai.routes');

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/wallet', walletRoutes);
router.use('/conductor', conductorRoutes);
router.use('/buses', busRoutes);
router.use('/ai', aiRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
