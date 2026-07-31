import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import io from 'socket.io-client';
import { Bus, Clock, MapPin, Map as MapIcon, ChevronRight } from 'lucide-react-native';
import tw from 'twrnc';
import { API_BASE_URL } from '../config/api';
import { MAPBOX_ACCESS_TOKEN, MOCK_BUS_STOPS } from '../config/mapbox';

export default function LiveTrackingCard() {
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
    aiData: { crowdLevel: 'Medium', aiRecommendation: 'Next stop NAD has less crowd.' }
  });

  const [viewMode, setViewMode] = useState('map'); // 'map' | 'timeline'
  const [isConnected, setIsConnected] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    const socket = io(API_BASE_URL);

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('busLocationUpdate', (data) => {
      if (data) {
        setTrackingData((prev) => ({ ...prev, ...data }));
        if (webViewRef.current && data.lat && data.lng) {
          webViewRef.current.postMessage(JSON.stringify({
            type: 'updateBus',
            lat: data.lat,
            lng: data.lng,
            busNumber: data.busNumber || 'AP 31 TB 4567'
          }));
        }
      }
    });

    socket.on('locationUpdated', (data) => {
      if (data) {
        setTrackingData((prev) => ({ ...prev, lat: data.lat, lng: data.lng }));
        if (webViewRef.current && data.lat && data.lng) {
          webViewRef.current.postMessage(JSON.stringify({
            type: 'updateBus',
            lat: data.lat,
            lng: data.lng,
            busNumber: data.busNumber || 'AP 31 TB 4567'
          }));
        }
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const isDelayed = trackingData.status === 'delayed';

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
    body, html, #map { width: 100%; height: 100%; overflow: hidden; font-family: sans-serif; }
    .bus-marker {
      width: 38px; height: 38px;
      background: linear-gradient(135deg, #0D6EFD, #0052cc);
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 0 15px rgba(13,110,253,0.7);
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: bold; font-size: 16px;
      transition: all 0.5s ease;
    }
    .stop-marker {
      width: 14px; height: 14px;
      background: #ffffff;
      border: 3px solid #0D6EFD;
      border-radius: 50%;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    mapboxgl.accessToken = '${MAPBOX_ACCESS_TOKEN}';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [${trackingData.lng || 83.3012}, ${trackingData.lat || 17.7231}],
      zoom: 12.5,
      interactive: true
    });

    const stops = ${JSON.stringify(MOCK_BUS_STOPS)};
    const coordinates = stops.map(s => [s.lng, s.lat]);

    map.on('load', () => {
      // Add Route Line
      map.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': { 'type': 'LineString', 'coordinates': coordinates }
        }
      });

      map.addLayer({
        'id': 'route-line',
        'type': 'line',
        'source': 'route',
        'layout': { 'line-join': 'round', 'line-cap': 'round' },
        'paint': { 'line-color': '#0D6EFD', 'line-width': 5, 'line-opacity': 0.85 }
      });

      // Add Stop Markers
      stops.forEach(s => {
        const el = document.createElement('div');
        el.className = 'stop-marker';
        new mapboxgl.Marker(el).setLngLat([s.lng, s.lat]).addTo(map);
      });

      // Add Bus Marker
      const busEl = document.createElement('div');
      busEl.className = 'bus-marker';
      busEl.innerHTML = '🚌';
      window.busMarker = new mapboxgl.Marker(busEl)
        .setLngLat([${trackingData.lng || 83.3012}, ${trackingData.lat || 17.7231}])
        .addTo(map);
    });

    // Listen to React Native Messages
    document.addEventListener('message', function(e) {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'updateBus' && window.busMarker) {
          window.busMarker.setLngLat([data.lng, data.lat]);
          map.easeTo({ center: [data.lng, data.lat], duration: 1000 });
        }
      } catch(err) {}
    });
  </script>
</body>
</html>
  `;

  return (
    <View style={tw`bg-white rounded-3xl p-5 shadow-sm mb-5 border border-slate-100`}>
      
      {/* Top Header */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`bg-[#0D6EFD] w-10 h-10 rounded-2xl justify-center items-center`}>
            <Bus color="#FFFFFF" size={20} />
          </View>
          <View style={tw`ml-3`}>
            <View style={tw`flex-row items-center gap-2`}>
              <Text style={tw`text-base font-bold text-slate-800`}>{trackingData.busNumber}</Text>
              <View style={tw`w-2 h-2 rounded-full bg-emerald-500`} />
              <Text style={tw`text-[10px] text-emerald-600 font-bold uppercase`}>Live GPS</Text>
            </View>
            <Text style={tw`text-xs text-slate-500 mt-0.5`}>{trackingData.route}</Text>
          </View>
        </View>

        {/* View Toggle Button */}
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === 'map' ? 'timeline' : 'map')}
          style={tw`bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl flex-row items-center`}
        >
          <MapIcon color="#0D6EFD" size={14} />
          <Text style={tw`text-xs font-bold text-[#0D6EFD] ml-1.5`}>
            {viewMode === 'map' ? 'Timeline' : 'Map View'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Interactive Mapbox Map View */}
      {viewMode === 'map' ? (
        <View style={tw`h-48 w-full rounded-2xl overflow-hidden mb-4 border border-slate-200`}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: mapHTML }}
            style={tw`flex-1`}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false}
          />
        </View>
      ) : (
        /* Live Timeline View */
        <View style={tw`relative h-8 justify-center mb-4`}>
          <View style={tw`h-1.5 bg-slate-100 rounded-full w-full overflow-hidden`}>
            <View style={[tw`h-full bg-[#0D6EFD] rounded-full`, { width: `${trackingData.progressPercent}%` }]} />
          </View>
          <View style={[tw`absolute -top-1 w-8 h-8 rounded-full bg-white border-2 border-[#0D6EFD] justify-center items-center shadow-md`, { left: `${trackingData.progressPercent}%`, transform: [{ translateX: -16 }] }]}>
            <Bus color="#0D6EFD" size={16} />
          </View>
        </View>
      )}

      {/* Stop Information Split */}
      <View style={tw`flex-row justify-between items-center bg-slate-50 p-3.5 rounded-2xl`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-[10px] text-slate-400 font-bold uppercase mb-0.5`}>Passed / Current</Text>
          <Text style={tw`text-xs font-bold text-slate-800`} numberOfLines={1}>{trackingData.currentStop}</Text>
        </View>
        
        <View style={tw`flex-row items-center bg-blue-100 px-2.5 py-1.5 rounded-xl mx-2`}>
          <Clock color="#0D6EFD" size={14} />
          <Text style={tw`text-xs font-bold text-[#0D6EFD] ml-1`}>{trackingData.etaToNext}</Text>
        </View>
        
        <View style={tw`flex-1 items-end`}>
          <Text style={tw`text-[10px] text-slate-400 font-bold uppercase mb-0.5`}>Upcoming Stop</Text>
          <Text style={tw`text-xs font-bold text-slate-800`} numberOfLines={1}>{trackingData.nextStop}</Text>
        </View>
      </View>

      {/* AI Insight Badge */}
      {trackingData.aiData && (
        <View style={tw`mt-3 bg-purple-50 p-3 rounded-xl border-l-4 border-purple-600`}>
          <Text style={tw`text-xs text-purple-900`}>
            <Text style={tw`font-bold`}>✨ AI Crowd Radar: {trackingData.aiData.crowdLevel} - </Text>
            {trackingData.aiData.aiRecommendation}
          </Text>
        </View>
      )}
    </View>
  );
}
