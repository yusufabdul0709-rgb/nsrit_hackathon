const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class StageEngine {
  static async getStageMapping(routeId, sourceStopId, destinationStopId) {
    const sourceStop = await prisma.stop.findFirst({
      where: { routeId, stopId: sourceStopId }
    });
    
    const destinationStop = await prisma.stop.findFirst({
      where: { routeId, stopId: destinationStopId }
    });

    if (!sourceStop || !destinationStop) {
      throw new Error('Could not determine stages for the provided stops.');
    }

    const stagesCount = Math.abs(destinationStop.stageNumber - sourceStop.stageNumber) || 1;

    return {
      sourceStage: sourceStop.stageNumber,
      destinationStage: destinationStop.stageNumber,
      stagesCount
    };
  }
}

module.exports = StageEngine;
