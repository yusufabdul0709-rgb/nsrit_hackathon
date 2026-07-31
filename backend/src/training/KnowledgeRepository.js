const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class KnowledgeRepository {
  static async clearKnowledgeBase() {
    await prisma.stop.deleteMany({});
    await prisma.route.deleteMany({});
    await prisma.fareModel.deleteMany({});
  }

  static async saveStops(stopsData) {
    // Expected stopsData: array of { stopId, stopName, lat, lng, routeId, sequenceNumber, highwayDistance, stageNumber }
    return await prisma.stop.createMany({
      data: stopsData,
      skipDuplicates: true
    });
  }

  static async saveRoutes(routesData) {
    // Expected routesData: array of { routeId, serviceType, routeName, origin, destination }
    return await prisma.route.createMany({
      data: routesData,
      skipDuplicates: true
    });
  }

  static async saveFareModels(fareModelsData) {
    return await prisma.fareModel.createMany({
      data: fareModelsData,
      skipDuplicates: true
    });
  }

  static async createTrainingMetadata(datasetName) {
    return await prisma.trainingMetadata.create({
      data: {
        version: `v${Date.now()}`,
        datasetName,
        status: 'IN_PROGRESS'
      }
    });
  }

  static async updateTrainingMetadata(id, status, logs) {
    return await prisma.trainingMetadata.update({
      where: { id },
      data: { status, logs }
    });
  }
}

module.exports = KnowledgeRepository;
