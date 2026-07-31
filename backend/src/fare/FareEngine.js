const HighwayDistanceEngine = require('./HighwayDistanceEngine');
const StageEngine = require('./StageEngine');
const FareCalculator = require('./FareCalculator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class FareEngine {
  static async processFareRequest({ routeId, sourceStopId, destinationStopId, serviceType, passengerCategory, passengerCount = 1, luggageWeight = 0 }) {
    // 1. Determine Highway Route Distance
    const distance = await HighwayDistanceEngine.calculateDistance(routeId, sourceStopId, destinationStopId);

    // 2. Identify Stage Numbers
    const stageInfo = await StageEngine.getStageMapping(routeId, sourceStopId, destinationStopId);

    // 3. Calculate Fare using Fare Model, Category, Luggage, Rules
    const fareDetails = await FareCalculator.calculate(
      serviceType,
      distance,
      stageInfo.stagesCount,
      passengerCategory,
      passengerCount,
      luggageWeight
    );

    return {
      travelDistance: distance,
      boardingStage: stageInfo.sourceStage,
      destinationStage: stageInfo.destinationStage,
      stageCount: stageInfo.stagesCount,
      baseFare: fareDetails.baseFare,
      additionalCharges: fareDetails.luggageCharges + fareDetails.taxes,
      finalFare: fareDetails.finalFare
    };
  }
}

module.exports = FareEngine;
