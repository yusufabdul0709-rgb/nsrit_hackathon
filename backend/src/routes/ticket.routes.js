const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const authenticateJWT = require('../middlewares/auth.middleware');

router.post('/create', authenticateJWT, ticketController.createTicket);
router.post('/book', authenticateJWT, ticketController.createTicket);
router.get('/history', authenticateJWT, ticketController.getTicketHistory);
router.get('/:id', ticketController.getTicketById);

module.exports = router;
