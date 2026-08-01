let mongoose = null;
try {
  mongoose = require('mongoose');
} catch (e) {
  // Mongoose optional fallback
}

// Dynamic Data Store in memory/file-backed if MongoDB Atlas URL not provided
class DataStore {
  constructor() {
    this.users = [];
    this.passengers = [];
    this.conductors = [];
    this.drivers = [];
    this.buses = [];
    this.trips = [];
    this.routes = [
      {
        id: 'ROUTE-VSP-AKP-400D',
        routeName: 'Visakhapatnam → Anakapalle',
        routeNumber: '400D',
        busType: 'Express',
        stops: [
          { name: 'RTC Complex', lat: 17.7231, lng: 83.3012, kmFromStart: 0, schedArr: '10:00 AM' },
          { name: 'Maddilapalem', lat: 17.7340, lng: 83.3175, kmFromStart: 5, schedArr: '10:15 AM' },
          { name: 'NAD Junction', lat: 17.7490, lng: 83.2450, kmFromStart: 16, schedArr: '10:35 AM' },
          { name: 'Gajuwaka', lat: 17.6900, lng: 83.2100, kmFromStart: 28, schedArr: '11:00 AM' },
          { name: 'Kurmannapalem', lat: 17.6750, lng: 83.1800, kmFromStart: 38, schedArr: '11:20 AM' },
          { name: 'Anakapalle', lat: 17.6895, lng: 83.0024, kmFromStart: 55, schedArr: '11:50 AM' },
        ]
      },
      {
        id: 'ROUTE-VSP-VZM-300A',
        routeName: 'Visakhapatnam → Vizianagaram',
        routeNumber: '300A',
        busType: 'Ultra Deluxe',
        stops: [
          { name: 'RTC Complex', lat: 17.7231, lng: 83.3012, kmFromStart: 0, schedArr: '08:00 AM' },
          { name: 'Hanumanthawaka', lat: 17.7612, lng: 83.3321, kmFromStart: 9, schedArr: '08:20 AM' },
          { name: 'Tagarapuvalasa', lat: 17.9234, lng: 83.4215, kmFromStart: 32, schedArr: '09:00 AM' },
          { name: 'Vizianagaram RTC', lat: 18.1123, lng: 83.3987, kmFromStart: 58, schedArr: '09:45 AM' },
        ]
      }
    ];
    this.tickets = [];
    this.payments = [];
    this.receipts = [];
    this.notifications = [];
    this.offlineQueue = [];
    this.syncLogs = [];
    this.gpsLogs = [];
    this.analytics = {
      totalRevenue: 0,
      totalPassengers: 0,
      totalTripsStarted: 0,
      totalTripsCompleted: 0,
      onlineTicketsCount: 0,
      pendingSyncCount: 0,
    };
  }
}

const dbStore = new DataStore();

const connectDB = async () => {
  // Support both env key names
  const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (mongoURI && mongoose) {
    try {
      try {
        const dns = require('dns');
        dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
      } catch (dnsErr) {}

      await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ MongoDB Atlas connected successfully.');
    } catch (err) {
      console.warn('⚠️ MongoDB connection failed. Falling back to dynamic store:', err.message);
    }
  } else {
    console.log('ℹ️ MONGODB_URI not set or Mongoose not installed. Using in-memory dynamic store.');
  }
};

module.exports = { connectDB, dbStore };
