const FareEngine = require('./FareEngine');

class FareController {
  static async calculateFare(req, res) {
    try {
      const { 
        routeId, 
        sourceStopId, 
        destinationStopId, 
        serviceType, 
        passengerCategory, 
        passengerCount, 
        luggageWeight 
      } = req.body;

      if (!routeId || !sourceStopId || !destinationStopId || !serviceType) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      const fareResult = await FareEngine.processFareRequest({
        routeId,
        sourceStopId,
        destinationStopId,
        serviceType,
        passengerCategory,
        passengerCount,
        luggageWeight
      });

      return res.json(fareResult);
    } catch (error) {
      console.error('Fare Calculation Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = FareController;
