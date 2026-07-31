const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class RouteRepository {
  static async getAllRoutes() {
    return await prisma.route.findMany({
      include: { stops: true }
    });
  }

  static async getRouteById(routeId) {
    return await prisma.route.findUnique({
      where: { id: routeId },
      include: { stops: true }
    });
  }
}

module.exports = RouteRepository;
