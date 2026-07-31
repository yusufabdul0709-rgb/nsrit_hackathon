// Initialize Socket.IO connection
const socket = io();

let map;
let busMarkers = {};

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadDashboardData();
  setupSocketListeners();
});

// Initialize Leaflet GPS Map centered at Visakhapatnam - Anakapalle route
function initMap() {
  map = L.map('map').setView([17.7231, 83.3012], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
}

// Fetch Admin Metrics from Backend REST API
async function loadDashboardData() {
  try {
    const res = await fetch('/api/admin/dashboard');
    const data = await res.json();

    if (data.success) {
      updateMetricsUI(data.metrics);
      renderActiveTripsTable(data.liveBuses || []);
      renderRecentTicketsTable(data.recentTickets || []);
      renderSyncQueueTable(data.pendingSyncQueue || []);
      updateMapMarkers(data.liveBuses || []);
    }
  } catch (err) {
    console.error('Error fetching admin metrics:', err);
  }
}

// Dynamically Update Header Metrics Cards (starting from 0)
function updateMetricsUI(metrics) {
  document.getElementById('todaysRevenue').innerText = `₹${metrics.todaysRevenue || 0}`;
  document.getElementById('revenueSub').innerText = `₹${metrics.todaysRevenue || 0} Online Total`;

  document.getElementById('activeBuses').innerText = metrics.activeTripsCount || 0;
  document.getElementById('tripsSub').innerText = `${metrics.todaysTrips || 0} Total Trips Started`;

  document.getElementById('totalPassengers').innerText = metrics.passengerCount || 0;

  document.getElementById('onlineConductors').innerText = metrics.onlineConductorsCount || 0;
  document.getElementById('offlineConductorsSub').innerText = `${metrics.offlineConductorsCount || 0} Offline`;

  document.getElementById('pendingSyncCount').innerText = metrics.pendingSyncCount || 0;
  document.getElementById('syncQueueBadge').innerText = metrics.pendingSyncCount || 0;
}

// Render Active Trips Table
function renderActiveTripsTable(buses) {
  const tbody = document.getElementById('activeTripsTableBody');
  if (!buses || buses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No active trips currently. Waiting for Conductor to start session.</td></tr>`;
    return;
  }

  tbody.innerHTML = buses.map(b => `
    <tr>
      <td><strong>${b.busNumber}</strong></td>
      <td>${b.routeName}</td>
      <td><span class="badge badge-active">${b.currentStop}</span></td>
      <td>₹${b.totalCollection || 0}</td>
      <td>${b.passengerCount || 0}</td>
      <td>${b.pendingSyncCount || 0}</td>
      <td><span class="badge badge-active">${b.status}</span></td>
    </tr>
  `).join('');
}

// Render Recent Tickets Table
function renderRecentTicketsTable(tickets) {
  const tbody = document.getElementById('ticketsTableBody');
  if (!tickets || tickets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No ticket transactions issued yet. Scan QR in Passenger App to generate tickets.</td></tr>`;
    return;
  }

  tbody.innerHTML = tickets.map(t => `
    <tr>
      <td><strong>${t.ticketId}</strong></td>
      <td>${t.tripId}</td>
      <td>${t.currentStop} → ${t.destinationStop}</td>
      <td>₹${t.fare}</td>
      <td>${t.paymentMode}</td>
      <td><span class="badge ${t.paymentStatus === 'SUCCESS' ? 'badge-active' : 'badge-pending'}">${t.paymentStatus}</span></td>
    </tr>
  `).join('');
}

// Render Pending Sync Queue Table
function renderSyncQueueTable(queue) {
  const tbody = document.getElementById('syncTableBody');
  if (!queue || queue.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">Offline queue clean. All transactions fully synchronized.</td></tr>`;
    return;
  }

  tbody.innerHTML = queue.map(q => `
    <tr>
      <td><strong>${q.localOfflineId || q.ticketId}</strong></td>
      <td>${q.tripId}</td>
      <td>${q.passengerName || 'Passenger'}</td>
      <td>₹${q.fare}</td>
      <td><span class="badge badge-pending">PENDING SYNC</span></td>
    </tr>
  `).join('');
}

// Update Bus Markers on Leaflet Map
function updateMapMarkers(buses) {
  buses.forEach(b => {
    const { busNumber, lat, lng, currentStop, routeName } = b;
    if (!lat || !lng) return;

    if (busMarkers[busNumber]) {
      busMarkers[busNumber].setLatLng([lat, lng]);
      busMarkers[busNumber].setPopupContent(`<b>Bus ${busNumber}</b><br>${routeName}<br>Current Stop: ${currentStop}`);
    } else {
      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(`<b>Bus ${busNumber}</b><br>${routeName}<br>Current Stop: ${currentStop}`);
      busMarkers[busNumber] = marker;
    }
  });
}

// Manual Offline Queue Sync Trigger
async function syncOfflineTransactions() {
  try {
    const res = await fetch('/api/payment/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offlineItems: [] })
    });
    const data = await res.json();
    if (data.success) {
      alert(`Sync Complete! ${data.result.syncedCount} transactions processed.`);
      loadDashboardData();
    }
  } catch (e) {
    alert('Sync request failed: ' + e.message);
  }
}

// Socket.IO Real-Time Event Handlers
function setupSocketListeners() {
  socket.on('connect', () => {
    document.getElementById('statusText').innerText = 'System Live & Connected';
  });

  socket.on('disconnect', () => {
    document.getElementById('statusText').innerText = 'Reconnecting...';
  });

  socket.on('tripStarted', (data) => {
    console.log('⚡ Socket Event: tripStarted', data);
    loadDashboardData();
  });

  socket.on('paymentCompleted', (data) => {
    console.log('⚡ Socket Event: paymentCompleted', data);
    loadDashboardData();
  });

  socket.on('paymentPending', (data) => {
    console.log('⚡ Socket Event: paymentPending', data);
    loadDashboardData();
  });

  socket.on('locationUpdated', (data) => {
    if (data.busNumber && data.lat && data.lng) {
      updateMapMarkers([{ busNumber: data.busNumber, lat: data.lat, lng: data.lng, currentStop: data.currentStop, routeName: data.routeName || 'Visakhapatnam Route' }]);
    }
  });

  socket.on('syncCompleted', (data) => {
    console.log('⚡ Socket Event: syncCompleted', data);
    loadDashboardData();
  });
}
