const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class FareCalculator {
  static async calculate(serviceType, distance, stagesCount, passengerCategory, passengerCount, luggageWeight) {
    const fareModel = await prisma.fareModel.findUnique({
      where: { serviceType }
    });

    if (!fareModel) {
      throw new Error(`Fare model not found for service type: ${serviceType}`);
    }

    let baseFare = fareModel.baseFare;

    if (fareModel.stageFare && stagesCount > 0) {
      baseFare += fareModel.stageFare * stagesCount;
    } else if (fareModel.farePerKm && distance > 0) {
      baseFare += fareModel.farePerKm * distance;
    }

    // Apply passenger category multiplier (fallback to 1 if not provided/found)
    let fareMultiplier = 1.0;
    if (passengerCategory) {
      const category = await prisma.passengerCategory.findUnique({
        where: { categoryName: passengerCategory }
      });
      if (category) {
        fareMultiplier = category.fareMultiplier;
      }
    }

    let passengerTotal = Math.max(fareModel.minFare, baseFare * fareMultiplier) * passengerCount;

    // Add Luggage
    let luggageCharges = 0;
    if (luggageWeight > 0) {
      // Find suitable luggage rule (basic mock, actual logic would match slabs)
      const luggageRule = await prisma.luggageRule.findFirst();
      if (luggageRule) {
        luggageCharges = luggageRule.additionalFare;
      } else {
        luggageCharges = Math.floor(luggageWeight / 10) * 5; // default 5rs per 10kg
      }
    }

    const subTotal = passengerTotal + luggageCharges;
    const taxes = fareModel.applicableTaxes ? (subTotal * fareModel.applicableTaxes) : 0;
    
    // Rounding to nearest integer
    const finalFare = Math.round(subTotal + taxes);

    return {
      baseFare,
      passengerTotal,
      luggageCharges,
      taxes,
      finalFare
    };
  }
}

module.exports = FareCalculator;
