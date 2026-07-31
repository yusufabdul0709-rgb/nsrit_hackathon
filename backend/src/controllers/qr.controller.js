const QRService = require('../services/qr.service');
const { dbStore } = require('../config/db');

exports.generateQR = async (req, res) => {
  try {
    const { tripId, busNumber, currentStop, routeId } = req.body;

    const qrData = QRService.generateDynamicQR({
      tripId,
      busNumber,
      currentStop,
      routeId,
    });

    if (req.io) {
      req.io.emit('qrGenerated', qrData);
    }

    return res.status(200).json({
      success: true,
      qr: qrData,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyQR = async (req, res) => {
  try {
    const { qrData, tripId, currentStop } = req.body;

    let payloadToVerify = qrData;
    if (!payloadToVerify && tripId) {
      const activeTrip = dbStore.trips.find((t) => t.tripId === tripId || t.status === 'ACTIVE');
      if (activeTrip && activeTrip.currentQR) {
        payloadToVerify = activeTrip.currentQR.qrRawString;
      }
    }

    if (!payloadToVerify) {
      return res.status(400).json({ success: false, message: 'QR data or active trip payload is required' });
    }

    const verificationResult = QRService.verifyQR(payloadToVerify);

    if (!verificationResult.valid) {
      return res.status(400).json({
        success: false,
        message: verificationResult.reason,
      });
    }

    const qrPayload = verificationResult.data;

    // Retrieve active trip and route details
    const activeTrip =
      dbStore.trips.find((t) => t.tripId === qrPayload.tripId || t.status === 'ACTIVE') ||
      dbStore.trips[0];

    const route = dbStore.routes.find((r) => r.id === qrPayload.routeId) || dbStore.routes[0];
    const stops = route.stops;

    const currentStopName = qrPayload.currentStop || (activeTrip ? activeTrip.currentStop : stops[0].name);
    const currentStopIndex = stops.findIndex(
      (s) => s.name.toLowerCase().trim() === currentStopName.toLowerCase().trim()
    );

    const remainingStops = stops.slice(Math.max(0, currentStopIndex + 1));

    if (req.io) {
      req.io.emit('qrScanned', {
        tripId: qrPayload.tripId,
        busNumber: qrPayload.busNumber,
        passengerScannedAt: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      success: true,
      message: 'QR Code verified successfully',
      verification: {
        tripId: qrPayload.tripId,
        busNumber: qrPayload.busNumber,
        routeId: route.id,
        routeName: route.routeName,
        routeNumber: route.routeNumber,
        busType: activeTrip ? activeTrip.busType : 'Express',
        currentStop: currentStopName,
        currentStopIndex,
        totalStops: stops.length,
        remainingStopsCount: remainingStops.length,
        destinationList: remainingStops.map((s) => s.name),
        allStops: stops,
        liveBusLocation: activeTrip ? activeTrip.gpsLocation : { lat: stops[0].lat, lng: stops[0].lng },
        driverName: activeTrip ? activeTrip.driverName : 'Sri Ramesh K.',
        conductorName: activeTrip ? activeTrip.conductorName : 'Sri Venkatesh P.',
        etaToDestination: `${Math.max(10, remainingStops.length * 12)} min`,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
