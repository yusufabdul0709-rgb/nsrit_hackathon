const express = require('express');
const router = express.Router();
const FareController = require('../fare/FareController');

router.post('/calculate', FareController.calculateFare);

module.exports = router;
