const { dbStore } = require('../config/db');

class PaymentService {
  /**
   * Generates a unique digital ticket ID, merchant transaction ID, and digital receipt.
   */
  static generateTicketId() {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `TKT-${Date.now()}-${randomSuffix}`;
  }

  static generateTransactionId() {
    return `TXN-UPI-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  /**
   * Processes Online UPI Payment to Transport Corporation Merchant Account
   */
  static async processOnlinePayment({ tripId, busNumber, passengerId, passengerName, currentStop, destinationStop, fare, distanceKm }) {
    const ticketId = this.generateTicketId();
    const transactionId = this.generateTransactionId();
    const timestamp = new Date().toISOString();

    const paymentRecord = {
      id: transactionId,
      ticketId,
      tripId,
      amount: fare,
      paymentMode: 'ONLINE_UPI',
      merchantAccount: 'APSRTC_GOVT_MERCHANT@upi',
      status: 'SUCCESS',
      timestamp,
    };

    const ticketRecord = {
      ticketId,
      tripId,
      busNumber,
      passengerId: passengerId || 'PASSENGER_GUEST',
      passengerName: passengerName || 'Valued Passenger',
      currentStop,
      destinationStop,
      fare,
      distanceKm,
      paymentMode: 'ONLINE_UPI',
      paymentStatus: 'SUCCESS',
      status: 'ACTIVE',
      qrCodeData: JSON.stringify({ ticketId, tripId, busNumber, fare, status: 'SUCCESS' }),
      issuedAt: timestamp,
      receipt: {
        receiptNumber: `RCPT-${ticketId}`,
        merchantName: 'Andhra Pradesh State Road Transport Corporation (APSRTC)',
        taxAmount: Math.round(fare * 0.05 * 100) / 100,
        netFare: Math.round((fare - fare * 0.05) * 100) / 100,
        totalPaid: fare,
        paymentRef: transactionId,
      },
    };

    // Store in backend database
    dbStore.payments.push(paymentRecord);
    dbStore.tickets.push(ticketRecord);
    dbStore.receipts.push(ticketRecord.receipt);

    // Dynamic Analytics Update from Initial 0
    dbStore.analytics.totalRevenue += fare;
    dbStore.analytics.totalPassengers += 1;
    dbStore.analytics.onlineTicketsCount += 1;

    // Update active trip counters
    const activeTrip = dbStore.trips.find((t) => t.tripId === tripId);
    if (activeTrip) {
      activeTrip.totalCollection = (activeTrip.totalCollection || 0) + fare;
      activeTrip.passengerCount = (activeTrip.passengerCount || 0) + 1;
      activeTrip.onlineCollection = (activeTrip.onlineCollection || 0) + fare;
    }

    return {
      payment: paymentRecord,
      ticket: ticketRecord,
    };
  }

  /**
   * Processes Offline Payment (Pending Sync mode)
   */
  static async processOfflinePayment({ tripId, busNumber, passengerId, passengerName, currentStop, destinationStop, fare, distanceKm, localOfflineId }) {
    const ticketId = localOfflineId || this.generateTicketId();
    const timestamp = new Date().toISOString();

    const offlineRecord = {
      id: `OFF-${ticketId}`,
      ticketId,
      tripId,
      busNumber,
      passengerId: passengerId || 'PASSENGER_GUEST',
      passengerName: passengerName || 'Valued Passenger',
      currentStop,
      destinationStop,
      fare,
      distanceKm,
      paymentMode: 'OFFLINE_CASH_OR_UPI',
      paymentStatus: 'PENDING_SYNC',
      status: 'PENDING_SYNC',
      issuedAt: timestamp,
      localOfflineId,
    };

    dbStore.offlineQueue.push(offlineRecord);
    dbStore.tickets.push(offlineRecord);

    // Dynamic Analytics Update
    dbStore.analytics.totalPassengers += 1;
    dbStore.analytics.pendingSyncCount += 1;

    const activeTrip = dbStore.trips.find((t) => t.tripId === tripId);
    if (activeTrip) {
      activeTrip.pendingSyncCount = (activeTrip.pendingSyncCount || 0) + 1;
      activeTrip.passengerCount = (activeTrip.passengerCount || 0) + 1;
    }

    return {
      ticket: offlineRecord,
      status: 'PENDING_SYNC',
      message: 'Offline transaction registered locally. Passenger allowed to travel.',
    };
  }

  /**
   * Synchronizes offline queue when internet connection restores
   */
  static async syncOfflineQueue(offlineItems = []) {
    const syncedTickets = [];
    const syncErrors = [];

    const itemsToProcess = offlineItems.length > 0 ? offlineItems : dbStore.offlineQueue;

    for (const item of itemsToProcess) {
      try {
        const existingTicketIndex = dbStore.tickets.findIndex(
          (t) => t.ticketId === item.ticketId || t.localOfflineId === item.localOfflineId
        );

        const syncedTimestamp = new Date().toISOString();
        const transactionId = `TXN-SYNC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const verifiedTicket = {
          ticketId: item.ticketId || this.generateTicketId(),
          tripId: item.tripId,
          busNumber: item.busNumber,
          passengerId: item.passengerId || 'PASSENGER_GUEST',
          passengerName: item.passengerName || 'Valued Passenger',
          currentStop: item.currentStop,
          destinationStop: item.destinationStop,
          fare: Number(item.fare),
          distanceKm: Number(item.distanceKm),
          paymentMode: item.paymentMode || 'OFFLINE_SYNCED',
          paymentStatus: 'SUCCESS',
          status: 'ACTIVE',
          syncedAt: syncedTimestamp,
          receipt: {
            receiptNumber: `RCPT-${item.ticketId}`,
            merchantName: 'Andhra Pradesh State Road Transport Corporation (APSRTC)',
            taxAmount: Math.round(Number(item.fare) * 0.05 * 100) / 100,
            netFare: Math.round((Number(item.fare) - Number(item.fare) * 0.05) * 100) / 100,
            totalPaid: Number(item.fare),
            paymentRef: transactionId,
          },
        };

        if (existingTicketIndex !== -1) {
          dbStore.tickets[existingTicketIndex] = verifiedTicket;
        } else {
          dbStore.tickets.push(verifiedTicket);
        }

        // Remove from offline queue
        dbStore.offlineQueue = dbStore.offlineQueue.filter(
          (q) => q.ticketId !== item.ticketId && q.localOfflineId !== item.localOfflineId
        );

        // Update analytics dynamically
        dbStore.analytics.totalRevenue += Number(item.fare);
        dbStore.analytics.pendingSyncCount = Math.max(0, dbStore.analytics.pendingSyncCount - 1);
        dbStore.analytics.onlineTicketsCount += 1;

        // Update trip counters
        const activeTrip = dbStore.trips.find((t) => t.tripId === item.tripId);
        if (activeTrip) {
          activeTrip.totalCollection = (activeTrip.totalCollection || 0) + Number(item.fare);
          activeTrip.pendingSyncCount = Math.max(0, (activeTrip.pendingSyncCount || 0) - 1);
        }

        syncedTickets.push(verifiedTicket);
      } catch (err) {
        syncErrors.push({ item, error: err.message });
      }
    }

    const syncLogRecord = {
      id: `SYNC-LOG-${Date.now()}`,
      syncedCount: syncedTickets.length,
      errorCount: syncErrors.length,
      timestamp: new Date().toISOString(),
    };

    dbStore.syncLogs.push(syncLogRecord);

    return {
      syncedCount: syncedTickets.length,
      syncedTickets,
      syncErrors,
      analytics: dbStore.analytics,
    };
  }
}

module.exports = PaymentService;
