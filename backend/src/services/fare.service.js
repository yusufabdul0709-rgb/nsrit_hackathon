const { dbStore } = require('../config/db');

// Base fare configuration per bus type (in INR)
const FARE_CONFIG = {
  PalleVelugu: { base: 10, perKm: 1.2 },
  Express: { base: 15, perKm: 1.6 },
  'Ultra Deluxe': { base: 20, perKm: 2.0 },
  'Super Luxury': { base: 25, perKm: 2.5 },
  SuperLuxury: { base: 25, perKm: 2.5 },
};

class FareService {
  /**
   * Calculates distance between two coordinates using Haversine formula
   */
  static haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calculates distance, fare, remaining stops, and ETA for a specific origin stop and destination stop.
   */
  static calculateFare({ routeId, currentStopName, destinationStopName, busType = 'Express' }) {
    const route = dbStore.routes.find((r) => r.id === routeId || r.routeNumber === routeId) || dbStore.routes[0];
    const stops = route.stops;

    const fromIndex = stops.findIndex(
      (s) => s.name.toLowerCase().trim() === currentStopName.toLowerCase().trim()
    );
    const toIndex = stops.findIndex(
      (s) => s.name.toLowerCase().trim() === destinationStopName.toLowerCase().trim()
    );

    if (fromIndex === -1) {
      throw new Error(`Current stop "${currentStopName}" not found on route ${route.routeName}`);
    }
    if (toIndex === -1) {
      throw new Error(`Destination stop "${destinationStopName}" not found on route ${route.routeName}`);
    }
    if (toIndex <= fromIndex) {
      throw new Error(`Destination stop must be ahead of current stop on the route trajectory.`);
    }

    // Distance calculation
    let distanceKm = 0;
    const fromStop = stops[fromIndex];
    const toStop = stops[toIndex];

    if (fromStop.kmFromStart !== undefined && toStop.kmFromStart !== undefined) {
      distanceKm = Math.abs(toStop.kmFromStart - fromStop.kmFromStart);
    } else {
      distanceKm = this.haversineDistance(fromStop.lat, fromStop.lng, toStop.lat, toStop.lng);
    }

    distanceKm = Math.max(1, Math.round(distanceKm * 10) / 10);

    // Rate calculation
    const rateRule = FARE_CONFIG[busType] || FARE_CONFIG['Express'];
    const calculatedFare = Math.ceil(rateRule.base + distanceKm * rateRule.perKm);

    // Remaining stops
    const remainingStopsList = stops.slice(fromIndex, toIndex + 1);
    const remainingStopsCount = toIndex - fromIndex;

    // Time estimation (average 35 km/h in city/suburban bus transit)
    const estimatedMinutes = Math.max(5, Math.ceil((distanceKm / 35) * 60));
    const etaDate = new Date(Date.now() + estimatedMinutes * 60 * 1000);
    const etaTimeFormatted = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      routeId: route.id,
      routeName: route.routeName,
      busType,
      currentStop: fromStop.name,
      destinationStop: toStop.name,
      distanceKm,
      fare: calculatedFare,
      remainingStopsCount,
      remainingStopsList,
      estimatedMinutes,
      etaTime: etaTimeFormatted,
    };
  }
}

module.exports = FareService;
