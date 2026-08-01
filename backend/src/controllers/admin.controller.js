const { dbStore } = require('../config/db');

// Extended dynamic admin data stores
if (!dbStore.passengers) {
  dbStore.passengers = [
    { id: 'PAS-8721', name: 'Yusuf Abdul', phone: '+91 9876543210', kycStatus: 'VERIFIED', walletBalance: 820, creditUsed: 150, creditLimit: 500, tripsCount: 52, riskScore: 'Low', status: 'ACTIVE', pinLocked: false },
    { id: 'PAS-8722', name: 'Srinivas Rao', phone: '+91 9876543211', kycStatus: 'VERIFIED', walletBalance: 450, creditUsed: 0, creditLimit: 500, tripsCount: 38, riskScore: 'Low', status: 'ACTIVE', pinLocked: false },
    { id: 'PAS-8723', name: 'Kavitha P', phone: '+91 9876543212', kycStatus: 'PENDING', walletBalance: 120, creditUsed: 320, creditLimit: 500, tripsCount: 19, riskScore: 'Medium', status: 'ACTIVE', pinLocked: false },
    { id: 'PAS-8724', name: 'Ramesh V', phone: '+91 9876543213', kycStatus: 'SUSPECTED', walletBalance: 0, creditUsed: 490, creditLimit: 500, tripsCount: 14, riskScore: 'High', status: 'SUSPENDED', pinLocked: true }
  ];
}

if (!dbStore.etmDevices) {
  dbStore.etmDevices = [
    { deviceId: 'ETM-VSP-001', conductorId: 'C-24568', busNumber: 'AP 31 TB 4567', battery: 88, network: '4G LTE', lastSync: '2 mins ago', firmwareVersion: 'v2.4.1', storageUsed: '42%', gpsStatus: 'ACTIVE', status: 'ONLINE', isLocked: false },
    { deviceId: 'ETM-VSP-002', conductorId: 'C-24569', busNumber: 'AP 31 TB 8899', battery: 64, network: '3G', lastSync: '5 mins ago', firmwareVersion: 'v2.4.1', storageUsed: '58%', gpsStatus: 'ACTIVE', status: 'ONLINE', isLocked: false },
    { deviceId: 'ETM-VSP-003', conductorId: 'C-24570', busNumber: 'AP 31 TB 1122', battery: 15, network: 'OFFLINE', lastSync: '45 mins ago', firmwareVersion: 'v2.3.9', storageUsed: '85%', gpsStatus: 'DEGRADED', status: 'OFFLINE', isLocked: false }
  ];
}

if (!dbStore.fareConfig) {
  dbStore.fareConfig = [
    { serviceType: 'Pallevelugu', baseFare: 15, perKmRate: 1.2, gstPercent: 0, nightCharge: 0, tollCharge: 5 },
    { serviceType: 'Express', baseFare: 25, perKmRate: 1.8, gstPercent: 5, nightCharge: 10, tollCharge: 15 },
    { serviceType: 'Ultra Deluxe', baseFare: 35, perKmRate: 2.2, gstPercent: 5, nightCharge: 15, tollCharge: 20 },
    { serviceType: 'Super Luxury', baseFare: 45, perKmRate: 2.8, gstPercent: 5, nightCharge: 20, tollCharge: 25 },
    { serviceType: 'Garuda AC', baseFare: 75, perKmRate: 3.5, gstPercent: 12, nightCharge: 25, tollCharge: 40 },
    { serviceType: 'Electric Bus', baseFare: 30, perKmRate: 2.0, gstPercent: 5, nightCharge: 10, tollCharge: 10 }
  ];
}

if (!dbStore.securityLogs) {
  dbStore.securityLogs = [
    { id: 'SEC-101', timestamp: new Date().toISOString(), eventType: 'FAKE_QR_ATTEMPT', source: 'ETM-VSP-003', ipAddress: '192.168.1.45', severity: 'HIGH', status: 'BLOCKED', description: 'Invalid HMAC signature on scanned offline token' },
    { id: 'SEC-102', timestamp: new Date(Date.now() - 3600000).toISOString(), eventType: 'FAILED_LOGIN', source: 'Admin Portal', ipAddress: '49.207.12.98', severity: 'LOW', status: 'LOGGED', description: 'Failed password attempt for admin user' },
    { id: 'SEC-103', timestamp: new Date(Date.now() - 7200000).toISOString(), eventType: 'REPLAY_ATTACK', source: 'PAS-8724', ipAddress: '106.51.34.12', severity: 'CRITICAL', status: 'MITIGATED', description: 'Attempted reuse of expired sliding-window QR token' }
  ];
}

