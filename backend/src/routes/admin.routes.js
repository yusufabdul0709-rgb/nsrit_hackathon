const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Core Dashboard Overview & Metrics
router.get('/metrics', adminController.getDashboardMetrics);
router.get('/analytics', adminController.getAnalytics);
router.get('/revenue', adminController.getRevenueAnalytics);
router.get('/trips', adminController.getTrips);

// 20 Admin Modules Routes
router.get('/passengers', adminController.getPassengers);
router.patch('/passengers/:id', adminController.updatePassengerStatus);

router.get('/wallets', adminController.getWallets);
router.post('/wallets/funds', adminController.manageWalletFunds);

router.get('/offline-tokens', adminController.getOfflineTokens);

router.get('/conductors', adminController.getConductors);
router.get('/conductors/pending', adminController.getPendingConductors);
router.patch('/conductors/:id/approve', adminController.approveConductor);

router.get('/etm-devices', adminController.getEtmDevices);
router.post('/etm-devices/:deviceId/lock', adminController.toggleEtmLock);

router.get('/routes', adminController.getRoutes);

router.get('/fare-config', adminController.getFareConfig);
router.post('/fare-config', adminController.updateFareConfig);

router.get('/security-logs', adminController.getSecurityLogs);
router.get('/ai-fraud-alerts', adminController.getAiFraudAlerts);

router.get('/complaints', adminController.getComplaints);
router.patch('/complaints/:ticketId', adminController.updateComplaint);

router.get('/config', adminController.getSystemConfig);
router.post('/config', adminController.updateSystemConfig);

module.exports = router;
