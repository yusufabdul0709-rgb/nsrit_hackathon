import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  StatusBar, Modal, Dimensions, Platform, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import io from 'socket.io-client';
import { WebView } from 'react-native-webview';
import {
  ArrowLeft, MoreVertical, Clock, Share2, Bus, MapPin,
  Ticket, ChevronDown, ChevronUp, Users, Navigation, Gauge,
  Wifi, WifiOff, Zap, AlertTriangle, CloudSun
} from 'lucide-react-native';
import { MAPBOX_ACCESS_TOKEN, MOCK_BUS_STOPS } from '../config/mapbox';
import { API_BASE_URL } from '../config/api';

const { width, height } = Dimensions.get('window');

const DARK = {
  bg: '#0A0E1A',
  card: '#141825',
  cardLight: '#1C2137',
  border: '#2A3050',
  text: '#F1F5F9',
  textDim: '#8892B0',
  primary: '#3B82F6',
  accent: '#38BDF8',
  green: '#34D399',
  red: '#F87171',
  yellow: '#FBBF24',
  purple: '#A78BFA',
  orange: '#FB923C',
};

export default function LiveBusTrackingScreen({ navigation }) {
  const [trackingData, setTrackingData] = useState({
    busNumber: 'AP 31 TB 4567',
    route: '400D Express (RTC Complex → Anakapalle)',
    status: 'on_time',
    delay: 'On Time 🟢',
    currentStop: 'RTC Complex',
    nextStop: 'Maddilapalem',
    etaToNext: '4 mins',
    progressPercent: 40,
    lat: 17.7231,
    lng: 83.3012,
    speed: 42,
    heading: 180,
    passengerCount: 38,
    aiData: { crowdLevel: 'Medium', aiRecommendation: 'Next stop NAD has less crowd.' }
  });
  const [isConnected, setIsConnected] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const webViewRef = useRef(null);
  const sheetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const socket = io(API_BASE_URL);

    socket.on('connect', () => setIsConnected(true));
    socket.on('busLocationUpdate', (data) => {
      setTrackingData(data);
      // Send bus position to WebView map
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({
          type: 'updateBus',
          lat: data.lat,
          lng: data.lng,
          heading: data.heading,
          speed: data.speed,
          currentStop: data.currentStop,
          nextStop: data.nextStop,
        }));
      }
    });
    socket.on('disconnect', () => setIsConnected(false));

    return () => socket.disconnect();
  }, []);

  const toggleSheet = () => {
    const toValue = sheetExpanded ? 0 : 1;
    Animated.spring(sheetAnim, { toValue, useNativeDriver: false, tension: 40 }).start();
    setSheetExpanded(!sheetExpanded);
  };

  // Mapbox GL JS HTML for WebView
  const mapHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0A0E1A; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
    
    .bus-marker {
      width: 44px; height: 44px;
      background: linear-gradient(135deg, #3B82F6, #2563EB);
      border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 0 20px rgba(59,130,246,0.6), 0 4px 12px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
      transition: transform 0.5s ease;
      cursor: pointer;
    }
    
    .bus-pulse {
      position: absolute; width: 44px; height: 44px;
      border-radius: 50%;
      background: rgba(59,130,246,0.3);
      animation: pulse 2s ease-out infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2.5); opacity: 0; }
    }
    
    .stop-marker {
      width: 16px; height: 16px;
      background: #1C2137;
      border-radius: 50%;
      border: 3px solid #38BDF8;
      box-shadow: 0 0 8px rgba(56,189,248,0.4);
      cursor: pointer;
    }
    
    .stop-marker.passed { border-color: #34D399; background: #065F46; }
    .stop-marker.current { 
      border-color: #FBBF24; background: #92400E;
      width: 20px; height: 20px;
      box-shadow: 0 0 12px rgba(251,191,36,0.6);
    }
    
    .mapboxgl-popup-content {
      background: #141825 !important;
      color: #F1F5F9 !important;
      border-radius: 12px !important;
      padding: 12px 16px !important;
      border: 1px solid #2A3050 !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }
    .mapboxgl-popup-tip { border-top-color: #141825 !important; }
    .mapboxgl-popup-close-button { color: #8892B0 !important; font-size: 16px !important; }
    
    .popup-title { font-weight: 700; font-size: 14px; margin-bottom: 4px; }
    .popup-sub { font-size: 12px; color: #8892B0; }
    .popup-badge { 
      display: inline-block; padding: 2px 8px; border-radius: 6px; 
      font-size: 10px; font-weight: 700; margin-top: 6px;
    }
    .badge-live { background: rgba(59,130,246,0.2); color: #60A5FA; }
    .badge-eta { background: rgba(52,211,153,0.2); color: #34D399; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    mapboxgl.accessToken = '${MAPBOX_ACCESS_TOKEN}';
    
    const stops = ${JSON.stringify(MOCK_BUS_STOPS)};
    const coords = stops.map(s => [s.lng, s.lat]);

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [83.15, 17.71],
      zoom: 10.5,
      pitch: 45,
      bearing: -15,
      antialias: true
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');

    // Bus marker element
    const busContainer = document.createElement('div');
    busContainer.style.position = 'relative';
    
    const busPulse = document.createElement('div');
    busPulse.className = 'bus-pulse';
    busContainer.appendChild(busPulse);
    
    const busEl = document.createElement('div');
    busEl.className = 'bus-marker';
    busEl.innerHTML = '🚌';
    busContainer.appendChild(busEl);

    const busMarker = new mapboxgl.Marker({ element: busContainer, anchor: 'center' })
      .setLngLat(coords[0])
      .setPopup(new mapboxgl.Popup({ offset: 30 }).setHTML(
        '<div class="popup-title">🚌 AP 31 TB 4567</div>' +
        '<div class="popup-sub">Visakhapatnam → Anakapalle</div>' +
        '<span class="popup-badge badge-live">● LIVE</span>'
      ))
      .addTo(map);

    map.on('load', () => {
      // Completed route (will be updated)
      map.addSource('route-completed', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [coords[0]] } }
      });
      map.addLayer({
        id: 'route-completed', type: 'line', source: 'route-completed',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#34D399', 'line-width': 5, 'line-opacity': 0.9 }
      });

      // Remaining route
      map.addSource('route-remaining', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } }
      });
      map.addLayer({
        id: 'route-remaining', type: 'line', source: 'route-remaining',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#3B82F6', 'line-width': 5, 'line-opacity': 0.6, 'line-dasharray': [2, 2] }
      });

      // Route glow effect
      map.addLayer({
        id: 'route-glow', type: 'line', source: 'route-remaining',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#3B82F6', 'line-width': 14, 'line-opacity': 0.15 }
      }, 'route-remaining');

      // Stop markers
      stops.forEach((stop, i) => {
        const el = document.createElement('div');
        el.className = 'stop-marker';
        
        new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([stop.lng, stop.lat])
          .setPopup(new mapboxgl.Popup({ offset: 15 }).setHTML(
            '<div class="popup-title">' + stop.name + '</div>' +
            '<div class="popup-sub">Sched: ' + stop.schedArr + '</div>' +
            '<div class="popup-sub">' + stop.distance + ' from origin</div>' +
            '<span class="popup-badge badge-eta">Bay ' + stop.bay + '</span>'
          ))
          .addTo(map);
      });
    });

    // Track whether user has manually moved the map
    let isUserInteracting = false;
    let autoFollowTimeout = null;
    
    map.on('dragstart', () => { isUserInteracting = true; });
    map.on('dragend', () => {
      clearTimeout(autoFollowTimeout);
      autoFollowTimeout = setTimeout(() => { isUserInteracting = false; }, 8000);
    });

    // Listen for bus position updates from React Native
    document.addEventListener('message', function(event) {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'updateBus') {
          const newPos = [data.lng, data.lat];
          busMarker.setLngLat(newPos);
          
          // Rotate bus icon with heading
          if (data.heading) {
            busEl.style.transform = 'rotate(' + data.heading + 'deg)';
          }
          
          // Update completed route line
          const completedCoords = coords.filter(c => {
            return c[0] >= Math.min(coords[0][0], newPos[0]) || c[1] >= Math.min(coords[0][1], newPos[1]);
          }).filter(c => c[0] <= newPos[0] + 0.01);
          
          if (map.getSource('route-completed')) {
            const done = [];
            for (const c of coords) {
              done.push(c);
              if (Math.abs(c[0] - newPos[0]) < 0.02 && Math.abs(c[1] - newPos[1]) < 0.02) break;
            }
            done.push(newPos);
            map.getSource('route-completed').setData({
              type: 'Feature', properties: {},
              geometry: { type: 'LineString', coordinates: done }
            });
          }

          // Update stop markers appearance
          const stopEls = document.querySelectorAll('.stop-marker');
          stopEls.forEach((el, i) => {
            el.className = 'stop-marker';
            const stopCoord = coords[i];
            // Simple distance check
            const dist = Math.sqrt(Math.pow(stopCoord[0] - newPos[0], 2) + Math.pow(stopCoord[1] - newPos[1], 2));
            if (dist < 0.005) {
              el.classList.add('current');
            } else if (stopCoord[0] > newPos[0] + 0.01) {
              // upcoming - default style
            } else {
              el.classList.add('passed');
            }
          });

          // Camera follows bus smoothly
          if (!isUserInteracting) {
            map.easeTo({
              center: newPos,
              duration: 1500,
              essential: true
            });
          }
        }
      } catch(e) {}
    });

    // Also listen for window.ReactNativeWebView messages
    window.addEventListener('message', function(event) {
      document.dispatchEvent(new MessageEvent('message', { data: event.data }));
    });
  </script>
