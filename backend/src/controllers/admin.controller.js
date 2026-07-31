const { dbStore } = require('../config/db');

exports.getDashboardMetrics = async (req, res) => {
  try {
    const activeTrips = dbStore.trips.filter((t) => t.status === 'ACTIVE');
    const completedTrips = dbStore.trips.filter((t) => t.status === 'COMPLETED');

    const totalRevenue = dbStore.analytics.totalRevenue || 0;
    const totalPassengers = dbStore.analytics.totalPassengers || 0;
    const pendingSyncCount = dbStore.offlineQueue.length;

    // Conductor status calculation
    const onlineConductors = activeTrips.length;
    const offlineConductors = Math.max(0, dbStore.conductors.length - onlineConductors);

    // Live buses GPS list
    const liveBuses = activeTrips.map((t) => ({
      tripId: t.tripId,
      busNumber: t.busNumber,
      routeName: t.routeName,
      conductorName: t.conductorName,
      currentStop: t.currentStop,
      lat: t.gpsLocation?.lat || 17.7231,
      lng: t.gpsLocation?.lng || 83.3012,
      speed: t.gpsLocation?.speed || 0,
      passengerCount: t.passengerCount || 0,
      totalCollection: t.totalCollection || 0,
      status: t.status,
    }));

    return res.status(200).json({
      success: true,
      metrics: {
        todaysRevenue: totalRevenue,
        todaysTrips: dbStore.trips.length,
        activeTripsCount: activeTrips.length,
        completedTripsCount: completedTrips.length,
        passengerCount: totalPassengers,
        onlineConductorsCount: onlineConductors,
        offlineConductorsCount: offlineConductors,
        pendingSyncCount,
        liveBusesCount: liveBuses.length,
      },
      liveBuses,
      pendingSyncQueue: dbStore.offlineQueue,
      recentTickets: dbStore.tickets.slice(-10).reverse(),
      analytics: dbStore.analytics,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRevenueAnalytics = async (req, res) => {
  const onlineTotal = dbStore.tickets
    .filter((t) => t.paymentStatus === 'SUCCESS')
    .reduce((sum, t) => sum + (t.fare || 0), 0);

  const pendingTotal = dbStore.offlineQueue.reduce((sum, q) => sum + (Number(q.fare) || 0), 0);

  return res.status(200).json({
    success: true,
    revenue: {
      total: onlineTotal,
      onlineUPI: onlineTotal,
      pendingSyncValue: pendingTotal,
      ticketBreakdown: {
        onlineCount: dbStore.analytics.onlineTicketsCount,
        pendingSyncCount: dbStore.offlineQueue.length,
      },
    },
  });
};

exports.getTrips = async (req, res) => {
  return res.status(200).json({
    success: true,
    count: dbStore.trips.length,
    trips: dbStore.trips,
  });
};

exports.getAnalytics = async (req, res) => {
  return res.status(200).json({
    success: true,
    analytics: dbStore.analytics,
    syncLogs: dbStore.syncLogs,
  });
};
