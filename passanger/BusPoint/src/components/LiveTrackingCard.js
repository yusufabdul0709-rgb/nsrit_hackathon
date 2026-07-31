import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import io from 'socket.io-client';
import { Bus, Clock } from 'lucide-react-native';
import { COLORS } from '../theme/theme';
import tw from 'twrnc';
import { API_BASE_URL } from '../config/api';

export default function LiveTrackingCard() {
  const [trackingData, setTrackingData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(API_BASE_URL);

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('busLocationUpdate', (data) => {
      setTrackingData(data);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!isConnected || !trackingData) {
    return (
      <View style={tw`bg-white rounded-3xl p-5 shadow-sm mb-5 items-center justify-center py-10`}>
        <Text style={tw`text-slate-500 text-sm font-semibold`}>Connecting to Live Radar...</Text>
      </View>
    );
  }

  const isDelayed = trackingData.status === 'delayed';

  return (
    <View style={tw`bg-white rounded-3xl p-5 shadow-sm mb-5`}>
      <View style={tw`flex-row justify-between items-center mb-6`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`bg-[#0D6EFD] w-10 h-10 rounded-full justify-center items-center`}>
            <Bus color="#FFFFFF" size={20} />
          </View>
          <View style={tw`ml-3`}>
            <Text style={tw`text-base font-bold text-slate-800`}>{trackingData.busNumber}</Text>
            <Text style={tw`text-xs text-slate-500 mt-0.5`}>{trackingData.route}</Text>
          </View>
        </View>
        <View style={tw`px-3 py-1.5 rounded-xl ${isDelayed ? 'bg-red-100' : 'bg-emerald-100'}`}>
          <Text style={tw`text-xs font-bold ${isDelayed ? 'text-red-700' : 'text-emerald-800'}`}>
            {trackingData.delay}
          </Text>
        </View>
      </View>

      {/* Live Timeline UI */}
      <View style={tw`relative h-8 justify-center mb-5`}>
        {/* Progress Bar Background */}
        <View style={tw`h-1.5 bg-slate-100 rounded-full w-full overflow-hidden`}>
          <View 
            style={[tw`h-full bg-[#0D6EFD] rounded-full`, { width: `${trackingData.progressPercent}%` }]} 
          />
        </View>
        
        {/* Current Location Marker (Bus) */}
        <View style={[tw`absolute -top-1 w-8 h-8 rounded-full bg-white border-2 border-[#0D6EFD] justify-center items-center shadow-md`, { left: `${trackingData.progressPercent}%`, transform: [{ translateX: -16 }] }]}>
          <Bus color="#0D6EFD" size={16} />
        </View>
      </View>

      <View style={tw`flex-row justify-between items-center`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-[10px] text-slate-500 font-bold mb-1`}>CURRENT / PASSED</Text>
          <Text style={tw`text-sm font-bold text-slate-800`} numberOfLines={1}>{trackingData.currentStop}</Text>
        </View>
        
        <View style={tw`flex-row items-center bg-blue-50 px-2.5 py-1.5 rounded-2xl mx-2`}>
          <Clock color="#0D6EFD" size={16} />
          <Text style={tw`text-xs font-bold text-[#0D6EFD] ml-1`}>{trackingData.etaToNext}</Text>
        </View>
        
        <View style={tw`flex-1 items-end`}>
          <Text style={tw`text-[10px] text-slate-500 font-bold mb-1`}>UPCOMING STOP</Text>
          <Text style={tw`text-sm font-bold text-slate-800`} numberOfLines={1}>{trackingData.nextStop}</Text>
        </View>
      </View>

      {/* AI Insight Badge */}
      {trackingData.aiData && (
        <View style={tw`mt-4 bg-purple-50 p-3 rounded-xl border-l-4 border-purple-600`}>
          <View style={tw`bg-purple-600 self-start px-2 py-1 rounded-md mb-1.5`}>
            <Text style={tw`text-white text-[10px] font-bold`}>✨ AI Insight</Text>
          </View>
          <Text style={tw`text-xs text-purple-900`}>
            <Text style={tw`font-bold`}>Crowd: {trackingData.aiData.crowdLevel} - </Text>
            {trackingData.aiData.aiRecommendation}
          </Text>
        </View>
      )}
    </View>
  );
}
