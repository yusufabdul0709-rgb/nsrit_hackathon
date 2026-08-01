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
      message: `Ticket #${result.ticket.ticketId} issued from ${currentStop} to ${destinationStop}. Amount: Γé╣${fare}.`,
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

const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Rp7Q0snFBZKQb0',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'y8ibBnv7GuWvdN2zkdV1W9Om'
});

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', passengerId, walletId } = req.body;
    const numAmount = Number(amount || 100);

    const options = {
      amount: Math.round(numAmount * 100), // paise
      currency,
      receipt: `w_topup_${Date.now()}`,
      notes: { passengerId: passengerId || '', walletId: walletId || '' }
    };

    let order = null;
    try {
      order = await razorpay.orders.create(options);
    } catch (rzpErr) {
      order = {
        id: `order_test_${Date.now()}`,
        entity: 'order',
        amount: options.amount,
        currency: 'INR',
        receipt: options.receipt,
        status: 'created'
      };
    }

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: numAmount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_Rp7Q0snFBZKQb0'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyTopUp = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, amount, passengerId, walletId } = req.body;
    const topUpAmount = Number(amount || 100);
    const txnId = razorpayPaymentId || `pay_rzp_${Date.now()}`;

    let User = null;
    let Transaction = null;
    let mongoose = null;
    try {
      mongoose = require('mongoose');
      User = require('../models/User');
      Transaction = require('../models/Transaction');
    } catch (e) {}

    const isMongoConnected = () => mongoose && mongoose.connection && mongoose.connection.readyState === 1;

    let updatedBalance = topUpAmount;
    let targetWalletId = walletId || 'WAL-APSRTC-987654';

    if (User && isMongoConnected()) {
      let dbUser = null;
      if (passengerId && require('mongoose').Types.ObjectId.isValid(passengerId)) {
        dbUser = await User.findById(passengerId);
      }
      if (!dbUser && walletId) {
        dbUser = await User.findOne({ walletId: walletId });
      }

      if (dbUser) {
        dbUser.walletBalance = (dbUser.walletBalance || 0) + topUpAmount;
        await dbUser.save();
        updatedBalance = dbUser.walletBalance;
        targetWalletId = dbUser.walletId || targetWalletId;

        if (Transaction) {
          await Transaction.create({
            userId: dbUser._id.toString(),
            walletId: targetWalletId,
            type: 'TOPUP',
            title: 'Razorpay Online Top-Up',
            amount: topUpAmount,
            paymentMode: 'RAZORPAY_ONLINE',
            transactionId: txnId,
            status: 'SUCCESS'
          });
        }
      }
    }

    // In-memory fallback
    let memUser = dbStore.users.find(u => u.id === passengerId || u.walletId === walletId || u.walletId === targetWalletId);
    if (!memUser) {
      memUser = { id: passengerId || 'USER-1', walletId: targetWalletId, walletBalance: topUpAmount };
      dbStore.users.push(memUser);
      updatedBalance = topUpAmount;
    } else {
      memUser.walletBalance = (memUser.walletBalance || 0) + topUpAmount;
      updatedBalance = memUser.walletBalance;
    }

    dbStore.payments.push({
      id: txnId,
      orderId: razorpayOrderId || `ORD-${Date.now()}`,
      walletId: targetWalletId,
      amount: topUpAmount,
      title: 'Razorpay Online Top-Up',
      mode: 'RAZORPAY_ONLINE',
      status: 'SUCCESS',
      timestamp: new Date().toISOString()
    });

    dbStore.analytics.totalRevenue += topUpAmount;

    return res.status(200).json({
      success: true,
      message: `Γé╣${topUpAmount} successfully credited to your wallet via Razorpay Online Payment!`,
      walletId: targetWalletId,
      newBalance: updatedBalance,
      transactionId: txnId
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
