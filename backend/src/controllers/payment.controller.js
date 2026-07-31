const PaymentService = require('../services/payment.service');
const NotificationService = require('../services/notification.service');
const { dbStore } = require('../config/db');

exports.initiatePayment = async (req, res) => {
  try {
    const { tripId, busNumber, passengerId, passengerName, currentStop, destinationStop, fare, distanceKm } = req.body;

    if (!tripId || !currentStop || !destinationStop || !fare) {
      return res.status(400).json({ success: false, message: 'Trip ID, current stop, destination stop, and fare are required' });
    }

    if (req.io) {
      req.io.emit('paymentInitiated', { tripId, fare, mode: 'ONLINE_UPI' });
    }

    // Process payment & ticket generation
    const result = await PaymentService.processOnlinePayment({
      tripId,
      busNumber: busNumber || 'AP 31 TB 4567',
      passengerId,
      passengerName,
      currentStop,
      destinationStop,
      fare: Number(fare),
      distanceKm: Number(distanceKm || 12),
    });

    if (req.io) {
      req.io.emit('paymentCompleted', {
        ticketId: result.ticket.ticketId,
        tripId,
        amount: fare,
        status: 'SUCCESS',
        newTotalCollection: dbStore.analytics.totalRevenue,
      });

      req.io.emit('ticketGenerated', result.ticket);
    }

    NotificationService.sendNotification({
      title: 'Ticket Issued',
      message: `Ticket #${result.ticket.ticketId} issued from ${currentStop} to ${destinationStop}. Amount: ₹${fare}.`,
      type: 'TICKET_SUCCESS',
      metaData: { ticketId: result.ticket.ticketId },
    });

    return res.status(200).json({
      success: true,
      message: 'Payment completed and Digital Ticket generated successfully',
      payment: result.payment,
      ticket: result.ticket,
      receipt: result.ticket.receipt,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  const { paymentId, ticketId } = req.body;
  const payment = dbStore.payments.find((p) => p.id === paymentId || p.ticketId === ticketId);
  const ticket = dbStore.tickets.find((t) => t.ticketId === ticketId || t.paymentRef === paymentId);

  if (!payment && !ticket) {
    return res.status(404).json({ success: false, message: 'Payment or Ticket record not found' });
  }

  return res.status(200).json({
    success: true,
    paymentStatus: payment ? payment.status : 'SUCCESS',
    ticket,
  });
};

exports.recordOfflinePayment = async (req, res) => {
  try {
    const { tripId, busNumber, passengerId, passengerName, currentStop, destinationStop, fare, distanceKm, localOfflineId } = req.body;

    const result = await PaymentService.processOfflinePayment({
      tripId,
      busNumber: busNumber || 'AP 31 TB 4567',
      passengerId,
      passengerName,
      currentStop,
      destinationStop,
      fare: Number(fare),
      distanceKm: Number(distanceKm || 12),
      localOfflineId,
    });

    if (req.io) {
      req.io.emit('paymentPending', {
        ticketId: result.ticket.ticketId,
        tripId,
        amount: fare,
        status: 'PENDING_SYNC',
        pendingSyncCount: dbStore.analytics.pendingSyncCount,
      });

      req.io.emit('ticketGenerated', result.ticket);
    }

    NotificationService.sendNotification({
      title: 'Offline Ticket Issued',
      message: `Offline Ticket #${result.ticket.ticketId} issued (PENDING SYNC). Passenger allowed to travel.`,
      type: 'TICKET_OFFLINE',
      metaData: { ticketId: result.ticket.ticketId },
    });

    return res.status(200).json({
      success: true,
      message: 'Offline transaction registered locally. Status: PENDING SYNC',
      ticket: result.ticket,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.syncOfflineQueue = async (req, res) => {
  try {
    const { offlineItems } = req.body;

    if (req.io) {
      req.io.emit('syncStarted', { timestamp: new Date().toISOString() });
    }

    const syncResult = await PaymentService.syncOfflineQueue(offlineItems || []);

    if (req.io) {
      req.io.emit('syncCompleted', {
        syncedCount: syncResult.syncedCount,
        analytics: syncResult.analytics,
      });
    }

    NotificationService.sendNotification({
      title: 'Sync Successful',
      message: `Successfully synchronized ${syncResult.syncedCount} offline transactions to MongoDB & Admin Dashboard.`,
      type: 'SYNC_SUCCESS',
      metaData: { count: syncResult.syncedCount },
    });

    return res.status(200).json({
      success: true,
      message: `Synchronization complete. ${syncResult.syncedCount} transactions processed.`,
      result: syncResult,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
