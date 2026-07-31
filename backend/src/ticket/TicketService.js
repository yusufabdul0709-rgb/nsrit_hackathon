const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

class TicketService {
  static async issueTicket(ticketData) {
    const { userId, tripId, serviceType, sourceStop, destinationStop, distance, amount, qrData, orderId } = ticketData;
    
    // Create ticket reference
    const ticketRef = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Generate digital signature
    const signaturePayload = `${ticketRef}|${tripId}|${sourceStop}|${destinationStop}|${amount}`;
    const digitalSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET || 'default_secret')
                                   .update(signaturePayload)
                                   .digest('hex');

    const ticket = await prisma.ticket.create({
      data: {
        ticketRef,
        userId: userId || null,
        tripId,
        serviceType,
        sourceStop,
        destinationStop,
        distance,
        amount,
        status: 'VALID',
        qrData,
        digitalSignature,
        orderId
      }
    });

    return ticket;
  }
}

module.exports = TicketService;