if (!dbStore.aiFraudAlerts) {
  dbStore.aiFraudAlerts = [
    { alertId: 'ALT-901', timestamp: new Date().toISOString(), type: 'TOKEN_SPIKE', target: 'PAS-8724', trigger: '150 Offline Tokens generated in 10 minutes', riskLevel: 'CRITICAL', recommendation: 'Suspend wallet & revoke QR certs', actionTaken: 'AUTO_SUSPENDED' },
    { alertId: 'ALT-902', timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'QR_CLONING', target: 'QR-TOKEN-400D-88', trigger: 'Same QR token scanned on 3 buses in 2 mins', riskLevel: 'HIGH', recommendation: 'Blacklist token & alert conductors', actionTaken: 'TOKEN_BLACKLISTED' }
  ];
}

if (!dbStore.complaints) {
  dbStore.complaints = [
    { ticketId: 'CMP-501', passengerName: 'Srinivas Rao', category: 'Wrong Fare', issue: 'Overcharged ₹15 on Route 400D Express', status: 'OPEN', priority: 'MEDIUM', createdAt: 'Today, 10:15 AM', assignedTo: 'Support Agent 2' },
    { ticketId: 'CMP-502', passengerName: 'Kavitha P', category: 'Wallet Recharge', issue: 'UPI amount debited but wallet not credited', status: 'IN_PROGRESS', priority: 'HIGH', createdAt: 'Yesterday, 04:30 PM', assignedTo: 'Finance Ops' }
  ];
}

if (!dbStore.systemConfig) {
  dbStore.systemConfig = {
    walletLimitMax: 5000,
    creditLimitMax: 1000,
    offlineTokenExpiryMins: 5,
    qrValidityMins: 5,
    maxOfflineTxnAmount: 500,
    aiFraudSensitivity: 'HIGH',
    autoFreezeOnFraud: true,
    upiProvider: 'NPCI_BHIM_APSRTC',
    gatewayMode: 'PRODUCTION'
  };
}

if (!dbStore.auditLogs) {
  dbStore.auditLogs = [
    { id: 'LOG-001', timestamp: '10:35 AM', actor: 'Admin (System)', action: 'UPDATE_FARE', details: 'Express Fare per km adjusted to ₹1.80' },
    { id: 'LOG-002', timestamp: '11:10 AM', actor: 'Admin (Security)', action: 'BLOCK_PASSENGER', details: 'Passenger ID PAS-8724 suspended due to AI Fraud Flag' },
    { id: 'LOG-003', timestamp: '12:45 PM', actor: 'Admin (Ops)', action: 'UPDATE_ROUTE', details: 'Route 400D stops updated with new fare stage at NAD Junction' }
  ];
}

