const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/dashboard', adminController.getDashboardMetrics);
router.get('/revenue', adminController.getRevenueAnalytics);
router.get('/trips', adminController.getTrips);
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