</body>
</html>`;

  const sheetHeight = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.42, height * 0.75],
  });

  if (!trackingData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={DARK.bg} />
        <View style={styles.loadingContainer}>
          <Bus color={DARK.primary} size={48} />
          <Text style={styles.loadingTitle}>Connecting to Live Radar...</Text>
          <Text style={styles.loadingSubtitle}>Searching for bus AP 31 TB 4567</Text>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? DARK.green : DARK.yellow }]} />
        </View>
      </SafeAreaView>
    );
  }

  const isDelayed = trackingData.status === 'delayed';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DARK.bg} />

      {/* === MAP SECTION (Top Half) === */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: mapHTML }}
          style={styles.mapWebView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.mapLoading}>
              <Text style={{ color: DARK.textDim }}>Loading Map...</Text>
            </View>
          )}
        />

        {/* Map overlay header */}
        <View style={styles.mapOverlayHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft color={DARK.text} size={22} />
          </TouchableOpacity>
          <View style={styles.connectionBadge}>
            {isConnected ? <Wifi color={DARK.green} size={12} /> : <WifiOff color={DARK.red} size={12} />}
            <Text style={[styles.connectionText, { color: isConnected ? DARK.green : DARK.red }]}>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </Text>
          </View>
        </View>

        {/* Speed indicator overlay */}
        <View style={styles.speedOverlay}>
          <Text style={styles.speedNumber}>{trackingData.speed}</Text>
          <Text style={styles.speedUnit}>km/h</Text>
        </View>
      </View>

      {/* === BOTTOM SHEET === */}
      <Animated.View style={[styles.bottomSheet, { height: sheetHeight }]}>
        {/* Sheet Handle */}
        <TouchableOpacity style={styles.sheetHandle} onPress={toggleSheet} activeOpacity={0.7}>
          <View style={styles.handleBar} />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* Bus Info Header */}
          <View style={styles.busInfoRow}>
            <View style={styles.busIconBadge}>
              <Bus color="#FFF" size={20} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.busTitle}>{trackingData.busNumber}</Text>
              <Text style={styles.busRoute}>{trackingData.route} • {trackingData.routeNumber}</Text>
            </View>
            <View style={[styles.statusChip, { backgroundColor: isDelayed ? 'rgba(248,113,113,0.15)' : 'rgba(52,211,153,0.15)' }]}>
              <View style={[styles.statusDotSmall, { backgroundColor: isDelayed ? DARK.red : DARK.green }]} />
              <Text style={[styles.statusChipText, { color: isDelayed ? DARK.red : DARK.green }]}>
                {trackingData.delay}
              </Text>
            </View>
          </View>

          {/* ETA Cards Row */}
          <View style={styles.etaRow}>
            <View style={[styles.etaCard, { borderColor: DARK.primary }]}>
              <Clock color={DARK.accent} size={16} />
              <Text style={styles.etaLabel}>Next Stop</Text>
              <Text style={styles.etaValue}>{trackingData.etaToNext}</Text>
              <Text style={styles.etaSub}>{trackingData.nextStop}</Text>
            </View>
            <View style={[styles.etaCard, { borderColor: DARK.green }]}>
              <Navigation color={DARK.green} size={16} />
              <Text style={styles.etaLabel}>Destination</Text>
              <Text style={styles.etaValue}>{trackingData.etaToDestination}</Text>
              <Text style={styles.etaSub}>{trackingData.distanceToDestination}</Text>
            </View>
            <View style={[styles.etaCard, { borderColor: DARK.purple }]}>
              <Users color={DARK.purple} size={16} />
              <Text style={styles.etaLabel}>Occupancy</Text>
              <Text style={styles.etaValue}>{trackingData.occupancy}%</Text>
              <Text style={styles.etaSub}>{trackingData.availableSeats} seats</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBarBg}>
              <Animated.View style={[styles.progressBarFill, { width: `${trackingData.progressPercent}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressStop}>{MOCK_BUS_STOPS[0].name}</Text>
              <Text style={styles.progressPercent}>{Math.round(trackingData.progressPercent)}%</Text>
              <Text style={styles.progressStop}>{MOCK_BUS_STOPS[MOCK_BUS_STOPS.length - 1].name}</Text>
            </View>
          </View>

          {/* AI Insight */}
          {trackingData.aiData && (
            <View style={styles.aiCard}>
              <View style={styles.aiHeader}>
                <Zap color={DARK.yellow} size={14} />
                <Text style={styles.aiTitle}>AI Prediction Engine</Text>
                <Text style={styles.aiConfidence}>{trackingData.aiData.predictionConfidence}</Text>
              </View>
              <Text style={styles.aiMessage}>{trackingData.aiData.aiRecommendation}</Text>
              <View style={styles.aiChipsRow}>
                <View style={styles.aiChip}>
                  <Users color={DARK.accent} size={10} />
                  <Text style={styles.aiChipText}>Crowd: {trackingData.aiData.crowdLevel}</Text>
                </View>
                <View style={styles.aiChip}>
                  <AlertTriangle color={DARK.orange} size={10} />
                  <Text style={styles.aiChipText}>Traffic: {trackingData.aiData.trafficLevel}</Text>
                </View>
                <View style={styles.aiChip}>
                  <CloudSun color={DARK.yellow} size={10} />
                  <Text style={styles.aiChipText}>{trackingData.aiData.weatherCondition}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Crew & Vehicle Info */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Driver</Text>
              <Text style={styles.infoValue}>{trackingData.driverName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Conductor</Text>
              <Text style={styles.infoValue}>{trackingData.conductorName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Trip ID</Text>
              <Text style={styles.infoValue}>{trackingData.tripId}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Bus Type</Text>
              <Text style={styles.infoValue}>{trackingData.busType}</Text>
            </View>
          </View>

          {/* Stops Timeline */}
          <Text style={styles.sectionTitle}>Route Timeline</Text>
          {MOCK_BUS_STOPS.map((stop, index) => {
            const isCurrent = index === trackingData.currentStopIndex;
            const isPassed = index < trackingData.currentStopIndex;

            return (
              <View key={stop.id} style={styles.timelineRow}>
                <View style={styles.timeCol}>
                  <Text style={[styles.timeText, isPassed && { color: DARK.textDim }]}>{stop.schedArr}</Text>
                  <Text style={[styles.liveTimeText, { color: isPassed ? DARK.textDim : DARK.red }]}>{stop.liveArr}</Text>
                </View>
                <View style={styles.nodeCol}>
                  {index < MOCK_BUS_STOPS.length - 1 && (
                    <View style={[styles.vLine, isPassed ? styles.vLinePassed : styles.vLineUpcoming]} />
                  )}
                  {isCurrent ? (
                    <View style={styles.currentNode}>
                      <Bus color="#FFF" size={12} />
                    </View>
                  ) : (
                    <View style={[styles.stopNode, isPassed && styles.stopNodePassed]} />
                  )}
                </View>
                <View style={styles.stopInfoCol}>
                  <Text style={[styles.stopNameText, isCurrent && { color: DARK.accent, fontWeight: '700' }]}>
                    {stop.name}
                  </Text>
                  <Text style={styles.stopDistText}>{stop.distance} • {stop.bay}</Text>
                </View>
              </View>
            );
          })}

          {/* Buy Ticket CTA */}
          <TouchableOpacity
            style={styles.buyTicketCTA}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Journey' })}
          >
            <Ticket color="#FFF" size={20} />
            <Text style={styles.buyTicketText}>Book Ticket for This Bus</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK.bg },
  
  // Loading
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingTitle: { color: DARK.text, fontSize: 18, fontWeight: '700', marginTop: 20 },
  loadingSubtitle: { color: DARK.textDim, fontSize: 14, marginTop: 8 },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginTop: 20 },

  // Map
  mapContainer: { flex: 1, position: 'relative' },
  mapWebView: { flex: 1, backgroundColor: DARK.bg },
  mapLoading: { 
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: DARK.bg, justifyContent: 'center', alignItems: 'center' 
  },
  
  // Map Overlays
  mapOverlayHeader: {
    position: 'absolute', top: Platform.OS === 'ios' ? 10 : 10,
    left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(10,14,26,0.8)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: DARK.border,
  },
  connectionBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(10,14,26,0.85)', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: DARK.border,
  },
  connectionText: { fontSize: 10, fontWeight: '800', marginLeft: 6, letterSpacing: 1 },
  
  speedOverlay: {
    position: 'absolute', bottom: 20, left: 16,
    backgroundColor: 'rgba(10,14,26,0.85)', paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 16, borderWidth: 1, borderColor: DARK.border,
    alignItems: 'center', minWidth: 70,
  },
  speedNumber: { color: DARK.text, fontSize: 24, fontWeight: '800' },
  speedUnit: { color: DARK.textDim, fontSize: 10, fontWeight: '600' },

  // Bottom Sheet
  bottomSheet: {
    backgroundColor: DARK.card,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderWidth: 1, borderBottomWidth: 0, borderColor: DARK.border,
    paddingHorizontal: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 20,
  },
  sheetHandle: { alignItems: 'center', paddingVertical: 12 },
  handleBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: DARK.border },

  // Bus Info
  busInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  busIconBadge: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: DARK.primary, justifyContent: 'center', alignItems: 'center',
  },
  busTitle: { color: DARK.text, fontSize: 18, fontWeight: '800' },
  busRoute: { color: DARK.textDim, fontSize: 12, marginTop: 2, fontWeight: '500' },
  statusChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
  },
  statusDotSmall: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusChipText: { fontSize: 11, fontWeight: '700' },

  // ETA Cards
  etaRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  etaCard: {
    flex: 1, backgroundColor: DARK.cardLight, borderRadius: 16,
    padding: 12, alignItems: 'center', borderWidth: 1,
  },
  etaLabel: { color: DARK.textDim, fontSize: 10, fontWeight: '600', marginTop: 6 },
  etaValue: { color: DARK.text, fontSize: 18, fontWeight: '800', marginTop: 2 },
  etaSub: { color: DARK.textDim, fontSize: 10, marginTop: 2 },

  // Progress
  progressSection: { marginBottom: 16 },
  progressBarBg: {
    height: 6, backgroundColor: DARK.cardLight, borderRadius: 3, overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%', backgroundColor: DARK.primary, borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 6,
  },
  progressStop: { color: DARK.textDim, fontSize: 10 },
  progressPercent: { color: DARK.accent, fontSize: 10, fontWeight: '700' },

  // AI Card
  aiCard: {
    backgroundColor: 'rgba(251,191,36,0.06)', borderRadius: 16,
    padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(251,191,36,0.15)',
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  aiTitle: { color: DARK.yellow, fontSize: 12, fontWeight: '700', marginLeft: 6, flex: 1 },
  aiConfidence: { color: DARK.green, fontSize: 10, fontWeight: '700' },
  aiMessage: { color: DARK.text, fontSize: 13, lineHeight: 18, marginBottom: 10 },
  aiChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  aiChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: DARK.cardLight, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8,
  },
  aiChipText: { color: DARK.textDim, fontSize: 10, fontWeight: '600', marginLeft: 4 },

  // Info Grid
  infoGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20,
  },
  infoItem: {
    width: '47%', backgroundColor: DARK.cardLight,
    borderRadius: 12, padding: 12,
  },
  infoLabel: { color: DARK.textDim, fontSize: 10, fontWeight: '600' },
  infoValue: { color: DARK.text, fontSize: 13, fontWeight: '700', marginTop: 4 },

  // Section Title
  sectionTitle: { color: DARK.text, fontSize: 16, fontWeight: '800', marginBottom: 16 },

  // Timeline
  timelineRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 0, minHeight: 56 },
  timeCol: { width: 70, alignItems: 'flex-end', paddingRight: 12 },
  timeText: { color: DARK.textDim, fontSize: 11, fontWeight: '600' },
  liveTimeText: { fontSize: 10, fontWeight: '500', marginTop: 2 },
  nodeCol: { width: 30, alignItems: 'center', position: 'relative' },
  vLine: { position: 'absolute', width: 2, top: 20, bottom: -36, left: 14 },
  vLinePassed: { backgroundColor: DARK.green },
  vLineUpcoming: { backgroundColor: DARK.border },
  stopNode: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: DARK.bg, borderWidth: 2, borderColor: DARK.accent,
  },
  stopNodePassed: { borderColor: DARK.green, backgroundColor: 'rgba(52,211,153,0.2)' },
  currentNode: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: DARK.primary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFF',
    shadowColor: DARK.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 8, elevation: 6,
  },
  stopInfoCol: { flex: 1, paddingLeft: 12 },
  stopNameText: { color: DARK.text, fontSize: 14, fontWeight: '600' },
  stopDistText: { color: DARK.textDim, fontSize: 11, marginTop: 2 },

  // CTA
  buyTicketCTA: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: DARK.primary, height: 52, borderRadius: 16, marginTop: 20,
    shadowColor: DARK.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
  buyTicketText: { color: '#FFF', fontSize: 15, fontWeight: '700', marginLeft: 10 },
});
