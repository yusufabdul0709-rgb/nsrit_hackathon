const express = require('express');
const router = express.Router();
const offlinePaymentController = require('../controllers/offlinePaymentController');

// POST /api/offline-sync
router.post('/offline-sync', offlinePaymentController.syncOfflineTicket);

module.exports = router;
