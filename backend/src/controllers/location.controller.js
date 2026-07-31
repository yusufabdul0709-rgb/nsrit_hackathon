const { dbStore } = require('../config/db');

exports.updateLocation = async (req, res) => {
  try {
    const { busId, busNumber, lat, lng, speed, heading, currentStop, tripId } = req.body;

    const identifier = busId || busNumber || 'AP 31 TB 4567';
    const activeTrip = dbStore.trips.find(
      (t) => t.busNumber === identifier || t.tripId === tripId || t.status === 'ACTIVE'
    );

    const gpsRecord = {
      busNumber: identifier,
      lat: Number(lat),
      lng: Number(lng),
      speed: Number(speed || 0),
      heading: Number(heading || 0),
      currentStop: currentStop || (activeTrip ? activeTrip.currentStop : 'RTC Complex'),
      timestamp: new Date().toISOString(),
    };

    if (activeTrip) {
      activeTrip.gpsLocation = gpsRecord;
      if (currentStop) activeTrip.currentStop = currentStop;
    }

    dbStore.gpsLogs.push(gpsRecord);

    if (req.io) {
      req.io.emit('locationUpdated', {
        ...gpsRecord,
        tripId: activeTrip ? activeTrip.tripId : 'TRIP-2026-001',
        routeName: activeTrip ? activeTrip.routeName : 'Visakhapatnam → Anakapalle',
      });
    }

    return res.status(200).json({
      success: true,
      location: gpsRecord,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLiveLocation = async (req, res) => {
  const { busId } = req.params;
  const activeTrip = dbStore.trips.find(
    (t) => t.busNumber === busId || t.tripId === busId || t.status === 'ACTIVE'
  ) || dbStore.trips[0];

  const defaultLocation = {
    busNumber: busId || 'AP 31 TB 4567',
    lat: 17.7231,
    lng: 83.3012,
    speed: 35,
    heading: 90,
    currentStop: 'RTC Complex',
    nextStop: 'Maddilapalem',
    etaToNext: '5 min',
    timestamp: new Date().toISOString(),
  };

  return res.status(200).json({
    success: true,
    location: activeTrip ? activeTrip.gpsLocation || defaultLocation : defaultLocation,
    trip: activeTrip,
  });
};