// 1. Core Metrics & Live Overview
exports.getDashboardMetrics = async (req, res) => {
  try {
    const activeTrips = dbStore.trips.filter((t) => t.status === 'ACTIVE');
    const completedTrips = dbStore.trips.filter((t) => t.status === 'COMPLETED');

    const totalRevenue = dbStore.analytics.totalRevenue || 0;
    const totalPassengers = dbStore.analytics.totalPassengers || 0;
    const pendingSyncCount = dbStore.offlineQueue.length;

    const onlineConductors = activeTrips.length;
    const offlineConductors = Math.max(0, dbStore.conductors.length - onlineConductors);

    const liveBuses = activeTrips.map((t) => ({
      tripId: t.tripId,
      busNumber: t.busNumber,
      routeName: t.routeName,
      conductorName: t.conductorName,
      currentStop: t.currentStop,
      lat: t.gpsLocation?.lat || 17.7231,
      lng: t.gpsLocation?.lng || 83.3012,
      speed: t.gpsLocation?.speed || 0,
      passengerCount: t.passengerCount || 0,
      totalCollection: t.totalCollection || 0,
      status: t.status,
    }));

    return res.status(200).json({
      success: true,
      metrics: {
        todaysRevenue: totalRevenue,
        todaysTrips: dbStore.trips.length,
        activeTripsCount: activeTrips.length,
        completedTripsCount: completedTrips.length,
        passengerCount: totalPassengers,
        onlineConductorsCount: onlineConductors,
        offlineConductorsCount: offlineConductors,
        pendingSyncCount,
        liveBusesCount: liveBuses.length,
        offlineTokensToday: 3502,
        settledTokensToday: 3331,
        failedTokensCount: 8
      },
      liveBuses,
      pendingSyncQueue: dbStore.offlineQueue,
      recentTickets: dbStore.tickets.slice(-10).reverse(),
      analytics: dbStore.analytics,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Passenger & KYC Management
exports.getPassengers = async (req, res) => {
  res.json({ success: true, passengers: dbStore.passengers });
};

exports.updatePassengerStatus = async (req, res) => {
  const { id } = req.params;
  const { status, pinLocked, creditLimit } = req.body;
  const passenger = dbStore.passengers.find((p) => p.id === id);
  if (!passenger) return res.status(404).json({ success: false, message: 'Passenger not found' });
  if (status) passenger.status = status;
  if (pinLocked !== undefined) passenger.pinLocked = pinLocked;
  if (creditLimit !== undefined) passenger.creditLimit = creditLimit;
  
  dbStore.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: 'Admin (System)',
    action: 'UPDATE_PASSENGER',
    details: `Updated passenger ${id} - Status: ${passenger.status}`
  });

  res.json({ success: true, passenger });
};

// 3. Wallet Management & Transactions
exports.getWallets = async (req, res) => {
  const totalWalletBalances = dbStore.passengers.reduce((sum, p) => sum + p.walletBalance, 0);
  const totalCreditUsed = dbStore.passengers.reduce((sum, p) => sum + p.creditUsed, 0);
  res.json({
    success: true,
    totalWalletBalances,
    totalCreditUsed,
    passengers: dbStore.passengers
  });
};

exports.manageWalletFunds = async (req, res) => {
  const { passengerId, type, amount, reason } = req.body;
  const passenger = dbStore.passengers.find((p) => p.id === passengerId);
  if (!passenger) return res.status(404).json({ success: false, message: 'Passenger not found' });
  
  const numAmount = Number(amount) || 0;
  if (type === 'CREDIT') passenger.walletBalance += numAmount;
  if (type === 'DEBIT') passenger.walletBalance = Math.max(0, passenger.walletBalance - numAmount);
  
  dbStore.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: 'Admin (Finance)',
    action: `WALLET_${type}`,
    details: `Admin ${type} ₹${numAmount} for ${passengerId} (${reason || 'Manual Adjustment'})`
  });

  res.json({ success: true, message: `Wallet ${type} successful`, walletBalance: passenger.walletBalance });
};

// 4. Offline Token Tracking & Settlement Status
exports.getOfflineTokens = async (req, res) => {
  res.json({
    success: true,
    tokensGeneratedToday: 3502,
    pendingSettlement: dbStore.offlineQueue.length + 163,
    successfullySettled: 3331,
    failedSettlement: 8,
    tokensQueue: dbStore.offlineQueue
  });
};

// 5. Conductor & Duty Management
exports.getConductors = async (req, res) => {
  res.json({ success: true, conductors: dbStore.conductors });
};

// 6. ETM Device Management
exports.getEtmDevices = async (req, res) => {
  res.json({ success: true, devices: dbStore.etmDevices });
};

exports.toggleEtmLock = async (req, res) => {
  const { deviceId } = req.params;
  const device = dbStore.etmDevices.find((d) => d.deviceId === deviceId);
  if (!device) return res.status(404).json({ success: false, message: 'Device not found' });
  device.isLocked = !device.isLocked;
  
  dbStore.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: 'Admin (Ops)',
    action: 'ETM_LOCK_TOGGLE',
    details: `Device ${deviceId} set to locked: ${device.isLocked}`
  });

  res.json({ success: true, device });
};

// 7. Route Management
exports.getRoutes = async (req, res) => {
  res.json({ success: true, routes: dbStore.routes });
};

// 8. Fare Management Engine
exports.getFareConfig = async (req, res) => {
  res.json({ success: true, fareConfig: dbStore.fareConfig });
};

exports.updateFareConfig = async (req, res) => {
  const { serviceType, baseFare, perKmRate, gstPercent, nightCharge, tollCharge } = req.body;
  const item = dbStore.fareConfig.find((f) => f.serviceType === serviceType);
  if (item) {
    if (baseFare !== undefined) item.baseFare = Number(baseFare);
    if (perKmRate !== undefined) item.perKmRate = Number(perKmRate);
    if (gstPercent !== undefined) item.gstPercent = Number(gstPercent);
    if (nightCharge !== undefined) item.nightCharge = Number(nightCharge);
    if (tollCharge !== undefined) item.tollCharge = Number(tollCharge);
  } else {
    dbStore.fareConfig.push({ serviceType, baseFare, perKmRate, gstPercent, nightCharge, tollCharge });
  }

  dbStore.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: 'Admin (Fare Engine)',
    action: 'UPDATE_FARE_STAGE',
    details: `Fare updated for service ${serviceType}`
  });

  res.json({ success: true, fareConfig: dbStore.fareConfig });
};

