const express = require('express');
const router = express.Router();
const routeController = require('../controllers/route.controller');

router.get('/', routeController.getRoutes);
router.get('/:id', routeController.getRouteById);
router.get('/:id/stops', routeController.getRouteStops);

module.exports = router;
