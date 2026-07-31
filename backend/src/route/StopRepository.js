const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class StopRepository {
  static async getStopsByRoute(routeId) {
    return await prisma.stop.findMany({
      where: { routeId },
      orderBy: { sequenceNumber: 'asc' }
    });
  }
}

module.exports = StopRepository;
