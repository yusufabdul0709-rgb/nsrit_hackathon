const { dbStore } = require('../config/db');
const QRService = require('../services/qr.service');
const NotificationService = require('../services/notification.service');

exports.startTrip = async (req, res) => {
  try {
    const {
      busNumber,
      routeId,
      tripId: customTripId,
      currentStop,
      direction = 'UP',
      driverName,
      conductorName,
    } = req.body;

    if (!busNumber || !currentStop) {
      return res.status(400).json({
        success: false,
        message: 'Bus Number and Current Stop are required to start a trip.',
      });
    }

    const tripId = customTripId || `TRIP-${Date.now().toString().slice(-6)}`;
    const route = dbStore.routes.find((r) => r.id === routeId || r.routeNumber === routeId) || dbStore.routes[0];

    const activeTripSession = {
      tripId,
      busNumber,
      routeId: route.id,
      routeName: route.routeName,
      routeNumber: route.routeNumber,
      busType: route.busType || 'Express',
      currentStop: currentStop || route.stops[0].name,
      currentStopIndex: route.stops.findIndex((s) => s.name === currentStop) || 0,
      direction,
      driverName: driverName || 'Sri Ramesh K.',
      conductorName: conductorName || 'Sri Venkatesh P.',
      status: 'ACTIVE',
      startTime: new Date().toISOString(),
      // Initial stats start strictly at zero (0)
      totalCollection: 0,
      passengerCount: 0,
      onlineCollection: 0,
      pendingSyncCount: 0,
      stops: route.stops,
      gpsLocation: {
        lat: route.stops[0].lat,
        lng: route.stops[0].lng,
        speed: 0,
        heading: 0,
        lastUpdated: new Date().toISOString(),
      },
    };

    // Store in active trips
    dbStore.trips = dbStore.trips.filter((t) => t.busNumber !== busNumber && t.status === 'ACTIVE');
    dbStore.trips.push(activeTripSession);

    // Dynamic analytics increment
    dbStore.analytics.totalTripsStarted += 1;

    // Generate dynamic QR for the starting stop
    const initialQR = QRService.generateDynamicQR({
      tripId,
      busNumber,
      currentStop: activeTripSession.currentStop,
      routeId: route.id,
    });

    activeTripSession.currentQR = initialQR;

    // Notify via Socket.IO
    if (req.io) {
      req.io.emit('tripStarted', activeTripSession);
      req.io.emit('qrGenerated', initialQR);
    }

    NotificationService.sendNotification({
      title: 'Trip Started',
      message: `Trip ${tripId} started on Route ${route.routeName} by Conductor ${activeTripSession.conductorName}.`,
      type: 'TRIP_START',
      metaData: { tripId, busNumber },
    });

    return res.status(201).json({
      success: true,
      message: 'Active Trip Session created successfully',
      trip: activeTripSession,
      qr: initialQR,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCurrentStop = async (req, res) => {
  try {
    const { tripId, currentStop } = req.body;

    const trip = dbStore.trips.find((t) => t.tripId === tripId || t.status === 'ACTIVE');
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Active trip session not found.' });
    }

    const route = dbStore.routes.find((r) => r.id === trip.routeId) || dbStore.routes[0];
    const stopIndex = route.stops.findIndex(
      (s) => s.name.toLowerCase().trim() === currentStop.toLowerCase().trim()
    );

    trip.currentStop = currentStop;
    if (stopIndex !== -1) {
      trip.currentStopIndex = stopIndex;
      trip.gpsLocation.lat = route.stops[stopIndex].lat;
      trip.gpsLocation.lng = route.stops[stopIndex].lng;
    }

    // Automatically generate a FRESH dynamic QR when stop updates!
    const refreshedQR = QRService.generateDynamicQR({
      tripId: trip.tripId,
      busNumber: trip.busNumber,
      currentStop: trip.currentStop,
      routeId: trip.routeId,
    });

    trip.currentQR = refreshedQR;

    if (req.io) {
      req.io.emit('locationUpdated', {
        tripId: trip.tripId,
        busNumber: trip.busNumber,
        currentStop: trip.currentStop,
        gpsLocation: trip.gpsLocation,
      });
      req.io.emit('qrGenerated', refreshedQR);
    }

    return res.status(200).json({
      success: true,
      message: `Current stop updated to ${currentStop}. Dynamic QR refreshed automatically.`,
      trip,
      qr: refreshedQR,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.endTrip = async (req, res) => {
  try {
    const { tripId } = req.body;
    const trip = dbStore.trips.find((t) => t.tripId === tripId || t.status === 'ACTIVE');

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Active trip not found.' });
    }

    trip.status = 'COMPLETED';
    trip.endTime = new Date().toISOString();

    dbStore.analytics.totalTripsCompleted += 1;

    if (req.io) {
      req.io.emit('tripEnded', { tripId: trip.tripId, busNumber: trip.busNumber });
      req.io.emit('tripCompleted', trip);
    }

    NotificationService.sendNotification({
      title: 'Trip Completed',
      message: `Trip ${trip.tripId} completed. Total Revenue: ₹${trip.totalCollection}, Passengers: ${trip.passengerCount}.`,
      type: 'TRIP_END',
      metaData: { tripId: trip.tripId },
    });

    return res.status(200).json({
      success: true,
      message: 'Trip completed successfully',
      summary: {
        tripId: trip.tripId,
        busNumber: trip.busNumber,
        totalCollection: trip.totalCollection,
        passengerCount: trip.passengerCount,
        pendingSyncCount: trip.pendingSyncCount,
        startTime: trip.startTime,
        endTime: trip.endTime,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getActiveTrip = async (req, res) => {
  const { id } = req.params;
  let trip = null;
  if (id) {
    trip = dbStore.trips.find((t) => t.tripId === id || t.busNumber === id);
  } else {
    trip = dbStore.trips.find((t) => t.status === 'ACTIVE') || dbStore.trips[0] || null;
  }

  if (!trip) {
    return res.status(404).json({ success: false, message: 'No active trip session available.' });
  }

  return res.status(200).json({ success: true, trip });
};
