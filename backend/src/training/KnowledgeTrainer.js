const DatasetParser = require('./DatasetParser');
const KnowledgeRepository = require('./KnowledgeRepository');
const path = require('path');

class KnowledgeTrainer {
  static async trainFromCSV(fileName) {
    const filePath = path.join(__dirname, '../../datasets', fileName);
    const meta = await KnowledgeRepository.createTrainingMetadata(fileName);

    try {
      const rawData = await DatasetParser.parseCSV(filePath);
      
      // Clear old data
      await KnowledgeRepository.clearKnowledgeBase();

      // Extract Routes
      const routeMap = new Map();
      
      rawData.forEach(row => {
        if (!row.route) return;
        const [origin, destination] = row.route.split('-');
        const routeId = `R_${row.route.replace(/\s/g, '_')}`;
        
        if (!routeMap.has(routeId)) {
          routeMap.set(routeId, {
            routeId,
            serviceType: row.serviceType || 'Express', // Default if not in CSV
            routeName: row.route,
            origin: origin ? origin.trim() : 'Unknown',
            destination: destination ? destination.trim() : 'Unknown'
          });
        }
      });
      
      const routes = Array.from(routeMap.values());
      await KnowledgeRepository.saveRoutes(routes);

      // Extract Stops
      // We simulate stops generation since standard CSV might not have sequences.
      const stopsData = [];
      rawData.forEach((row, i) => {
        if (!row.route) return;
        const routeId = `R_${row.route.replace(/\s/g, '_')}`;
        
        const [origin, destination] = row.route.split('-');
        
        // Origin Stop
        stopsData.push({
          stopId: `S_${origin}_${i}`,
          stopName: origin ? origin.trim() : 'Unknown',
          routeId: routes.find(r => r.routeId === routeId).id, // Need to get Prisma ID
          sequenceNumber: 1,
          highwayDistance: 0,
          stageNumber: 1
        });
        
        // Destination Stop
        stopsData.push({
          stopId: `S_${destination}_${i}`,
          stopName: destination ? destination.trim() : 'Unknown',
          routeId: routes.find(r => r.routeId === routeId).id,
          sequenceNumber: 2,
          highwayDistance: parseFloat(row.distance) || 10.0,
          stageNumber: 2
        });
      });

      // Instead of linking by prisma ID directly before routes are fetched back,
      // let's fetch the saved routes to get their generated ObjectIds.
      const savedRoutes = await require('@prisma/client').PrismaClient.prototype.$parent.route.findMany();
      
      const enrichedStops = stopsData.map(stop => {
        const matchingRoute = savedRoutes.find(r => r.routeId === routeMap.get(stop.routeId)?.routeId);
        // Fallback for demo
        stop.routeId = matchingRoute ? matchingRoute.id : savedRoutes[0]?.id;
        return stop;
      });

      // Save a default fare model
      await KnowledgeRepository.saveFareModels([
        { serviceType: 'Palle Velugu', minFare: 10, baseFare: 10, farePerKm: 1.0, stageFare: 5 },
        { serviceType: 'Express', minFare: 15, baseFare: 15, farePerKm: 1.5, stageFare: 10 },
        { serviceType: 'Metro Express', minFare: 20, baseFare: 20, farePerKm: 2.0, stageFare: 15 },
        { serviceType: 'City Ordinary', minFare: 5, baseFare: 5, farePerKm: 0.8, stageFare: 5 }
      ]);

      await KnowledgeRepository.updateTrainingMetadata(meta.id, 'COMPLETED', 'Successfully parsed and trained knowledge base');
      return { success: true, message: 'Training completed' };

    } catch (error) {
      await KnowledgeRepository.updateTrainingMetadata(meta.id, 'FAILED', error.message);
      throw error;
    }
  }
}

module.exports = KnowledgeTrainer;
