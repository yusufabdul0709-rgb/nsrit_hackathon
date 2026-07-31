const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const routes = require('./routes');
const csvDataService = require('./services/csvData.service');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Load CSV Data into memory
csvDataService.loadCSVData();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Main API Router
app.use('/api', routes);

// ============================================
// GPS-Accurate Bus Route Coordinates
// Visakhapatnam - Anakapalle Route
// ============================================
const ROUTE_STOPS = [
  { name: 'RTC Complex', lat: 17.7231, lng: 83.3012, schedArr: '10:00 AM' },
  { name: 'Maddilapalem', lat: 17.7340, lng: 83.3175, schedArr: '10:15 AM' },
  { name: 'NAD Junction', lat: 17.7490, lng: 83.2450, schedArr: '10:35 AM' },
  { name: 'Gajuwaka', lat: 17.6900, lng: 83.2100, schedArr: '11:00 AM' },
  { name: 'Kurmannapalem', lat: 17.6750, lng: 83.1800, schedArr: '11:20 AM' },
  { name: 'Anakapalle', lat: 17.6895, lng: 83.0024, schedArr: '11:50 AM' },
];

// Generate interpolated points between stops for smooth animation
function interpolateRoute(stops) {
  const points = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i];
    const to = stops[i + 1];
    const segments = 20; // 20 intermediate points per segment
    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      points.push({
        lat: from.lat + (to.lat - from.lat) * t,
        lng: from.lng + (to.lng - from.lng) * t,
        nearestStopIndex: i,
        segmentProgress: t,
      });
    }
  }
  return points;
}

const ROUTE_POINTS = interpolateRoute(ROUTE_STOPS);

// Socket.io for Live Tracking
io.on('connection', (socket) => {
  console.log('🔌 Client connected for Live Tracking:', socket.id);

  let pointIndex = 0;
  
  const trackingInterval = setInterval(() => {
    const point = ROUTE_POINTS[pointIndex % ROUTE_POINTS.length];
    const currentStopIdx = point.nearestStopIndex;
    const nextStopIdx = Math.min(currentStopIdx + 1, ROUTE_STOPS.length - 1);
    const overallProgress = (pointIndex / (ROUTE_POINTS.length - 1)) * 100;

    // AI Mock Logic
    const randomDelay = Math.floor(Math.random() * 5);
    const crowdLevels = ['Low', 'Medium', 'High'];
    const crowdLevel = crowdLevels[Math.floor(Math.random() * crowdLevels.length)];
    const speeds = [28, 32, 45, 38, 55, 42, 35, 50];
    const speed = speeds[Math.floor(Math.random() * speeds.length)];
    
    let aiRecommendation = 'Smooth traffic ahead.';
    if (randomDelay > 2) {
      aiRecommendation = 'AI predicts traffic congestion. Consider alternate route.';
    } else if (crowdLevel === 'High') {
      aiRecommendation = 'High crowd expected at next stop. Board from rear door.';
    }

    // Calculate heading (bearing) between current and next point
    const nextPointIdx = (pointIndex + 1) % ROUTE_POINTS.length;
    const nextPoint = ROUTE_POINTS[nextPointIdx];
    const heading = Math.atan2(
      nextPoint.lng - point.lng,
      nextPoint.lat - point.lat
    ) * (180 / Math.PI);

    const trackingData = {
      // GPS Data
      lat: point.lat,
      lng: point.lng,
      heading: heading,
      speed: speed,
      accuracy: 5 + Math.random() * 10,
      altitude: 14 + Math.random() * 5,

      // Bus Info
      busNumber: 'AP 31 TB 4567',
      vehicleNumber: 'AP 31 TB 4567',
      route: 'Visakhapatnam → Anakapalle',
      routeNumber: '400D',
      busType: 'Express',
      tripId: 'TRIP-2026-0731-001',

      // Crew
      driverName: 'Sri Ramesh K.',
      conductorName: 'Sri Venkatesh P.',
      driverStatus: 'Active',
      conductorStatus: 'Active',

      // Stop Info
      currentStop: ROUTE_STOPS[currentStopIdx].name,
      nextStop: ROUTE_STOPS[nextStopIdx].name,
      currentStopIndex: currentStopIdx,
      totalStops: ROUTE_STOPS.length,
      remainingStops: ROUTE_STOPS.length - 1 - currentStopIdx,

      // Timing
      etaToNext: `${5 + randomDelay} min`,
      etaToDestination: `${Math.max(5, Math.round((ROUTE_STOPS.length - 1 - currentStopIdx) * 15 - point.segmentProgress * 15))} min`,
      delay: randomDelay > 2 ? `+${randomDelay} min` : 'On Time',
      status: randomDelay > 2 ? 'delayed' : 'ontime',
      lastUpdated: new Date().toISOString(),

      // Progress
      progressPercent: overallProgress,
      distanceToDestination: `${Math.max(1, Math.round((1 - overallProgress / 100) * 72))} km`,

      // Occupancy
      occupancy: Math.floor(40 + Math.random() * 45),
      availableSeats: Math.floor(5 + Math.random() * 15),
      totalSeats: 52,

      // AI
      aiData: {
        crowdLevel,
        aiRecommendation,
        trafficLevel: randomDelay > 2 ? 'Heavy' : randomDelay > 1 ? 'Moderate' : 'Light',
        weatherCondition: 'Partly Cloudy, 32°C',
        predictionConfidence: `${85 + Math.floor(Math.random() * 12)}%`,
      },

      // Route coordinates for map
      routeStops: ROUTE_STOPS,
    };

    socket.emit('busLocationUpdate', trackingData);
    
    // Advance bus position (simulates real GPS updates)
    pointIndex = (pointIndex + 1) % ROUTE_POINTS.length;
  }, 2000); // Update every 2 seconds for smooth animation

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
    clearInterval(trackingInterval);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 APSRTC Smart Bus Server running on port ${PORT}`);
  console.log(`📡 Socket.io Live Tracking active`);
  console.log(`🗺️  Route: ${ROUTE_STOPS.map(s => s.name).join(' → ')}`);
});
