const express = require('express');
const router = express.Router();
const fareController = require('../controllers/fare.controller');

router.post('/calculate', fareController.calculateFare);

module.exports = router;
