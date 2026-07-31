const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qr.controller');

router.post('/generate', qrController.generateQR);
router.post('/verify', qrController.verifyQR);

module.exports = router;
