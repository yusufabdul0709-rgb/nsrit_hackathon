const { dbStore } = require('../config/db');

let User = null;
let Transaction = null;
let mongoose = null;

try {
  mongoose = require('mongoose');
  User = require('../models/User');
  Transaction = require('../models/Transaction');
} catch (e) {}

const isMongoConnected = () => {
  return mongoose && mongoose.connection && mongoose.connection.readyState === 1;
};

exports.createTicket = async (req, res) => {
  try {
    const { tripId, routeId, startStop, endStop, currentStop, destinationStop, fare, distanceKm, paymentMode, walletId } = req.body;
    const userId = req.user?.id;
    const userPhone = req.user?.phone;

    const board = startStop || currentStop || 'Visakhapatnam';
    const dest = endStop || destinationStop || 'Anakapalle';
    const ticketFare = Number(fare) || 45.0;

    let dbUser = null;
    if (User && isMongoConnected()) {
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        dbUser = await User.findById(userId);
      }
      if (!dbUser && userPhone) {
        dbUser = await User.findOne({ phone: userPhone });
      }
      if (!dbUser && walletId) {
        dbUser = await User.findOne({ walletId });
      }
    }

    const memUser = dbStore.users.find(u => u.id === userId || u.phone === userPhone || u.walletId === walletId);

    const currentBalance = dbUser ? (dbUser.walletBalance || 0) : (memUser ? (memUser.walletBalance || 0) : 0);

    // If payment mode is wallet or default, check balance & deduct
    if (paymentMode === 'APSRTC_E_WALLET' || paymentMode === 'OFFLINE' || !paymentMode) {
      if (currentBalance < ticketFare) {
        return res.status(402).json({
          success: false,
          message: `Insufficient E-Wallet Balance. Ticket fare is ₹${ticketFare.toFixed(2)}, but available balance is ₹${currentBalance.toFixed(2)}.`,
          required: ticketFare,
          currentBalance: currentBalance,
          shortfall: ticketFare - currentBalance
        });
      }

      // Deduct fare from MongoDB
      if (dbUser) {
        dbUser.walletBalance = Math.max(0, dbUser.walletBalance - ticketFare);
        await dbUser.save();

        if (Transaction) {
          await Transaction.create({
            userId: dbUser._id.toString(),
            walletId: dbUser.walletId || walletId || 'WAL-APSRTC-987654',
            type: 'DEBIT_TICKET',
            title: `Bus Ticket - ${board} → ${dest}`,
            amount: ticketFare,
            paymentMode: 'APSRTC_E_WALLET',
            transactionId: `TXN-TKT-${Date.now()}`,
            status: 'SUCCESS'
          });
        }
      }

      // Deduct fare from in-memory fallback
      if (memUser) {
        memUser.walletBalance = Math.max(0, (memUser.walletBalance || 0) - ticketFare);
      }

      dbStore.payments.push({
        id: `TXN-TKT-${Date.now()}`,
        userId,
        walletId: walletId || 'WAL-APSRTC-987654',
        amount: -ticketFare,
        title: `Bus Ticket - ${board} → ${dest}`,
        mode: 'APSRTC_E_WALLET',
        status: 'SUCCESS',
        timestamp: new Date().toISOString()
      });
    }

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
      paymentMode: paymentMode || 'APSRTC_E_WALLET',
      paymentStatus: 'SUCCESS',
      status: 'ACTIVE',
      issuedAt: new Date().toISOString(),
      walletId: dbUser?.walletId || walletId || 'WAL-APSRTC-987654',
      remainingWalletBalance: dbUser ? dbUser.walletBalance : (memUser ? memUser.walletBalance : 0)
    };

    dbStore.tickets.push(ticketRecord);

    if (req.io) {
      req.io.emit('ticketGenerated', ticketRecord);
    }

    return res.status(201).json({
      success: true,
      message: `Ticket issued! ₹${ticketFare.toFixed(2)} deducted from E-Wallet.`,
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
