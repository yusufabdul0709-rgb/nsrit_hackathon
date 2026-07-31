const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/initiate', paymentController.initiatePayment);
router.post('/verify', paymentController.verifyPayment);
router.post('/offline', paymentController.recordOfflinePayment);
router.post('/sync', paymentController.syncOfflineQueue);

module.exports = router;
