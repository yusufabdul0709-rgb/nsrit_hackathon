const { dbStore } = require('../config/db');

exports.createTicket = async (req, res) => {
  try {
    const { tripId, routeId, startStop, endStop, currentStop, destinationStop, fare, distanceKm, paymentMode } = req.body;

    const board = startStop || currentStop || 'RTC Complex';
    const dest = endStop || destinationStop || 'Anakapalle';
    const ticketFare = Number(fare) || 45.0;

    const ticketId = `TKT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticketRecord = {
      ticketId,
      id: ticketId,
      tripId: tripId || routeId || 'TRIP-2026-400D-01',
      busNumber: 'AP 31 TB 4567',
      currentStop: board,
      startStop: board,
      destinationStop: dest,
      endStop: dest,
      fare: ticketFare,
      distanceKm: Number(distanceKm || 15),
      paymentMode: paymentMode || 'ONLINE_UPI',
      paymentStatus: paymentMode === 'OFFLINE' ? 'PENDING_SYNC' : 'SUCCESS',
      status: paymentMode === 'OFFLINE' ? 'PENDING_SYNC' : 'ACTIVE',
      issuedAt: new Date().toISOString(),
    };

    dbStore.tickets.push(ticketRecord);

    if (req.io) {
      req.io.emit('ticketGenerated', ticketRecord);
    }

    return res.status(201).json({
      success: true,
      ticket: ticketRecord,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTicketById = async (req, res) => {
  const { id } = req.params;
  const ticket = dbStore.tickets.find((t) => t.ticketId === id || t.localOfflineId === id || t.id === id);

  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Ticket not found' });
  }

  return res.status(200).json({ success: true, ticket });
};

exports.getTicketHistory = async (req, res) => {
  const userId = req.user?.id;
  const userTickets = dbStore.tickets;

  return res.status(200).json({
    success: true,
    count: userTickets.length,
    tickets: userTickets,
  });
};
