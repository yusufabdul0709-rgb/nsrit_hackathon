const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/book', authenticateToken, ticketController.bookTicket);
router.get('/my-tickets', authenticateToken, ticketController.getUserTickets);

module.exports = router;
