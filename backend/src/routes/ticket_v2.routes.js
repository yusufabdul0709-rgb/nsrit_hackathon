const express = require('express');
const router = express.Router();
const TicketController = require('../ticket/TicketController');

router.post('/issue', TicketController.issueTicket);

module.exports = router;
