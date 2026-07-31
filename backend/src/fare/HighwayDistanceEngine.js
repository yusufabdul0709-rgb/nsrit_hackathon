const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class HighwayDistanceEngine {
  static async calculateDistance(routeId, sourceStopId, destinationStopId) {
    const stops = await prisma.stop.findMany({
      where: { routeId: routeId },
      orderBy: { sequenceNumber: 'asc' }
    });

    const startIndex = stops.findIndex(s => s.stopId === sourceStopId);
    const endIndex = stops.findIndex(s => s.stopId === destinationStopId);

    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      throw new Error('Invalid source or destination for the given route.');
    }

    const sourceStop = stops[startIndex];
    const destinationStop = stops[endIndex];

    const distance = destinationStop.highwayDistance - sourceStop.highwayDistance;
    return distance > 0 ? distance : 0;
  }
}

module.exports = HighwayDistanceEngine;
