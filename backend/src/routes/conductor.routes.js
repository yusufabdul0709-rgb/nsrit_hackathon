const express = require('express');
const router = express.Router();
const conductorController = require('../controllers/conductor.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/validate', authenticateToken, conductorController.validateTicket);

module.exports = router;
