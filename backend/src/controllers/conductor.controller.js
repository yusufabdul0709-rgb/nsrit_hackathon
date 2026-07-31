const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const validateTicket = async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({ message: 'QR Data is required' });
    }

    // Ensure the requester is a conductor (in a real app, role is verified in middleware)
    if (req.user.role !== 'CONDUCTOR' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized. Conductors only.' });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { qrData },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        trip: { include: { route: true, vehicle: true } }
      }
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found or Invalid QR code' });
    }

    if (ticket.status === 'USED') {
      return res.status(400).json({ 
        message: 'Ticket has already been used',
        ticketDetails: ticket
      });
    }

    if (ticket.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Ticket is cancelled' });
    }

    // Mark as USED
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: 'USED' }
    });

    res.json({
      message: 'Ticket validated successfully!',
      ticket: {
        ...updatedTicket,
        user: ticket.user,
        trip: ticket.trip
      }
    });

  } catch (error) {
    console.error('Validate ticket error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  validateTicket
};
