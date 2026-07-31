const { dbStore } = require('../config/db');

exports.getRoutes = async (req, res) => {
  return res.status(200).json({
    success: true,
    count: dbStore.routes.length,
    routes: dbStore.routes,
  });
};

exports.getRouteById = async (req, res) => {
  const { id } = req.params;
  const route = dbStore.routes.find((r) => r.id === id || r.routeNumber === id) || dbStore.routes[0];

  if (!route) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }

  return res.status(200).json({ success: true, route });
};

exports.getRouteStops = async (req, res) => {
  const { id } = req.params;
  const route = dbStore.routes.find((r) => r.id === id || r.routeNumber === id) || dbStore.routes[0];

  if (!route) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }

  return res.status(200).json({
    success: true,
    routeId: route.id,
    routeName: route.routeName,
    stops: route.stops,
  });
};
