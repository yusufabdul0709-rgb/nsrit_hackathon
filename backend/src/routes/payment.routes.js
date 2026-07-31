const express = require('express');
const router = express.Router();
const PaymentController = require('../payment/PaymentController');
const paymentControllerV2 = require('../controllers/payment.controller');

router.post('/generateQR', PaymentController.generateQR);
router.post('/initiate', paymentControllerV2.initiatePayment);
router.post('/verify', paymentControllerV2.verifyPayment);
router.post('/offline', paymentControllerV2.recordOfflinePayment);
router.post('/sync', paymentControllerV2.syncOfflineQueue);

module.exports = router;
