const TicketService = require('./TicketService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TicketController {
  static async issueTicket(req, res) {
    try {
      const ticketData = req.body;
      
      // Basic validation
      if (!ticketData.tripId || !ticketData.amount) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      const ticket = await TicketService.issueTicket(ticketData);
      
      return res.status(201).json({
        message: 'Ticket issued successfully',
        ticketNumber: ticket.ticketRef,
        ticketDetails: ticket
      });
    } catch (error) {
      console.error('Ticket Issuance Error:', error);
      return res.status(500).json({ error: 'Failed to issue ticket', details: error.message });
    }
  }
}

module.exports = TicketController;
