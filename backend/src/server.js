const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();

const { connectDB, dbStore } = require('./config/db');
const routes = require('./routes');
const csvDataService = require('./services/csvData.service');
const NotificationService = require('./services/notification.service');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

// Attach Socket.IO to Notification Service
NotificationService.setSocketIO(io);

// Connect to Database (MongoDB or dynamic store)
connectDB();

// Load CSV Data if present
try {
  csvDataService.loadCSVData();
} catch (e) {
  console.log('CSV loader skipped or not present.');
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Inject io into request context for controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Main REST API Router
app.use('/api', routes);

// Serve Admin Dashboard statically from root admin_dashboard folder
app.use('/admin', express.static(path.join(__dirname, '../../admin_dashboard')));

// =========================================================
// Real-Time Socket.IO Hub & Event Management
// =========================================================
io.on('connection', (socket) => {
  console.log(`⚡ Socket Client Connected: ${socket.id}`);

  // Send initial active state to newly connected client
  socket.emit('initialState', {
    activeTrips: dbStore.trips.filter((t) => t.status === 'ACTIVE'),
    analytics: dbStore.analytics,
    pendingSyncCount: dbStore.offlineQueue.length,
  });

  // Handle all 15 required Socket events
  socket.on('tripStarted', (data) => {
    console.log('📡 Event: tripStarted', data?.tripId);
    io.emit('tripStarted', data);
  });

  socket.on('tripEnded', (data) => {
    console.log('📡 Event: tripEnded', data?.tripId);
    io.emit('tripEnded', data);
  });

  socket.on('qrGenerated', (data) => {
    io.emit('qrGenerated', data);
  });

  socket.on('qrScanned', (data) => {
    io.emit('qrScanned', data);
  });

  socket.on('destinationSelected', (data) => {
    io.emit('destinationSelected', data);
  });

  socket.on('fareCalculated', (data) => {
    io.emit('fareCalculated', data);
  });

  socket.on('paymentInitiated', (data) => {
    io.emit('paymentInitiated', data);
  });

  socket.on('paymentCompleted', (data) => {
    console.log('💰 Event: paymentCompleted', data?.ticketId);
    io.emit('paymentCompleted', data);
  });

  socket.on('paymentPending', (data) => {
    console.log('⏳ Event: paymentPending', data?.ticketId);
    io.emit('paymentPending', data);
  });

  socket.on('ticketGenerated', (data) => {
    io.emit('ticketGenerated', data);
  });

  socket.on('locationUpdated', (data) => {
    io.emit('locationUpdated', data);
  });

  socket.on('notificationReceived', (data) => {
    io.emit('notificationReceived', data);
  });

  socket.on('syncStarted', (data) => {
    io.emit('syncStarted', data);
  });

  socket.on('syncCompleted', (data) => {
    console.log('🔄 Event: syncCompleted', data?.syncedCount);
    io.emit('syncCompleted', data);
  });

  socket.on('tripCompleted', (data) => {
    io.emit('tripCompleted', data);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket Client Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================`);
  console.log(`🚀 BusOne Backend Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Socket.IO Real-time Hub Active & Listening`);
  console.log(`📊 Admin Dashboard available at http://localhost:${PORT}/admin`);
  console.log(`=================================================`);
});