// 9. Security Dashboard
exports.getSecurityLogs = async (req, res) => {
  res.json({ success: true, logs: dbStore.securityLogs });
};

// 10. AI Fraud Detection Alerts
exports.getAiFraudAlerts = async (req, res) => {
  res.json({ success: true, alerts: dbStore.aiFraudAlerts });
};

// 11. Complaints & Support Management
exports.getComplaints = async (req, res) => {
  res.json({ success: true, complaints: dbStore.complaints });
};

exports.updateComplaint = async (req, res) => {
  const { ticketId } = req.params;
  const { status, assignedTo } = req.body;
  const complaint = dbStore.complaints.find((c) => c.ticketId === ticketId);
  if (complaint) {
    if (status) complaint.status = status;
    if (assignedTo) complaint.assignedTo = assignedTo;
  }
  res.json({ success: true, complaint });
};

// 12. System Configuration & Audit Logs
exports.getSystemConfig = async (req, res) => {
  res.json({ success: true, config: dbStore.systemConfig, auditLogs: dbStore.auditLogs });
};

exports.updateSystemConfig = async (req, res) => {
  dbStore.systemConfig = { ...dbStore.systemConfig, ...req.body };
  dbStore.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: 'Admin (System)',
    action: 'UPDATE_CONFIG',
    details: 'System threshold parameters updated'
  });
  res.json({ success: true, config: dbStore.systemConfig });
};

exports.getRevenueAnalytics = async (req, res) => {
  const onlineTotal = dbStore.tickets
    .filter((t) => t.paymentStatus === 'SUCCESS')
    .reduce((sum, t) => sum + (t.fare || 0), 0);

  const pendingTotal = dbStore.offlineQueue.reduce((sum, q) => sum + (Number(q.fare) || 0), 0);

  return res.status(200).json({
    success: true,
    revenue: {
      total: onlineTotal,
      onlineUPI: Math.round(onlineTotal * 0.42),
      offlineWallet: Math.round(onlineTotal * 0.38),
      cash: Math.round(onlineTotal * 0.15),
      credit: Math.round(onlineTotal * 0.05),
      pendingSyncValue: pendingTotal,
      ticketBreakdown: {
        onlineCount: dbStore.analytics.onlineTicketsCount,
        pendingSyncCount: dbStore.offlineQueue.length,
      },
    },
  });
};

exports.getTrips = async (req, res) => {
  return res.status(200).json({
    success: true,
    count: dbStore.trips.length,
    trips: dbStore.trips,
  });
};

exports.getAnalytics = async (req, res) => {
  return res.status(200).json({
    success: true,
    analytics: dbStore.analytics,
    syncLogs: dbStore.syncLogs,
  });
};

// ─── Conductor Approvals ───
exports.getPendingConductors = async (req, res) => {
  try {
    let pending = [];
    
    // Check MongoDB if connected
    let mongoose = null;
    let User = null;
    try {
      mongoose = require('mongoose');
      User = require('../models/User');
    } catch(e) {}
    
    if (User && mongoose && mongoose.connection && mongoose.connection.readyState === 1) {
      pending = await User.find({ role: 'conductor', isApproved: false }).select('-password');
    } else {
      // Fallback in-memory
      pending = dbStore.users.filter(u => u.role === 'conductor' && u.isApproved === false);
    }
    
    return res.status(200).json({ success: true, pending });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveConductor = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check MongoDB if connected
    let mongoose = null;
    let User = null;
    try {
      mongoose = require('mongoose');
      User = require('../models/User');
    } catch(e) {}
    
    if (User && mongoose && mongoose.connection && mongoose.connection.readyState === 1) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'Conductor not found' });
      
      user.isApproved = true;
      await user.save();
    } else {
      // Fallback in-memory
      const user = dbStore.users.find(u => u.id === id || u._id === id);
      if (!user) return res.status(404).json({ success: false, message: 'Conductor not found' });
      
      user.isApproved = true;
    }
    
    return res.status(200).json({ success: true, message: 'Conductor approved successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

