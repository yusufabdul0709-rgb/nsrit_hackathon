const express = require('express');
const router = express.Router();

const adminRoutes = require('./admin.routes');
const aiRoutes = require('./ai.routes');
const authRoutes = require('./auth.routes');
const busRoutes = require('./bus.routes');
const conductorRoutes = require('./conductor.routes');
const fareRoutes = require('./fare.routes');
const locationRoutes = require('./location.routes');
const notificationRoutes = require('./notification.routes');
const paymentRoutes = require('./payment.routes');
const qrRoutes = require('./qr.routes');
const routeRoutes = require('./route.routes');
const ticketRoutes = require('./ticket.routes');
const tripRoutes = require('./trip.routes');
const walletRoutes = require('./wallet.routes');

router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);
router.use('/auth', authRoutes);
router.use('/buses', busRoutes);
router.use('/bus', busRoutes); // kept alias
router.use('/conductor', conductorRoutes);
router.use('/fare', fareRoutes);
router.use('/location', locationRoutes);
router.use('/notifications', notificationRoutes);
router.use('/payment', paymentRoutes);
router.use('/qr', qrRoutes);
router.use('/routes', routeRoutes);
router.use('/ticket', ticketRoutes); // kept alias
router.use('/tickets', ticketRoutes);
router.use('/ticket_v2', require('./ticket_v2.routes')); // from HEAD
router.use('/training', require('./training.routes')); // from HEAD
router.use('/trips', tripRoutes);
router.use('/wallet', walletRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
