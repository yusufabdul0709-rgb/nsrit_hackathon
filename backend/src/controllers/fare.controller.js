const FareService = require('../services/fare.service');
const { dbStore } = require('../config/db');

exports.calculateFare = async (req, res) => {
  try {
    const { routeId, currentStop, destinationStop, busType } = req.body;

    if (!currentStop || !destinationStop) {
      return res.status(400).json({
        success: false,
        message: 'Both current stop and destination stop are required.',
      });
    }

    const fareSummary = FareService.calculateFare({
      routeId: routeId || dbStore.routes[0].id,
      currentStopName: currentStop,
      destinationStopName: destinationStop,
      busType: busType || 'Express',
    });

    if (req.io) {
      req.io.emit('fareCalculated', fareSummary);
    }

    return res.status(200).json({
      success: true,
      summary: fareSummary,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
