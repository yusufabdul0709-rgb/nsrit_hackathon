const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

router.post('/start', authenticateJWT, tripController.startTrip);
router.post('/end', authenticateJWT, tripController.endTrip);
router.patch('/current-stop', authenticateJWT, tripController.updateCurrentStop);
router.get('/active', tripController.getActiveTrip);
router.get('/:id', tripController.getActiveTrip);

module.exports = router;
