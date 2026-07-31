const express = require('express');
const router = express.Router();
const PaymentController = require('../payment/PaymentController');

router.post('/generateQR', PaymentController.generateQR);

module.exports = router;
